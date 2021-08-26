import { IUserRepo } from "../interfaces/UserRepo";
import User from "../models/User"
import { Op } from 'sequelize';

class UserRepo implements IUserRepo {

    async createUser(data) {

        try {

            let email = data.email;
            let user: any = await this.getUserByField(email, 'email');

            if (user) {
                throw { statusCode: 400, status: "USER_ALREADY_EXISTS", message: "this email has been already registered" }
            }

            data.verificationCode = new Date().setMinutes(new Date().getMinutes() + 10)

            user = await User.create(user)

            return user;

        } catch (error) {

            console.log(error);

            throw {
                statusCode: 500, status: "SERVER_ERROR", message: "something went wrong , please try again later"
            }
        }

    }

    async getUsersEmailsByIds(ids) {

        let users = await User.findAll({ where: { id: ids }, attributes: ['email', 'id'] })

        return users;
    }

    async getUserByField(fieldValue, fieldName) {

        try {

            let user = await User.findOne({ where: { [fieldName]: fieldValue } })

            return user

        } catch (error) {

            console.log(error);

            throw {
                statusCode: 500, status: "SERVER_ERROR", message: "something went wrong , please try again later"
            }
        }

    }
}

export default new UserRepo()