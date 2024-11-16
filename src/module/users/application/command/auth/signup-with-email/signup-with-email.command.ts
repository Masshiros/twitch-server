export type SignupWithEmailCommandParams = {
  email: string
  password: string
  dob: Date
  name: string
  streamKey?: string
  serverUrl?: string
}

export class SignupWithEmailCommand {
  email: string
  password: string
  dob: Date
  name: string
  streamKey?: string
  serverUrl?: string

  constructor(params: SignupWithEmailCommandParams) {
    this.email = params.email
    this.password = params.password
    this.name = params.name
    this.dob = params.dob
    this.streamKey = params.streamKey
    this.serverUrl = params.serverUrl
  }
}
