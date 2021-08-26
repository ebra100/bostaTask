import CheckRepo from "../Repository/CheckRepo";
import IntegrationService from "../services/integrationService"
import UserRepo from "../Repository/UserRepo";
import notficationFactory from "../Factory/notficationFactory";
import { NotificationService } from "./notificationService";

class CheckService {

    async excute() {

        try {

            let checkRequests;
            let count = await CheckRepo.getCount();

            let pageLimit = 50
            let numberOfPages = Math.ceil(count / 50);

            for (let pageNumbebr = 0; pageNumbebr < numberOfPages; pageNumbebr++) {

                let checks = await CheckRepo.getInTurnChecks({ pageLimit, pageNumbebr });
                checkRequests = this.getCheckRequests(checks);
                let checkResponse = await (Promise as any).allSettled(checkRequests);
                await this.handleChecksResponses(checks, checkResponse)

            }

        } catch (error) {

            console.log(error);

        }
    }

    getCheckRequests(checks) {

        let promiseArray = [];

        for (let index = 0; index < checks.length; index++) {

            const element = checks[index];
            let checkRequest = IntegrationService.checkRequest(element);
            promiseArray.push(checkRequest);

        }

        return promiseArray
    }

    async handleChecksResponses(checks, checkResponses) {

        let updateChecksPromiseArray = [];
        let finalStatusResult = [];

        for (let index = 0; index < checkResponses.length; index++) {

            const element = checkResponses[index];
            let check = checks[index]

            let formattedChecksObject = this.calculateCheckReportService(element, check)
            await this.handleThreshold(formattedChecksObject, check)
            finalStatusResult.push({ status: formattedChecksObject['status'], ...check });
            delete formattedChecksObject['status']
            delete formattedChecksObject['statusCode']
            let updatePromise = CheckRepo.updateCheckPromise({ id: check.id }, formattedChecksObject);
            updateChecksPromiseArray.push(updatePromise)
        }

        await this.handleFailuresForAlertingNotifcation(finalStatusResult);
        await this.handleFailuresForWebhookNotifcation(finalStatusResult);

        await (Promise as any).allSettled(updateChecksPromiseArray);
    }

    async handleFailuresForAlertingNotifcation(finalStatusResult) {

        finalStatusResult = finalStatusResult.filter(item => item.status == 'DOWN');
        let urlsMap = finalStatusResult.map(item => ({ [item.userId]: item.url }))
        let userIds = finalStatusResult.map(item => item.userId);
        let notificationsObjects: [NotificationService] = notficationFactory.getNotificationObject['email'];

        notificationsObjects.forEach(object => {
            object.sendAlertingNotification(userIds, urlsMap)
        });

    }

    async handleFailuresForWebhookNotifcation(finalStatusResult) {

        let postPromiseArray = [];

        finalStatusResult = finalStatusResult.filter(item => item.status == 'DOWN');
        let webHooksUrls = []

        for (let index = 0; index < finalStatusResult.length; index++) {

            const element = finalStatusResult[index];

            if (!element.webhook) continue;

            webHooksUrls.push(element.webhook)

        }

        if (!webHooksUrls.length) return;

        let postPromiseRequest = IntegrationService.postPromise(webHooksUrls);

        postPromiseArray.push(postPromiseRequest)

        await Promise.all(postPromiseArray);

    }

    async handleThreshold(formattedChecksObject, check) {

        let promiseArray = []
        let checkRequests = []
        let status = formattedChecksObject.status;
        let threshold = check.threshold - 1;

        if (threshold == 0 || status == 'UP') return;

        for (let index = 0; index < threshold; index++) {

            let checkRequest = IntegrationService.checkRequest(check);
            promiseArray.push(checkRequest);

        }

        let checkResponses = await (Promise as any).allSettled(checkRequests);

        for (let index = 0; index < checkResponses.length; index++) {

            const element = checkResponses[index];
            let status = this.getStatus(element)

            if (status.status == 'UP') {

                formattedChecksObject = this.calculateCheckReportService(element, check)
                break;
            }

        }
    }

    calculateCheckReportService(element, check) {

        let formattedChecksObject = {};

        let status = this.getStatus(element)
        let responseTime = this.getResponseTime(element)

        let outages = status.status == 'DOWN' ? check.outages + 1 : check.outages
        let hitNumber = check.hitNumber + 1
        let totalResponseTime = check.totalResponseTime + responseTime;
        let avgResponseTime = (check.totalResponseTime + responseTime) / (check.hitNumber + 1);
        let availability = ((hitNumber - outages) / hitNumber) * 100
        let upTime = (availability / 100) * avgResponseTime;
        let downTime = (outages / hitNumber) * avgResponseTime;

        formattedChecksObject['statusCode'] = status.code;
        formattedChecksObject['totalResponseTime'] = totalResponseTime
        formattedChecksObject['status'] = status.status
        formattedChecksObject['userId'] = check.userId;
        formattedChecksObject['outages'] = outages;
        formattedChecksObject['hitNumber'] = hitNumber;
        formattedChecksObject['avgResponseTime'] = avgResponseTime
        formattedChecksObject['availability'] = availability;
        formattedChecksObject['upTime'] = upTime;
        formattedChecksObject['downTime'] = downTime
        formattedChecksObject['lastCheckDate'] = new Date();
        formattedChecksObject['nextCheckDate'] = new Date().setMinutes(new Date().getMinutes() + check.interval)

        return formattedChecksObject
    }


    getStatus(checkResponse) {

        if (checkResponse.value && checkResponse.value.statusCode) {

            return { code: checkResponse.value.statusCode, status: 'UP' };
        }

        else if (checkResponse.reason && checkResponse.reason.statusCode) {

            return { code: checkResponse.reason.statusCode, status: 'DOWN' };
        }

    }


    getResponseTime(checkResponse) {

        if (checkResponse.value && checkResponse.value.elapsedTime) {

            return checkResponse.value.elapsedTime;
        }

        else if (checkResponse.reason && checkResponse.reason.response && checkResponse.reason.response.elapsedTime) {

            return checkResponse.reason.response.elapsedTime;
        }

    }
}

export default new CheckService()