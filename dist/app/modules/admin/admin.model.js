"use strict";
/* eslint-disable @typescript-eslint/no-this-alias */
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
exports.Admin = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const AdminSchema = new mongoose_1.Schema({
    role: {
        type: String,
        required: true,
        enum: ['admin'],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    phoneNumber: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: {
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
        },
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret.password; // Exclude password field from the response
            return ret;
        },
    },
    strict: 'throw',
});
AdminSchema.statics.isAdminExist = function (phoneNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.Admin.findOne({ phoneNumber }, { phoneNumber: 1, password: 1, role: 1, id: 1 });
    });
};
AdminSchema.statics.isRefreshedAdminExist = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.Admin.findById(id, {
            phoneNumber: 1,
            password: 1,
            role: 1,
            id: 1,
        });
    });
};
AdminSchema.statics.isPasswordMatched = function (givenPassword, savedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(givenPassword, savedPassword);
    });
};
AdminSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        //hash password
        const user = this;
        user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bycrypt_salt_rounds));
        next();
    });
});
exports.Admin = (0, mongoose_1.model)('Admin', AdminSchema);
