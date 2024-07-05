import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors/customErrors"
import { Request, Response } from "express"
import User from "../models/userModel"
import { encode, confirmPassword } from "../utils/auth"
import { StatusCodes } from "http-status-codes"
import { createJwt } from "../utils/tokenUtils"

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, branch, userName, password } = req.body
  if (!firstName || !lastName || !branch || !userName || !password) {
    throw new BadRequestError("please provide all values")
  }

  const firstUser = (await User.countDocuments()) === 0
  if (firstUser) {
    req.body.role = "admin"
  }

  const existingUser = await User.findOne({ userName })
  if (existingUser) {
    throw new BadRequestError("user already exist")
  }

  req.body.password = await encode(password)

  await User.create(req.body)

  res.status(StatusCodes.CREATED).json({ msg: "user created" })
}

export const login = async (req: Request, res: Response) => {
  const { userName, password } = req.body

  const userExists = await User.findOne({ userName })
  if (!userExists) throw new NotFoundError("user does not exist")

  const passwordCorrect = await confirmPassword(password, userExists.password)
  if (!passwordCorrect) throw new UnauthenticatedError("Authentication invalid")

  const payload = {
    _id: userExists._id,
    userName: userExists.userName,
    role: userExists.role,
  }
  const token = createJwt(payload)
  const oneDay = 1000 * 60 * 60 * 24

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + oneDay),
  })

  res.status(StatusCodes.OK).json({ msg: "user logged in" })
}

export const logout = (req: Request, res: Response) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  })

  res.status(StatusCodes.OK).json({ msg: "Logged out..." })
}
