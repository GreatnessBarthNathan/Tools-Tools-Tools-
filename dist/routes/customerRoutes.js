"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerControllers_1 = require("../controllers/customerControllers");
const router = (0, express_1.Router)();
router.post("/", customerControllers_1.createCustomer);
router.get("/", customerControllers_1.getAllCustomers);
router.get("/:id", customerControllers_1.getSingleCustomer);
router.patch("/:id", customerControllers_1.updateCustomer);
router.delete("/:id", customerControllers_1.deleteCustomer);
exports.default = router;
//# sourceMappingURL=customerRoutes.js.map