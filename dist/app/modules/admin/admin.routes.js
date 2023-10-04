"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validationRequest_1 = require("../../middleware/validationRequest");
const admin_validation_1 = require("./admin.validation");
const admin_contoller_1 = require("./admin.contoller");
const router = express_1.default.Router();
router.post('/create-admin', validationRequest_1.requestValidation.validateRequest(admin_validation_1.AdminValidation.createAdminZodSchema), admin_contoller_1.AdminController.createAdmin);
router.post('/login', validationRequest_1.requestValidation.validateRequest(admin_validation_1.AdminValidation.loginZodSchema), admin_contoller_1.AdminController.loginAdmin);
router.post('/refresh-token', validationRequest_1.requestValidation.validateRequest(admin_validation_1.AdminValidation.refreshTokenZodSchema), admin_contoller_1.AdminController.refreshToken);
exports.AdminRoutes = router;
