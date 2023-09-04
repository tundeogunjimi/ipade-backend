const asyncHandler = require('express-async-handler');

const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE,
);


const sendMail = asyncHandler( async(req, res) => {
    const request = mailjet
    .post('send', { version: 'v3.1' })
    .request({
        Messages: [
        {
            From: {
            Email: "pilot@mailjet.com",
            Name: "Mailjet Pilot"
            },
            To: [
            {
                Email: "passenger1@mailjet.com",
                Name: "passenger 1"
            }
            ],
            Subject: "Your email flight plan!",
            TextPart: "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
            HTMLPart: "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
        }
        ]
    })

    request
    .then((result) => {
        console.log(result.body)
    })
    .catch((err) => {
        console.log(err.statusCode)
    })

})

module.exports = { sendMail }