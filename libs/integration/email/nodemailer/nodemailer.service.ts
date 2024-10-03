import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import config from "libs/config"
import { createTransport } from "nodemailer"
import type Mail from "nodemailer/lib/mailer"

@Injectable()
export default class NodemailerService {
  private nodemailerTransport: Mail

  constructor() {
    this.nodemailerTransport = createTransport({
      service: config.NODEMAILER_EMAIL_SERVICE,
      auth: {
        user: config.NODEMAILER_EMAIL_USER,
        pass: config.NODEMAILER_EMAIL_PASSWORD,
      },
    })
  }

  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options)
  }
}
