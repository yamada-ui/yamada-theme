import type { UIStyle } from "@yamada-ui/react"

const isValidJSON = (value: string): boolean => {
  if (value.trim() === "") return false

  try {
    JSON.parse(value)

    return true
  } catch {
    return false
  }
}

export const stringToUIStyle = (value: string): UIStyle => {
  try {
    if (isValidJSON(value)) {
      return JSON.parse(value)
    } else {
      return new Function(`return ${value}`)()
    }
  } catch {
    return {}
  }
}
