
import { DataTypes, Optional, Model } from "sequelize";
import sequelize from "../config/dbConnection"

const Check = sequelize.define<Model, {}>('Report', {

    checkId: {
        type: DataTypes.INTEGER
    },
    userId: {
        type: DataTypes.INTEGER
    },
    availability: {
        type: DataTypes.INTEGER
    },
    outages: {
        type: DataTypes.INTEGER
    },
    downtime: {
        type: DataTypes.INTEGER
    },
    uptime: {
        type: DataTypes.INTEGER
    },
    responseTime: {
        type: DataTypes.JSON
    },

    history: {
        type: DataTypes.ARRAY(DataTypes.JSON)
    },
}, {
        indexes: [
            {
                fields: ['userId']
            }
        ]
    });

export default Check;