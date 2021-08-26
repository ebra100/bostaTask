import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.CONNECTION_URL)

export default sequelize