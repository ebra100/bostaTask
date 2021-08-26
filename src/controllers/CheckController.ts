import CheckRepo from "../Repository/CheckRepo"
import TagsRepo from "../Repository/TagsRepo";
import integrationService from "../services/integrationService";
import checkService from "../services/checkService";

export class CheckController {

    async createCheck(req, res) {

        try {

            req.body.userId = req.user.id;

            let check = await CheckRepo.createCheck(req.body)
            return res.send({ status: "OK", result: check });


        } catch (error) {

            console.log(error);
            return res.status(error.statusCode).send({ status: error.status, message: error.message })
        }

    }

    async pauseCheck(req, res) {

        try {

            let id = req.body.id;
            let check = await CheckRepo.updateCheck({ id: id }, { isPaused: true });

            return res.send({ status: "OK", result: check });

        } catch (error) {

            console.log(error);
            return res.status(error.statusCode).send({ status: error.status, message: error.message })
        }
    }

    async deleteCheck(req, res) {

        try {

            let id = req.body.id;
            await CheckRepo.deleteCheck({ id: id });

            return res.send({ status: "OK" });

        } catch (error) {

            console.log(error);
            return res.status(error.statusCode).send({ status: error.status, message: error.message })
        }
    }

    async updateCheck(req, res) {

        try {
            let id = req.body.id;
            let updatedData = req.body.updatedData;

            let check = await CheckRepo.updateCheck({ id: id }, updatedData);
            return res.send({ status: "OK", result: check });

        } catch (error) {

            console.log(error);
            return res.status(error.statusCode).send({ status: error.status, message: error.message })
        }
    }

    async groupChecksByTag(req, res) {

        try {

            let tagName = req.body.tagName;
            let checkIds = req.body.checkIds;

            let tag: any = await TagsRepo.createTag({ name: tagName, checkIds: checkIds });

            await CheckRepo.updateTagArray(tag.id, checkIds);

            return res.send({ status: "OK", result: tag });

        } catch (error) {

            console.log(error);
            return res.status(error.statusCode).send({ status: error.status, message: error.message })
        }
    }

    async getMyChecs(req, res) {

        try {

            let userId = req.user.id;

            let checks = await CheckRepo.findUserCheckReport({ userId: userId });

            let checkRerquests = checkService.getCheckRequests(checks)
            let checkResponses = await (Promise as any).allSettled(checkRerquests);

            for (let index = 0; index < checkResponses.length; index++) {

                const element = checkResponses[index];
                let check = checks[index]

                check['currentStatus'] = checkService.getStatus(element)
            }

            let checkReport = checks.map((item: any) => ({

                availability: item.availability,
                outages: item.outages,
                uptime: item.uptime,
                downtime: item.downtime,
                currentStatus: item.currentStatus,
                responseTime: item.avgResponseTime
            }))

            return res.send({ status: "OK", result: checkReport });

        } catch (error) {

            console.log(error);
            return res.status(error.statusCode).send({ status: error.status, message: error.message })
        }

    }
}