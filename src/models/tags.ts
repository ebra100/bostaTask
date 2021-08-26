import { DataTypes } from "sequelize";
import sequelize from "../config/dbConnection"

const User = sequelize.define('Tags', {
    // Model attributes are defined here
    name: {
        type: DataTypes.STRING
    },
    checkIds: {
        type: DataTypes.ARRAY(DataTypes.JSON)
    }
});

export default User;