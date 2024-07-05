import { Router } from "express"
import {
  calcStoreWorth,
  createStoreProduct,
  updateStore,
} from "../controllers/storeControllers"

const router = Router()

router.post("/", createStoreProduct)

router.get("/", calcStoreWorth)

router.patch("/:id", updateStore)

export default router
