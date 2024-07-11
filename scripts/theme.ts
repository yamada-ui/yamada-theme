import path from "path"
import * as p from "@clack/prompts"
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

const resolveThemePaths = async (): Promise<string[] | undefined> => {
  const paths = [path.join(...themePath), path.posix.join(...themePath)]

  const triedPaths = await Promise.all(
    paths.map(async (possiblePath) => {
      const paths = await glob(possiblePath)

      if (paths.length) return paths

      return ""
    }),
  )

  const resolvedPaths = triedPaths.find(Boolean)

  if (!resolvedPaths) return

  return resolvedPaths
}

const main = async () => {
  p.intro(c.magenta(`Generating Yamada UI theme structure`))

  const s = p.spinner()

  try {
    const start = process.hrtime.bigint()

    //TODO: get theme structure from theme file
    const paths = await resolveThemePaths()
    console.log(paths)
    //TODO: get component list and create theme structure file
    // if dont have structure file, the component is single comopnent.

    const end = process.hrtime.bigint()
    const duration = (Number(end - start) / 1e9).toFixed(2)

    p.outro(c.green(`Done in ${duration}s\n`))
  } catch (e) {
    s.stop(`An error occurred`, 500)

    p.cancel(c.red(e instanceof Error ? e.message : "Message is missing"))
  }
}

main()
