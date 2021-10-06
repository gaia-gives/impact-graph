import * as nodemailer from "nodemailer";
import config from "../config";
import sgMail from "@sendgrid/mail";
import { MailContent } from "@sendgrid/helpers/classes/mail";

interface MailOptions extends MailContent {
  from: string; // sender address
  to: string; // list of receivers
  subject: string; // Subject line
  text: string; // plain text body
  html?: string;
}

function sendMailViaNodeMailer(options: MailOptions) {
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

function sendMailViaSendGrid(options: MailOptions) {
  sgMail.setApiKey(config.get("SENDGRID_API_KEY"));
  try {
    sgMail.send(options);
  } catch (error) {
    console.log(error);
  }
}

export async function sendEmail(options: MailOptions) {
  const useSendgrid = config.get("SENDGRID_USE");
  if (useSendgrid) {
    sendMailViaSendGrid(options);
  } else {
    sendMailViaNodeMailer(options);
  }
}
