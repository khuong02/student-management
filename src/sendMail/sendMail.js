const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
module.exports = async function sendMailFunc(contentMail, accept) {
  const { name, email } = contentMail;
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "Gmail",
    auth: {
      user: process.env.ACCOUNT_EMAIL, // generated ethereal user
      pass: process.env.PASSWORD_EMAIL, // generated ethereal password
    },
    tls: { rejectUnauthorized: false },
  });

  const mailOptions = {
    from: process.env.ACCOUNT_EMAIL, // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: `Hello ${name}`, // plain text body
    html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the DVK School.</h2>
            <p>Congratulations! Welcome to DVK✮SCHOOL.
            </p>
            
            <h3>Your Information</h3>
            <p>Your MSSV: ${contentMail.code}</p>
            <p>Account: ${contentMail.account}</p>
            <p>Password: ${contentMail.password}</p>
            <p>Majors: ${contentMail.nameMajor}</p>
        
            <p>If the button doesn't work for any reason, you can also click on the link below:</p>
            </div>
        `, // html body
  };
  const failMailOptions = {
    from: process.env.ACCOUNT_EMAIL, // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: `Hello ${name}`, // plain text body
    html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the DVK School.</h2>
            
            <h3>Hello ${name}. Sorry to inform you that you do not have enough points to apply to the school.</h3>
            </div>
        `, // html body
  };
  // <a href= style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${name}</a>

  // send mail with defined transport object
  await transporter.sendMail(
    accept ? mailOptions : failMailOptions,
    (err, info) => {
      if (err) return err;
      else console.log("Email sent successfully!");

      // console.log("Message sent: %s", info.messageId);
      // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // // Preview only available when sending through an Ethereal account
      // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
  );
  return "Success";
};
