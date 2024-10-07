import { Injectable } from "@nestjs/common"
import config from "libs/config"
import { ServerClient } from "postmark"

@Injectable()
export class PostmarkService {
  private serverToken: string
  private client: ServerClient

  constructor() {
    this.serverToken = config.POSTMARK_SERVER_TOKEN
    this.client = new ServerClient(this.serverToken)
  }

  sendEmail(data: { to: string; subject: string; html: string }) {
    const { html } = data

    return this.client.sendEmail({
      From: "nguahoang2003@gmail.com",
      To: data.to,
      Subject: data.subject,
      HtmlBody: data.html,
      MessageStream: "outbound",
    })
  }
}
