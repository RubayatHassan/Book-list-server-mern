"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const order_controllers_1 = require("./order.controllers");
const validationRequest_1 = require("../../middleware/validationRequest");
const order_validation_1 = require("./order.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.post('/order-create', (0, auth_1.default)(user_1.ENUM_USER_ROLE.BUYER), validationRequest_1.requestValidation.validateRequest(order_validation_1.OrderValidation.createOrderZodSchema), order_controllers_1.OrderController.createOrders);
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SELLER, user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.ADMIN), order_controllers_1.OrderController.getAllOrders);
router.get('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SELLER, user_1.ENUM_USER_ROLE.BUYER), order_controllers_1.OrderController.getOrder);
exports.OrderRoutes = router;
