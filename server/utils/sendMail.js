import nodemailer from "nodemailer";
import config from "config";

async function sendMailer(emailBody) {
  try {
    const transporter = nodemailer.createTransport({
      host: config.get("EMAIL_SMTP.HOST"),
      port: 465,
      secure: true,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: config.get("EMAIL_SMTP.AUTH.USER"),
        pass: config.get("EMAIL_SMTP.AUTH.PASS"),
      },
    });

    const info = await transporter.sendMail({
      from: `"New Team 👻" <${config.get("EMAIL_SMTP.AUTH.USER")}>`, // sender address
      to: emailBody.to, // list of receivers
      subject: emailBody.subject, // Subject line
      text: emailBody.text, // plain text body
    });

    console.log("Message sent : %s", info.messageId);
  } catch (error) {
    console.log(error);
  }
}

// sendMailer({
//   to: "kushal.git01@gmail.com",
//   subject: "Random Test",
//   text: "Hi there",
// });

export default sendMailer
