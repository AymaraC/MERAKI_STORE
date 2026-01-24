"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDataBase = readDataBase;
exports.save = save;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const filePath = path_1.default.join(__dirname, '../database/orders.json');
;
function readDataBase() {
    const data = fs_1.default.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}
;
function save(orders) {
    fs_1.default.writeFileSync(filePath, JSON.stringify(orders, null, 2));
}
;
//# sourceMappingURL=ordersModel.js.map