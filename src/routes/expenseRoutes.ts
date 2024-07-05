import { Router } from "express"
import {
  createExpense,
  allExpenses,
  singleExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseControllers"

const router = Router()

router.post("/", createExpense)

router.get("/", allExpenses)

router.get("/:id", singleExpense)

router.patch("/:id", updateExpense)

router.delete("/:id", deleteExpense)

export default router
