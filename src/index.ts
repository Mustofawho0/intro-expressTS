import express, { Express, Request, Response } from "express";
import { IUser, IUserJSON } from "./type";
import { ReadFile, WriteFile } from "./utils/fs";

const app: Express = express();
app.use(express.json());
const port = 5000;

app.get("/", (req: Request, res: Response) => {
  res.send(`<h1>Hello World TYPESCRIPT EXPRESS</h1>`);
});

app.get("/users", (req: Request, res: Response) => {
  try {
    // Step01 -> Read db.json
    // Step02 -> Destructure object, get users only
    const { users } = ReadFile();
    // Step03 -> Send response (users Data)
    return res.send(users);
  } catch (error) {
    console.log(error);
  }
});

app.post("/users", (req: Request, res: Response) => {
  try {
    const user: IUser = req.body;

    // Step01 -> Read db.json
    const db = ReadFile();
    // Step02 -> Get segment user data
    const users: IUserJSON[] = db.users;
    // Step03 -> Manipulate Data db
    users.push({
      id: users[users.length - 1].id + 1,
      ...user,
    });
    // Step04 -> reWrite db.json for users
    db.users = users; // Perlu ngga perlu
    // Step05 -> Update users data in db.json
    WriteFile(db);
    return res.send("Create Success");
  } catch (error) {
    console.log(error);
  }
});

app.delete("/users/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Step01 -> Read db.json
    const db = ReadFile();
    // Step02 -> Get segment user data
    const users: IUserJSON[] = db.users;
    // Step03 -> Manipulate Data db
    const filteredUsers = users.filter((delUser) => delUser.id !== Number(id));
    // Step04 -> reWrite db.json for users
    db.users = filteredUsers; // Perlu ngga perlu
    // Step05 -> Update users data in db.json
    WriteFile(db);
    return res.send(`Delete ID : ${id} Success`);
  } catch (error) {
    console.log(error);
  }
});

app.put("/users/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const db = ReadFile()
    const user: IUserJSON[] = db.users.map((updatedUser: IUserJSON ) =>{
        if(updatedUser.id === Number(id)){
            return {
                ...user,
                ...req.body
            }
        }
    })
    WriteFile(db)
    return res.send("Data Update")
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`🐣 [server]: Server Running at http://localhost:${port}`);
});
