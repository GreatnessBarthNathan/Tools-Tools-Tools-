import { Router } from "express"
import {
  createOrder,
  getAllOrders,
  deleteOrder,
  returnItem,
  singleOrder,
  getProfit,
  updateOrder,
} from "../controllers/orderControllers"

const router = Router()

router.post("/", createOrder)

router.get("/", getAllOrders)

router.get("/return-item", returnItem)

router.get("/profit", getProfit)

router.patch("/:id", updateOrder)

router.delete("/:id", deleteOrder)

router.get("/:id", singleOrder)

export default router
