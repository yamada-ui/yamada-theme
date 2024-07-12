import { readFile } from "fs/promises"
import path from "path"
import * as p from "@clack/prompts"
import { toCamelCase } from "@yamada-ui/react"
import c from "chalk"
import { glob } from "glob"

export const themePath = [
  "node_modules",
  ".pnpm",
  "@yamada-ui+theme@*",
  "node_modules",
  "@yamada-ui",
  "theme",
  "dist",
  "components",
  "*.js",
]

const resolveThemePaths = async (): Promise<string[]> => {
  const paths = [path.join(...themePath), path.posix.join(...themePath)]

  const triedPaths = await Promise.all(
    paths.map(async (possiblePath) => {
      const paths = await glob(possiblePath)

      if (paths.length) return paths

      return ""
    }),
  )

  const resolvedPaths = triedPaths.find(Boolean)

  if (!resolvedPaths) {
    throw new Error("Could not find @yamada-ui/theme in node_modules.")
  }

  return resolvedPaths
}

const convertPaths = (paths: string[]): { path: string; name: string }[] => {
  return paths.map((value) => {
    const resolvedPath = path.resolve(process.cwd(), value)
    const match = value.match(/[^/\\]+(?=\.js$)/)
    const name = toCamelCase(match?.[0] ?? "")

    return { path: resolvedPath, name }
  })
}

const extractObjectData = (content: string, name: string): string => {
  const objectPattern = new RegExp(`${name}\\s*=\\s*({[\\s\\S]*?})`, "m")
  const match = content.match(objectPattern)

  if (match && match[1]) {
    let result = match[1]
    let level = 0
    let startIndex = content.indexOf(result)
    for (let i = startIndex; i < content.length; i++) {
      if (content[i] === "{") {
        level++
      }
      if (content[i] === "}") {
        level--
        if (level === 0) {
          return content.substring(startIndex, i + 1)
        }
      }
    }
  }
  return ""
}

// const extractComponentsName = (content: string): string[] => {
//   return []
// }

//TODO:consider extends theme
const extractStyledComopnent = async (
  props: { path: string; name: string }[],
): Promise<{ name: string; theme: string }[]> => {
  return await Promise.all(
    props.map(async ({ path, name }) => {
      const content = await readFile(path, "utf8")
      const extractedThemeData = extractObjectData(content, name)
      // const componentsName = extractComponentsName(extractedThemeData)

      return { name, theme: extractedThemeData }
    }),
  )
}

const generateThemeStructure = () => { }

const main = async () => {
  p.intro(c.magenta(`Generating Yamada UI theme structure`))

  const s = p.spinner()

  try {
    const start = process.hrtime.bigint()

    //TODO: get theme structure from theme file
    // if dont have structure file, the component is single comopnent.
    const paths = await resolveThemePaths()
    const converted = convertPaths(paths)

    //TODO: next:extract label data
    const themeData = await extractStyledComopnent(converted)
    console.log(themeData)

    generateThemeStructure()

    const end = process.hrtime.bigint()
    const duration = (Number(end - start) / 1e9).toFixed(2)

    p.outro(c.green(`Done in ${duration}s\n`))
  } catch (e) {
    s.stop(`An error occurred`, 500)

    p.cancel(c.red(e instanceof Error ? e.message : "Message is missing"))
  }
}

main()
