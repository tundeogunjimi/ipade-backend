const asyncHandler = require('express-async-handler');
const {welcomeEmail} = require('../assets/campaigns/welcome-email')
const {shareLinkMessage} = require('../assets/campaigns/sharelink-message')
const {meetingDetailsEmail} = require('../assets/campaigns/meeting-details')

const Brevo = require('@getbrevo/brevo');

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

const sendMeetingDetails = asyncHandler((booking, meeting) => {
    sendSmtpEmail.to = [{email: booking.email}];
    sendSmtpEmail.subject = `Hello ${booking.name}, you have successfully scheduled an appointment`
    sendSmtpEmail.htmlContent = meetingDetailsEmail(booking, meeting)

    apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
        console.log('API called successfully. Returned data: ' + data);
    }, function(error) {
        console.error(`error >>> `, error);
    }); 
})

module.exports = { 
    sendInBlue,
    shareMeetingLink,
    sendMeetingDetails,
}