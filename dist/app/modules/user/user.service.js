"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.UserService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importStar(require("mongoose"));
const user_model_1 = require("./user.model");
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const cow_model_1 = require("../cow/cow.model");
const config_1 = __importDefault(require("../../../config"));
const createMyProfile = (tokenUser) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(tokenUser === null || tokenUser === void 0 ? void 0 : tokenUser.id)
        .select('phoneNumber name address')
        .exec();
    return result;
});
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let newUserData = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const newUser = yield user_model_1.User.create([user], { session });
        if (!newUser.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create user');
        }
        newUserData = newUser[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User Already Exists with this phone number');
    }
    if (newUserData) {
        newUserData = yield user_model_1.User.findOne({ _id: newUserData._id });
    }
    return newUserData;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find().sort();
    const total = yield user_model_1.User.countDocuments();
    return {
        meta: {
            page: 1,
            limit: 2,
            total,
        },
        data: result,
    };
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    return result;
});
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield user_model_1.User.findById(id);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const { name } = payload, userData = __rest(payload, ["name"]);
    const updatedStudentData = Object.assign({}, userData);
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach(key => {
            const nameKey = `name.${key}`;
            updatedStudentData[nameKey] = name[key];
        });
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, updatedStudentData, {
        new: true, // return new document of the DB
    });
    return result;
});
const updateMyProfile = (tokenUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const objectId = new mongoose_1.Types.ObjectId(tokenUser === null || tokenUser === void 0 ? void 0 : tokenUser.id);
    const isExist = yield user_model_1.User.findById(objectId);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const { name, password } = payload, userData = __rest(payload, ["name", "password"]);
    const updatedStudentData = Object.assign({}, userData);
    // Take out Nested name properties
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach(key => {
            const nameKey = `name.${key}`;
            updatedStudentData[nameKey] = name[key];
        });
    }
    //Hash password
    if (password) {
        const hashedPass = yield bcrypt_1.default.hash(password, Number(config_1.default.bycrypt_salt_rounds));
        updatedStudentData.password = hashedPass;
    }
    const result = yield user_model_1.User.findByIdAndUpdate(objectId, updatedStudentData, {
        new: true, // return new document of the DB
    })
        .select('phoneNumber name address')
        .exec();
    return result;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let deleteUser = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const isExist = yield user_model_1.User.findById(id);
        if (!isExist) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
        }
        const deletedCow = yield cow_model_1.Cow.deleteMany({ seller: id }, { session });
        if (!deletedCow) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete cows');
        }
        deleteUser = yield user_model_1.User.findByIdAndDelete(id, { session });
        if (!deleteUser) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete user');
        }
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    return deleteUser;
});
exports.UserService = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    createMyProfile,
    updateMyProfile,
};
