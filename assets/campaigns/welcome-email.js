const welcomeEmail = (user) => {
    const welcomeMessage= `
        <h2>Finish creating your account</h2>
        <p>Your email address has been registered with Ipade. To validate your account and activate your ability to schedule meetings, please activate your account by clicking the link below: </p>
        <a class="confirm-btn" href="http://localhost:4200/confirm-registration?token=${user.confirmationToken}&id=${user._id}">Confirm my email address</a>
        <p>If you experience any issues with the button above, copy and paste the URL below into your web browser:</p>
        <p>http://localhost:4200/confirm-registration?token=${user.confirmationToken}&id=${user._id}</p>
    `

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
      ${welcomeMessage}
      <p>This email was sent to ${user.email}. You've received this email because you create an Ipade account</p>
      <a href="hello@lucentafrica.com">Contact Us</a>
    </div>
    </body>
    </html>    
    `;

    return htmlTemplate;
}

module.exports = {welcomeEmail}