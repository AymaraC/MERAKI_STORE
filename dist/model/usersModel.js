"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readUsers = readUsers;
exports.saveUsers = saveUsers;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const filePath = path_1.default.join(__dirname, '../database/users.json');
function readUsers() {
    const data = fs_1.default.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}
;
function saveUsers(users) {
    fs_1.default.writeFileSync(filePath, JSON.stringify(users, null, 2));
}
;
//# sourceMappingURL=usersModel.js.map