const asyncHandler = require('express-async-handler');
const {welcomeEmail} = require('../assets/campaigns/welcome-email')
const {shareLinkMessage} = require('../assets/campaigns/sharelink-message')

const Mailjet = require('node-mailjet');

const Brevo = require('@getbrevo/brevo');


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

const defaultClient = Brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SEND_IN_BLUE_API_KEY;
var apiInstance = new Brevo.TransactionalEmailsApi();

const sendSmtpEmail = new Brevo.SendSmtpEmail();
sendSmtpEmail.sender = {email: 'hello@lucentafrica.com', name: 'Lucent Africa'};


const sendInBlue = asyncHandler((user) => {
    
    sendSmtpEmail.to = [{email: user.email}];
    sendSmtpEmail.subject = `Welcome ${user.name}`
    sendSmtpEmail.htmlContent = welcomeEmail(user)

    apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
        console.log('API called successfully. Returned data: ' + data);
    }, function(error) {
        console.error(`error >>> `, error);
    }); 

})

const shareMeetingLink = asyncHandler((req, res) => {
    sendSmtpEmail.to = [{email: req.body.receiverEmail}];
    sendSmtpEmail.subject = `Schedule a meeting with ${req.body.tenantName}`
    sendSmtpEmail.htmlContent = shareLinkMessage(req)

    apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
        console.log('API called successfully. Returned data: ' + data);
        return res.status(200).json({message: data})
    }, function(error) {
        // console.error(`error >>> `, error);
      return res.status(500).json({message: error.message})
    });     
})

module.exports = { 
    sendMailJet,
    sendInBlue,
    shareMeetingLink
}