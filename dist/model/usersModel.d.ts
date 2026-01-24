export interface User {
    id: string;
    email: string;
    password: string;
    role: "user" | "admin";
}
export declare function readUsers(): User[];
export declare function saveUsers(users: User[]): void;
//# sourceMappingURL=usersModel.d.ts.map