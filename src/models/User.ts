import { DataTypes } from "sequelize";
import sequelize from "../config/dbConnection"
const bcrypt = require("bcrypt")
const User = sequelize.define('User', {
    // Model attributes are defined here
    firstName: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    verificationCode: {
        type: DataTypes.STRING
    },
    kioskType: {
        type: DataTypes.INTEGER
    },
    isVerified: {
        type: DataTypes.BOOLEAN
    }
});

User.beforeCreate(async (user: any, options) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

}); export default User;