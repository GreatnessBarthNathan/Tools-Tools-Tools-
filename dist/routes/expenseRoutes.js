"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expenseControllers_1 = require("../controllers/expenseControllers");
const router = (0, express_1.Router)();
router.post("/", expenseControllers_1.createExpense);
router.get("/", expenseControllers_1.allExpenses);
router.get("/:id", expenseControllers_1.singleExpense);
router.patch("/:id", expenseControllers_1.updateExpense);
router.delete("/:id", expenseControllers_1.deleteExpense);
exports.default = router;
//# sourceMappingURL=expenseRoutes.js.map