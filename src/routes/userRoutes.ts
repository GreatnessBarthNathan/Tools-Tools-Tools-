import express from "express"
import {
  allUsers,
  currentUser,
  singleUser,
  updateUser,
  forgotPassword,
  changePassword,
} from "../controllers/userControllers"

const router = express.Router()

router.get("/", allUsers)

router.get("/current-user", currentUser)

router.post("/forgot-password", forgotPassword)

router.post("/change-password", changePassword)

router.patch("/update-user/:id", updateUser)

router.get("/:id", singleUser)

export default router
