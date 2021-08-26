const CronJob = require("cron").CronJob;
import CheckService from "../services/checkService"

const check = new CronJob("* * * * *", async function () {
   
    console.log("check scheduler is running ...");

    CheckService.excute();

}, null, true, "Africa/Cairo");

check.start();
