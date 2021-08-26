import User from "../models/User"

class ReportRepo  {

    async createReport(data) {

        try {



        } catch (error) {

            console.log(error);

            throw {
                statusCode: 500, status: "SERVER_ERROR", message: "something went wrong , please try again later"
            }
        }

    }

    async getUserByField(fieldValue, fieldName) {

        try {

            let user = await User.findOne({ [fieldName]: fieldValue })

            return user

        } catch (error) {

            console.log(error);

            throw {
                statusCode: 500, status: "SERVER_ERROR", message: "something went wrong , please try again later"
            }
        }

    }
}

export default new ReportRepo()