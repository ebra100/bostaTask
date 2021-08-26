import Check from "../models/Check"
import { Op } from "sequelize"
import {fn , col} from "sequelize";

class CheckRepo {

    async createCheck(data) {

        try {

            let userId = data.userId;
            let url = new URL(data.url)

            let check: any = await this.findCheckByBasicQuery({ userId: userId, url: data.url })

            if (check) throw {
                statusCode: 400, status: "CHECK_ALREADY_EXISTS", message: "this check is already exists"
            }

            let checkData = {
                userId: data.userId,
                name: data.name,
                url: data.url,
                interval: data.interval,
                protocol: url.protocol.replace(":", "").toUpperCase(),
                path: url.pathname,
                port: url.port,
                threshold: data.threshold,
                timeout: data.timeout,
                authentication: data.authentication,
                webhook: data.webhook,

            }

            check = Check.create(checkData);

            return check;

        } catch (error) {

            console.log(error);

            throw {
                statusCode: 500, status: "SERVER_ERROR", message: "something went wrong , please try again later"
            }
        }

    }

    async findCheckByBasicQuery(query) {

        try {

            let check = await Check.findOne({ where: query })

            return check

        } catch (error) {

            console.log(error);

            throw {
                statusCode: 500, status: "SERVER_ERROR", message: "something went wrong , please try again later"
            }

        }
    }

    async findUserCheckReport(query) {

        try {

            let check = await Check.findAll({ where: query } )

            return check

        } catch (error) {

            console.log(error);

            throw {
                statusCode: 500, status: "SERVER_ERROR", message: "something went wrong , please try again later"
            }

        }
    }

    async findChecksByIds(ids) {


        try {

            let checks = await Check.findAll({ where: { checksIds: { [Op.in]: ids } } })

            return checks

        } catch (error) {

            console.log(error);

            throw {
                statusCode: 500, status: "SERVER_ERROR", message: "something went wrong , please try again later"
            }

        }

    }

    async getInTurnChecks(paginationObject) {


        try {

            let checks = await Check.findAll({
                where: {
                    isPaused: false,
                    nextCheckedDate: {
                        [Op.lte]: new Date()
                    }
                }, offset: paginationObject.pageLimit * paginationObject.pageNumbebr, limit: paginationObject.pageLimit
            })
            return checks

        } catch (error) {

            console.log(error);

            throw {
                statusCode: 500, status: "SERVER_ERROR", message: "something went wrong , please try again later"
            }

        }

    }

    async updateCheck(query, update) {

        try {

            let check = await Check.update(update, { where: query })
            return check

        } catch (error) {

            console.log(error);

            throw {
                statusCode: 500, status: "SERVER_ERROR", message: "something went wrong , please try again later"
            }

        }

    }

    updateTagArray(tagId , checkIds) {

        Check.update(
            {'job_ids': fn('array_append', col('job_ids'), tagId)},
            {'where': {'id': {[Op.in] :  checkIds}}}
           );
           
    }

    updateCheckPromise(query, update) {

        try {

            let check = Check.update(update, { where: query });
            
            return check

        } catch (error) {

            console.log(error);

            throw {
                statusCode: 500, status: "SERVER_ERROR", message: "something went wrong , please try again later"
            }

        }

    }

    async deleteCheck(query) {

        try {

            await Check.destroy(query)

        } catch (error) {


            console.log(error);

            throw {
                statusCode: 500, status: "SERVER_ERROR", message: "something went wrong , please try again later"
            }

        }

    }


    async getCount() {

        return await Check.count();
    }
}

export default new CheckRepo();