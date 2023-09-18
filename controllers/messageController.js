const asyncHandler = require('express-async-handler');
const {welcomeEmail} = require('../assets/campaigns/welcome-email')

const Mailjet = require('node-mailjet');
var Brevo = require('@getbrevo/brevo');


const sendMailJet = asyncHandler( async(req, res) => {
    
    const mailjet = Mailjet.apiConnect(
        process.env.MJ_APIKEY_PUBLIC,
        process.env.MJ_APIKEY_PRIVATE,
    );

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

const sendInBlue = asyncHandler((user) => {

    // console.log(req.body)
    
    var defaultClient = Brevo.ApiClient.instance;
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.SEND_IN_BLUE_API_KEY;
    var apiInstance = new Brevo.TransactionalEmailsApi();

    var sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.sender = {email: 'hello@lucentafrica.com', name: 'Lucent Africa'};
    sendSmtpEmail.to = [{email: user.email}];
    // sendSmtpEmail.params = {
    //     greeting:"This is the default greeting",
    //     headline:"This is the default headline"
    // }
    sendSmtpEmail.subject = `Welcome ${user.name}`
    sendSmtpEmail.htmlContent = welcomeEmail(user)
    // sendSmtpEmail.headers = {
    //     "api-key": process.env.SEND_IN_BLUE_API_KEY,
    //     "content-type": "application/json",
    //     "accept": "application/json",
    // }

    apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
        console.log('API called successfully. Returned data: ' + data);
    }, function(error) {
        console.error(`error >>> `, error);
    }); 

})

module.exports = { 
    sendMailJet,
    sendInBlue
}