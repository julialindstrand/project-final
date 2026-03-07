export const parseBoolean = (value) => {
  if (typeof value === "boolean") return value
  if (typeof value === "string") {
    const lowered = value.toLowerCase().trim()
    if (["true", "1", "yes", "y"].includes(lowered)) return true
    if (["false", "0", "no", "n"].includes(lowered)) return false
  }

  return false
}