export type SignupWithPhoneCommandParams = {
  phone: string
  password: string
  name: string
  dob: Date
}
export class SignupWithPhoneCommand {
  phone: string
  password: string
  name: string
  dob: Date
  constructor(params: SignupWithPhoneCommandParams) {
    this.phone = params.phone
    this.password = params.password
    this.name = params.name
    this.dob = params.dob
  }
}
