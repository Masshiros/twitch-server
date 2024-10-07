import { Injectable } from "@nestjs/common"
import config from "libs/config"
import { Twilio } from "twilio"

@Injectable()
export default class TwilioService {
  private accountSid: string
  private authToken: string
  private twilioClient: Twilio
  constructor() {
    this.accountSid = config.TWILIO_ACCOUNT_SID
    this.authToken = config.TWILIO_AUTH_TOKEN
    this.twilioClient = new Twilio(this.accountSid, this.authToken)
  }
  initiatePhoneNumberVerification(phoneNumber: string) {
    const serviceSid = config.TWILIO_VERIFICATION_SERVICE_SID

    return this.twilioClient.verify._v2
      .services(serviceSid)
      .verifications.create({ to: phoneNumber, channel: "sms" })
  }
}
