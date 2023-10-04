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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSevice = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const config_1 = __importDefault(require("../../../config"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const mongoose_1 = __importDefault(require("mongoose"));
const admin_model_1 = require("./admin.model");
const createAdmin = (admin) => __awaiter(void 0, void 0, void 0, function* () {
    let newAdminData = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        admin.role = 'admin';
        const newAdmin = yield admin_model_1.Admin.create([admin], { session });
        if (!newAdmin.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create admin');
        }
        newAdminData = newAdmin[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Admin Already Exists with this phone number');
    }
    if (newAdminData) {
        newAdminData = yield admin_model_1.Admin.findOne({ _id: newAdminData._id }).select({
            password: 0,
        });
    }
    return newAdminData;
});
const loginAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password } = payload;
    //  // access to our instance methods
    const isAdminExist = yield admin_model_1.Admin.isAdminExist(phoneNumber);
    if (!isAdminExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Admin does not exist');
    }
    if (isAdminExist.password &&
        !(yield admin_model_1.Admin.isPasswordMatched(password, isAdminExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
    }
    //create access token & refresh token
    const { id, role } = isAdminExist;
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ id, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ id, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    //verify token
    // invalid token - synchronous
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    const { id } = verifiedToken;
    // case- admin deleted but he has refresh token
    // checking deleted admin's refresh token
    const isAdminExist = yield admin_model_1.Admin.isRefreshedAdminExist(id);
    if (!isAdminExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Admin does not exist');
    }
    //generate new token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({
        id: isAdminExist.id,
        role: isAdminExist.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
exports.AdminSevice = {
    createAdmin,
    loginAdmin,
    refreshToken,
};
