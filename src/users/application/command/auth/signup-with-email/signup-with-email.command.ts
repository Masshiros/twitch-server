export type SignupWithEmailCommandParams = {
  email: string
  password: string
  name: string
  dob: Date
}

export class SignupWithEmailCommand {
  email: string
  password: string
  name: string
  dob: Date

  constructor(params: SignupWithEmailCommandParams) {
    this.email = params.email
    this.password = params.password
    this.name = params.name
    this.dob = params.dob
  }
}
