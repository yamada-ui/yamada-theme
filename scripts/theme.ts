import * as p from "@clack/prompts"
import c from "chalk"

const main = async () => {
  p.intro(c.magenta(`Generating Yamada UI theme structure`))

  const s = p.spinner()

  try {
    const start = process.hrtime.bigint()

    //TODO: do somesing

    const end = process.hrtime.bigint()
    const duration = (Number(end - start) / 1e9).toFixed(2)

    p.outro(c.green(`Done in ${duration}s\n`))
  } catch (e) {
    s.stop(`An error occurred`, 500)

    p.cancel(c.red(e instanceof Error ? e.message : "Message is missing"))
  }
}

main()
