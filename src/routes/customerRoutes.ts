import { Router } from "express"
import {
  createCustomer,
  getAllCustomers,
  getSingleCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerControllers"

const router = Router()

router.post("/", createCustomer)

router.get("/", getAllCustomers)

router.get("/:id", getSingleCustomer)

router.patch("/:id", updateCustomer)

router.delete("/:id", deleteCustomer)

export default router
