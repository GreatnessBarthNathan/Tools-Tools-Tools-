import { Router } from "express"
import {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productControllers"

const router = Router()

router.post("/", createProduct)

router.get("/", getProducts)

router.get("/:id", getSingleProduct)

router.patch("/:id", updateProduct)

router.delete("/:id", deleteProduct)

export default router
