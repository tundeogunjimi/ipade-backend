const meetingDetailsEmail = (booking, meeting, action) => {

    const actionType = action === 'create' ? 'created' : 'updated'

    const url = `http://localhost:4200/booking/edit-booking/${meeting.link}/${booking.id}?meetingId=${meeting._id}&tenantId=${booking.tenantId}`
  
    const message = `
          <h2>Meeting ${actionType}</h2>
          <p>You have successfully ${actionType} a meeting: <b>${booking.meetingType}</b></p>
          <p>
            You can follow the link below to re-schedule the your appointment.
          </p>
          <a class="confirm-btn" href="${url}">
            Re-schedule
          </a>
          <p>
            If you experience any issues with the button above, 
            copy and paste the URL below into your web browser:
          </p>
          <p>${url}</p>
        `;
      
  
      const htmlTemplate = `
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport"
              content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Welcome Email</title>
        <style>
          .container {
            width: 500px;
            margin: auto;
            padding: 20px;
            background: #eeeeee;
            border: solid 1px #eea;
            font-family: Roboto,sans-serif;
            line-height: 25px;
            text-align: center;
          }
      
          h3, h2 {
            color: #1050a5;
            margin-bottom: 3rem;
          }
      
          p {
            margin: 3rem 0;
          }
      
          a.confirm-btn {
              background: #1050a5;
              padding: 1rem 3rem;
              color: #fff;
              text-decoration: none;
              font-weight: 400;
              font-size: 1.2rem;
          }
          p.disclaimer {
              font-size: 0.8rem;
              color: darkgray;
          }
        </style>
      </head>
      <body>
      <div class="container">
        <h3>Ipade</h3>
        ${message}
        <p>This email was sent to ${booking.email}. You've received this email because you created an Ipade account</p>
        <a href="hello@lucentafrica.com">Contact Us</a>
      </div>
      </body>
      </html>    
      `;
  
      return htmlTemplate;
  }
  
  module.exports = {meetingDetailsEmail}