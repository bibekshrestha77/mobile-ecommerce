import nodemailer from "nodemailer";
import CustomError from "../middlewares/error_handler.middleware";
import { smtp_config } from "../config/config";
import Mail from "nodemailer/lib/mailer";
import { MailOptions } from "nodemailer/lib/json-transport";

// create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: smtp_config.host,
  port: parseInt(smtp_config.port),
  secure: parseInt(smtp_config.port) === 465 ? true : false,
  service: smtp_config.service,
  auth: {
    user: smtp_config.user,
    pass: smtp_config.pass,
  },
});

interface IEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  attachmemts?: any;
  cc?: any | string[] | null;
  bcc?: any | string[] | null;
}

export const sendEmail = async ({
  html,
  to,
  subject,
  attachmemts = null,
  cc = null,
  bcc = null,
}: IEmailOptions) => {
  try {
    const mailOptions: any = {
      to: to,
      from: `"E-Commerce" <${smtp_config.user}>`,
      subject: " subject",
      html: html,
    };

    if (attachmemts) {
      mailOptions["attachmemts"] = attachmemts;
    }
    if (cc) {
      mailOptions["cc"] = cc;
    }
    if (bcc) {
      mailOptions["bcc"] = bcc;
    }
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw new CustomError("Something went wrong", 500);
  }
};
