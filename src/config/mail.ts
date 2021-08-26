
const nodemailer = require('nodemailer');
const promisify = require('bluebird');
// build the transport with promises
var transport = promisify.promisifyAll(nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    // service: 'gmail',
    auth: {
        user: 'ebrhimmoussa17@gmail.com',
        pass: '0246810asdf'
    } // generated ethereal user
}));

export default transport 