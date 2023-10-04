"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const book_constants_1 = require("./book.constants");
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const book_model_1 = require("./book.model");
const createBook = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_model_1.Book.create(payload);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to add Book');
    }
    return result;
});
const getAllBook = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, publicationDate } = filters, filtersData = __rest(filters, ["searchTerm", "publicationDate"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: book_constants_1.CowSearchAbleFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    if (publicationDate) {
        andConditions.push({
            $or: [
                {
                    publicationDate: {
                        $regex: publicationDate,
                        $options: 'i',
                    },
                },
            ],
            // $or: CowSearchAbleFields.map(field => ({
            //   [field]: {
            //     $regex: searchTerm,
            //     $options: 'i',
            //   },
            // })),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const { page, sortBy, sortOrder } = paginationHelpers_1.paginationHelper.calculatePagination(paginationOptions);
    const sortCondition = {};
    if (sortBy && sortOrder) {
        sortCondition[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield book_model_1.Book.find(whereConditions).sort(sortCondition);
    const total = yield book_model_1.Book.countDocuments(whereConditions);
    return {
        meta: {
            page,
            total,
        },
        data: result,
    };
});
const getSingleBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_model_1.Book.findById(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Book not found!');
    }
    return result;
});
const updateBook = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield book_model_1.Book.findById(id);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Book not found!');
    }
    if (payload.reviews) {
        const result = yield book_model_1.Book.findByIdAndUpdate(id, { $push: { reviews: payload.reviews } }, { new: true });
        return result;
    }
    else {
        const result = yield book_model_1.Book.findByIdAndUpdate(id, payload, {
            new: true, // return new document of the DB
        });
        return result;
    }
    //ANOTHER SOLUTION
    // const { reviews, ...payload } = req.body;
    //  let updateObject: any = {};
    //  // Check if 'reviews' field is present in the payload
    //  if (reviews) {
    //    updateObject.$push = { reviews }; // Use the reviews directly to update the reviews field
    //  }
    //  // Include other fields in the updateObject
    //  if (Object.keys(payload).length > 0) {
    //    updateObject = { ...updateObject, ...payload };
    //  }
    //  const updatedBook = await Book.findByIdAndUpdate(id, updateObject, {
    //    new: true,
    //  });
});
const deleteBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_model_1.Book.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete Book');
    }
    return result;
});
exports.CowService = {
    createBook,
    getAllBook,
    getSingleBook,
    updateBook,
    deleteBook,
};
