export class EmailTemplate {
  private readonly subject: string
  private readonly body: string

  constructor(subject: string, body: string) {
    this.subject = subject
    this.body = body
  }

  getSubject(): string {
    return this.subject
  }

  getBody(): string {
    return this.body
  }

  static withCode(template: EmailTemplate, code: string): EmailTemplate {
    const formattedBody = template.body.replace("{{code}}", code)
    return new EmailTemplate(template.subject, formattedBody)
  }
}
