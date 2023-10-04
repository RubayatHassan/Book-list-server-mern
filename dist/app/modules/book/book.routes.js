"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_controllers_1 = require("./book.controllers");
const book_validation_1 = require("./book.validation");
const validationRequest_1 = require("../../middleware/validationRequest");
const router = express_1.default.Router();
router.post('/add-book', validationRequest_1.requestValidation.validateRequest(book_validation_1.BookValidation.addBookZodSchema), book_controllers_1.CowController.addBook);
router.get('/', book_controllers_1.CowController.getAllCows);
router.get('/:id', book_controllers_1.CowController.getSingleCow);
router.delete('/:id', book_controllers_1.CowController.deleteCow);
router.patch('/:id', validationRequest_1.requestValidation.validateRequest(book_validation_1.BookValidation.updateCowZodSchema), book_controllers_1.CowController.updateCow);
exports.CowRoutes = router;
