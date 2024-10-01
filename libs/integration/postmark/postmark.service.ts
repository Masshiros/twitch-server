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

  sendEmail(data: { html: string }) {
    const { html } = data

    return this.client.sendEmail({
      From: "twitch@gw.edu.vn",
      To: "tech+read@aiquant.space",
      Subject: "Hello from Coach",
      HtmlBody: html,
      MessageStream: "outbound",
    })
  }
}
