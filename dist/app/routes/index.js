"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../modules/user/user.routes");
const cow_routes_1 = require("../modules/cow/cow.routes");
const order_routes_1 = require("../modules/order/order.routes");
const admin_routes_1 = require("../modules/admin/admin.routes");
const auth_route_1 = require("../modules/auth/auth.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/users',
        route: user_routes_1.UserRoutes,
    },
    {
        path: '/admins',
        route: admin_routes_1.AdminRoutes,
    },
    {
        path: '/books',
        route: cow_routes_1.CowRoutes,
    },
    {
        path: '/orders',
        route: order_routes_1.OrderRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
