export function addTimeToNow(time: string): Date {
  const expiresAt = new Date()

  const timeValue = parseInt(time.slice(0, -1), 10)
  const timeUnit = time.slice(-1)

  switch (timeUnit) {
    case "d":
      expiresAt.setDate(expiresAt.getDate() + timeValue)
      break
    case "h":
      expiresAt.setHours(expiresAt.getHours() + timeValue)
      break
    case "m":
      expiresAt.setMinutes(expiresAt.getMinutes() + timeValue)
      break
    default:
      throw new Error("Invalid time format")
  }

  return expiresAt
}
