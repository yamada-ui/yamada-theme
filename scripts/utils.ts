export const convertStringToObject = (content: string): any => {
  try {
    return new Function(`return ${content}`)()
  } catch (e) {
    throw new Error(`Could not convert string to object: ${content}`)
  }
}
