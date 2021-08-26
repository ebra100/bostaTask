import Tags from "../models/tags"

class ReportRepo  {

    async createTag(data) {

        try {

            let tag = await Tags.create(data)
            return tag

        } catch (error) {

            console.log(error);

            throw {
                statusCode: 500, status: "SERVER_ERROR", message: "something went wrong , please try again later"
            }
        }

    }

}

export default new ReportRepo()