"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = require("./utils/fs");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 5000;
app.get("/", (req, res) => {
    res.send(`<h1>Hello World TYPESCRIPT EXPRESS</h1>`);
});
app.get("/users", (req, res) => {
    try {
        // Step01 -> Read db.json
        // Step02 -> Destructure object, get users only
        const { users } = (0, fs_1.ReadFile)();
        // Step03 -> Send response (users Data)
        return res.send(users);
    }
    catch (error) {
        console.log(error);
    }
});
app.post("/users", (req, res) => {
    try {
        const user = req.body;
        // Step01 -> Read db.json
        const db = (0, fs_1.ReadFile)();
        // Step02 -> Get segment user data
        const users = db.users;
        // Step03 -> Manipulate Data db
        users.push(Object.assign({ id: users[users.length - 1].id + 1 }, user));
        // Step04 -> reWrite db.json for users
        db.users = users; // Perlu ngga perlu
        // Step05 -> Update users data in db.json
        (0, fs_1.WriteFile)(db);
        return res.send("Create Success");
    }
    catch (error) {
        console.log(error);
    }
});
app.delete("/users/:id", (req, res) => {
    try {
        const { id } = req.params;
        // Step01 -> Read db.json
        const db = (0, fs_1.ReadFile)();
        // Step02 -> Get segment user data
        const users = db.users;
        // Step03 -> Manipulate Data db
        const filteredUsers = users.filter((delUser) => delUser.id !== Number(id));
        // Step04 -> reWrite db.json for users
        db.users = filteredUsers; // Perlu ngga perlu
        // Step05 -> Update users data in db.json
        (0, fs_1.WriteFile)(db);
        return res.send(`Delete ID : ${id} Success`);
    }
    catch (error) {
        console.log(error);
    }
});
app.put("/users/:id", (req, res) => {
    try {
        const { id } = req.params;
        const db = (0, fs_1.ReadFile)();
        const users = db.users;
        // const updatedUser = users.map((user) => {
        //   return user.id === Number(id) ? { ...user, ...req.body } : user;
        // });
        // db.users = updatedUser;
        // const {username, email, password} = req.body
        // if (!username || !email || !password) throw new Error('Data not Complete!')
        // const indexOfUser = users.findIndex((user) => user.id === Number(id));
        // if (indexOfUser === -1) throw new Error(`User with ID ${id} Not Found`);
        // users[indexOfUser] = {
        //   id: users[indexOfUser].id,
        //   username: req.body.username,
        //   email: req.body.email,
        //   password: req.body.password,
        // };
        const { username, email, password } = req.body;
        for (let user of users) {
            if (user.id === Number(id)) {
                user.username = username,
                    user.email = email,
                    user.password = password;
            }
        }
        (0, fs_1.WriteFile)(db);
        return res.send(`Data with ID ${id} Updated Success`);
    }
    catch (error) {
        console.log(error);
    }
});
app.listen(port, () => {
    console.log(`🐣 [server]: Server Running at http://localhost:${port}`);
});
