// /src/config/emailConfig.ts
export const emailConfig = {
  twoFA: {
    subject: "Your Two-Factor Authentication Code",
    body: "Please enter this code to enable Two-Factor Authentication: {{code}}",
  },
  passwordReset: {
    subject: "Reset Your Password",
    body: "Click the link to reset your password: {{resetLink}}",
  },
  confirmEmail: {
    subject: "Your Email Verification Code",
    body: "Please enter this code to verify your email: {{code}}",
  },
}
