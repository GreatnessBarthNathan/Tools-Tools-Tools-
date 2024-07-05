"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderControllers_1 = require("../controllers/orderControllers");
const router = (0, express_1.Router)();
router.post("/", orderControllers_1.createOrder);
router.get("/", orderControllers_1.getAllOrders);
router.get("/return-item", orderControllers_1.returnItem);
router.get("/profit", orderControllers_1.getProfit);
router.patch("/:id", orderControllers_1.updateOrder);
router.delete("/:id", orderControllers_1.deleteOrder);
router.get("/:id", orderControllers_1.singleOrder);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map