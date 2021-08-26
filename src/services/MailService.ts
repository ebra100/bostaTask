import transport from "../config/mail"
import { NotificationService } from "./notificationService";
import UserRepo from "../Repository/UserRepo";

class MailService implements NotificationService {

    async sendAlertingNotification(userIds, replace) {

        let users: any = await UserRepo.getUsersEmailsByIds(userIds)

        users.forEach(user => {

            this.send({ email: user.email, type: 'ALERT_NOTIFICATION', variables: { "[URL]": replace[user.id] } })
        })
    }

    send(emailData) {

        let email = emailData.email
        let type = emailData.type;
        let variables = emailData.variables;

        let subject = this.getSubject(type);
        let template = this.getTemplate(type);
        template = this.replace(template, variables);

        let mailOptions = {
            from: 'ebrhimmoussa17@gmail.com',
            to: email,
            subject: subject,
            html: template
        };

        transport.sendMailAsync(mailOptions);
    }

    private getTemplate(type) {

        if (type == "VERIFY_EMAIL")
            return `<b>your verification code is [VERIFICATION_CODE]</b>`

        if (type == "ALERT_NOTIFICATION")
            return `<b>Your check on the [URL] goes down</b>`
    }

    private getSubject(type) {

        if (type == "VERIFY_EMAIL")
            return 'verify your email'

        if (type == "ALERT_NOTIFICATION")
            return 'check alert'
    }

    private replace(template, variables) {

        Object.keys(variables).forEach(key => {

            template = template.replace(key, variables[key])
        })

        return template
    }
}

export default new MailService();