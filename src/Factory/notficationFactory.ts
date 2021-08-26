import MailService from "../services/MailService";
import { NotificationService } from "../services/notificationService";

class NotificationFactory {

    notificationMap = {

        'email': MailService
    }

    getNotificationObject(types) {

        let notificationsObjects = [];

        types.forEach(type => {

            notificationsObjects.push(this.notificationMap[type])
        });

        return notificationsObjects

    }
}

export default new NotificationFactory()