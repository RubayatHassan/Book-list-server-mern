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
exports.User = void 0;
/* eslint-disable @typescript-eslint/no-this-alias */
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const UserSchema = new mongoose_1.Schema({
    password: {
        type: String,
        required: true,
    },
    name: {
        type: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
        },
    },
    email: {
        type: String,
        unique: true,
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
    strict: 'throw', // Add the strict option here
});
UserSchema.statics.isUserExist = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ email });
    });
};
UserSchema.statics.isRefreshedUserExist = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findById(id, {
            password: 1,
            id: 1,
        });
    });
};
UserSchema.statics.isPasswordMatched = function (givenPassword, savedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(givenPassword, savedPassword);
    });
};
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        //hash password
        const user = this;
        user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bycrypt_salt_rounds));
        next();
    });
});
exports.User = (0, mongoose_1.model)('User', UserSchema);
