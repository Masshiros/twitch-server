export const generateSlug = (name: string) => {
  if (!name) return ""
  return name
    .toLowerCase() // Convert the name to lowercase
    .trim() // Trim any leading or trailing spaces
    .replace(/[^\w\s-]/g, "") // Remove any non-word characters, except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
}
