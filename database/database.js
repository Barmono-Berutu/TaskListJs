import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize("Crud_TaskListJs", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export { sequelize, DataTypes };
