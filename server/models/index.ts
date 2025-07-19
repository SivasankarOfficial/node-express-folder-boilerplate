import sequelize from "../config/db";
import { UserModel } from "./user.model";

const db = {
  sequelize,
  User: UserModel(sequelize),
};

export default db;
