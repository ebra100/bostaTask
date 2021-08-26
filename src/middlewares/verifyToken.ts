import * as jwt from "jsonwebtoken";

function isValidToken(req, res, next) {
    try {

        if (!req.headers.authorization)
            return res.status(401).json({ status: "INVALID_REQUEST", message: "you are not authorized" })

        var token = req.headers.authorization.split(' ')[1];

        if (!token)
            return res.status(401).json({ status: "INVALID_REQUEST", message: "you are not authorized" })

        jwt.verify(token, "123456", function (err, decoded) {
            if (err)
                return res.status(401).json({ status: "INVALID_REQUEST", message: "you are not authorized" })

            req.user = decoded;
            req.token = token;
            next();

        });

    } catch (error) {
        console.log(error);

        return res.status(400).send({ auth: false, message: 'Unauthorized' });
    }
};

export default isValidToken