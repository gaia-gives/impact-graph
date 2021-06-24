import * as nodemailer from "nodemailer";
import config from "../config";

export async function sendEmail(email: string, url: string) {
  const transporter = nodemailer.createTransport({
    host: config.get("MAIL_HOST"),
    port: config.get("MAIL_PORT"),
    auth: {
      user: config.get("MAIL_USER"),
      pass: config.get("MAIL_PASS"),
    },
  });

  const mailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<a href="${url}">${url}</a>`, // html body
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
