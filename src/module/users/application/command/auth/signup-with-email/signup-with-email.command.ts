export type SignupWithEmailCommandParams = {
  email: string
  password: string
  dob: Date
  name: string
}

export class SignupWithEmailCommand {
  email: string
  password: string
  dob: Date
  name: string

  constructor(params: SignupWithEmailCommandParams) {
    this.email = params.email
    this.password = params.password
    this.name = params.name
    this.dob = params.dob
  }
}
