"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationHelper = void 0;
const calculatePagination = (options) => {
    const page = Number(options.page || 1);
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';
    return {
        page,
        sortBy,
        sortOrder,
    };
};
exports.paginationHelper = {
    calculatePagination,
};
