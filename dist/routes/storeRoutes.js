"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const storeControllers_1 = require("../controllers/storeControllers");
const router = (0, express_1.Router)();
router.post("/", storeControllers_1.createStoreProduct);
router.get("/", storeControllers_1.calcStoreWorth);
router.patch("/:id", storeControllers_1.updateStore);
exports.default = router;
//# sourceMappingURL=storeRoutes.js.map