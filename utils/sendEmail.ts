import * as nodemailer from "nodemailer";
import config from "../config";

interface MailOptions {
  from: string; // sender address
  to: string; // list of receivers
  subject: string; // Subject line
  text?: string; // plain text body
  html?: string;
}

export async function sendEmail(options: MailOptions) {
  const transporter = nodemailer.createTransport({
    host: config.get("MAIL_HOST"),
    port: config.get("MAIL_PORT"),
    auth: {
      user: config.get("MAIL_USER"),
      pass: config.get("MAIL_PASS"),
    },
  });

  try {
    transporter.sendMail(options);
  } catch (error) {
    console.log(error);
  }
}
