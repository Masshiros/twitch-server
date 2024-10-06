// Strictly formating email in format "xxxx@yyyy.zzzz"
const mailRegex = new RegExp(".+@.+..+")

// Password must have at least 8 characters, at least one character and one number
const passwordRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
)
// Phone regex
const phoneRegex = new RegExp(
  "^[+]?[0-9]{0,3}[\\s-]?[\\(]?[0-9]{3}[\\)]?[\\s-]?[0-9]{3}[\\s-]?[0-9]{4,6}$",
  "im",
)

export { mailRegex, passwordRegex, phoneRegex }
