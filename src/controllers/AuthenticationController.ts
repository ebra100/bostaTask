import UserRepo from "../Repository/UserRepo"
import MailService from "../services/MailService"
import AuthService from "../services/authService"

export class AuthenticationController {

    async signUp(req, res) {

        try {

            let data = req.body
            let user = await UserRepo.createUser(data);
            let token = AuthService.generateToken(user)
            MailService.send({ email: user.email, type: "VERIFY_EMAIL", variables: { "[VERIFICATION_CODE]": user.verificationCode } })

            return res.send({ status: "OK", result: user, token: token });

        } catch (error) {

            console.log(error);
            return res.status(error.statusCode).send({ status: error.status, message: error.message })

        }

    }

    async verifyEmail(req, res) {

        try {

            let email = req.body.email
            let code = req.body.code

            let user: any = await UserRepo.getUserByField(email, "email");
            AuthService.validateVerificationCode(code, user.verificationCode);

        } catch (error) {

            console.log(error);
            return res.status(error.statusCode).send({ status: error.status, message: error.message })

        }

    }
}