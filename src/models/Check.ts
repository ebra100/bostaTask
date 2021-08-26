
import { DataTypes, Optional, Model } from "sequelize";
import sequelize from "../config/dbConnection"

const Check = sequelize.define<Model, {}>('Checks', {

    name: {
        type: DataTypes.STRING
    },
    userId: {
        type: DataTypes.INTEGER
    },
    url: {
        type: DataTypes.STRING
    },
    protocol: {
        type: DataTypes.STRING,
        enum: ['HTTP', 'HTTPS', 'TCP']
    },
    path: {
        type: DataTypes.STRING
    },
    authentication: {
        type: DataTypes.JSON
    },
    headers: {
        type: DataTypes.JSON
    },
    port: {
        type: DataTypes.STRING
    },
    webhook: {
        type: DataTypes.STRING
    },
    timeout: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
    },
    threshold: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    interval: {
        type: DataTypes.INTEGER,
        defaultValue: 10
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.INTEGER)
    },
    isPaused: {
        type: DataTypes.BOOLEAN,
        default: false
    },
    lastCheckDate: {
        type: DataTypes.DATE
    },
    nextCheckDate: {
        type: DataTypes.DATE,
        defaultValue: new Date()
    },
    availability: {
        type: DataTypes.INTEGER
    },
    outages: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    hitNumber: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    downtime: {
        type: DataTypes.INTEGER,
        defaultValue: 0

    },
    uptime: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    totalResponseTime: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    avgResponseTime: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    history: {
        type: DataTypes.ARRAY(DataTypes.JSON)
    },
}, {
        indexes: [
            {
                fields: ['nextCheckDate']
            },
            {
                fields: ['userId']
            },
            {
                fields: ['userId', 'url'],
                unique: true
            },
        ]
    });

export default Check;