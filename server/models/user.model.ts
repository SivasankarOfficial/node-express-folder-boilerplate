import { DataTypes, Sequelize } from "sequelize";

export const UserModel = (sequelize: Sequelize) => {
  return sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM("client", "freelancer"),
    },
  });
};
