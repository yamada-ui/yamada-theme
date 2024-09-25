//TODO: 戻り値の型の追加
export const stringToFunc = (str: string) => {
  try {
    const result = new Function(`return ${str}`)
    return result()
  } catch (e) {
    console.error("Cannot convert input string to function.", e)
  }
}
