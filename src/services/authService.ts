import * as jwt from "jsonwebtoken";

class AuthService {

    validateVerificationCode(inputCode, userCode) {

        if (new Date(inputCode).getTime() > new Date(userCode).getTime())
            throw { statusCode: 400, status: "CODE_EXPIRED", message: "this code has been expired" };

        if (inputCode != userCode)
            throw { statusCode: 400, status: "WRONG_CODE", message: "this code is wrong , please try again" }

        return true
    }

    generateToken(user) {

        return jwt.sign({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }, "123456");
    }

}

export default new AuthService()