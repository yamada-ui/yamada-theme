import { existsSync } from "fs"
import { readdir, readFile } from "fs/promises"
import path from "node:path"
import { toCamelCase, toKebabCase } from "@yamada-ui/react"
import type { GetStaticPathsResult } from "next"
import type { Locale } from "./i18n"
import type {
  CommonMetadata,
  Component,
  ComponentCategoryGroup,
  Metadata,
  OriginMetadata,
} from "component"
import { CONSTANT } from "constant"

export const getComponentCategoryGroup =
  (targetPath: string = "contents", callback?: (metadata: Metadata) => void) =>
  async (
    locale: Locale = CONSTANT.I18N.DEFAULT_LOCALE,
    currentSlug?: string,
  ): Promise<ComponentCategoryGroup[]> => {
    const defaultLocale = CONSTANT.I18N.DEFAULT_LOCALE
    const dirents = await readdir(targetPath, { withFileTypes: true })

    const componentTree = await Promise.all(
      dirents.map(async (dirent) => {
        const name = toKebabCase(dirent.name)
        const targetPath = path.join(dirent.path, name)

        if (!dirent.isDirectory()) {
          if (name === "metadata.json") {
            try {
              const data = await readFile(targetPath, "utf-8")
              const json: OriginMetadata = JSON.parse(data)
              const metadata: CommonMetadata =
                json[locale] ?? json[defaultLocale]
              const icon = json.icon ?? null
              const authors = json.authors ?? null
              const labels = json.labels ?? null
              const order = json.order ?? null

              callback?.({ ...metadata, icon, authors, labels, order })
            } catch {}
          }

          return
        }

        let metadata: Metadata | undefined = undefined

        const items = await getComponentCategoryGroup(
          targetPath,
          (data) => (metadata = data),
        )(locale, currentSlug)

        const slug = targetPath.replace(/\\/g, "/").replace(/^contents\//, "/")
        const isExpanded =
          slug === currentSlug ||
          items.some(
            ({ slug, items }) =>
              slug === currentSlug ||
              items?.some(({ slug }) => slug === currentSlug),
          )

        return {
          name,
          slug,
          isExpanded,
          ...(items.length ? { items } : {}),
          ...metadata!,
        }
      }),
    )

    return componentTree
      .filter(Boolean)
      .sort(
        (a, b) => (a?.order ?? 530000) - (b?.order ?? 530000),
      ) as ComponentCategoryGroup[]
  }

export const getComponentPaths =
  (categoryGroupName: string) =>
  async (locales: string[] = []) => {
    const defaultLocale = CONSTANT.I18N.DEFAULT_LOCALE
    const categoryGroupPath = path.join("contents", categoryGroupName)

    const componentTree =
      await getComponentCategoryGroup(categoryGroupPath)(defaultLocale)

    const getPaths =
      (componentTree?: ComponentCategoryGroup[]) =>
      (locale: string): GetStaticPathsResult["paths"] =>
        (componentTree ?? []).flatMap(({ slug, items }) => {
          slug = slug.replace(new RegExp(`^/${categoryGroupName}/`), "")

          const resolvedSlug = slug.split("/")

          return [
            { params: { slug: resolvedSlug }, locale },
            ...getPaths(items)(locale),
          ]
        })

    const paths = locales.flatMap((locale) => [
      { params: { slug: [] }, locale },
      ...getPaths(componentTree)(locale),
    ])

    return paths
  }

const getMetadata = (dirPath: string) => async (locale: Locale) => {
  const defaultLocale = CONSTANT.I18N.DEFAULT_LOCALE

  try {
    const data = await readFile(path.join(dirPath, "metadata.json"), "utf-8")
    const json: OriginMetadata = JSON.parse(data)
    const metadata: CommonMetadata = json[locale] ?? json[defaultLocale]
    const options = json.options ?? null
    const authors = json.authors ?? null
    const labels = json.labels ?? null

    return { ...metadata, options, authors, labels }
  } catch {
    return null
  }
}

export const getComponent =
  (slug: string) =>
  async (
    locale: Locale = CONSTANT.I18N.DEFAULT_LOCALE,
  ): Promise<Component | undefined> => {
    try {
      slug = slug.replace(/^\//, "")
      const name = toCamelCase(slug.split("/").at(-1)!)
      const dirPath = path.join("contents", slug)
      const componentPath = path.join(dirPath, "index.tsx")
      const themePath = path.join(dirPath, "theme.ts")
      const configPath = path.join(dirPath, "config.ts")
      const validComponentPath = path
        .join(slug, "index.tsx")
        .replace(/\\/g, "/")
      const validThemePath = path.join(slug, "theme.ts").replace(/\\/g, "/")
      const validConfigPath = path.join(slug, "config.ts").replace(/\\/g, "/")

      if (!existsSync(componentPath)) return undefined

      //TODO: メタデータの取得が必要か考える
      const metadata = await getMetadata(dirPath)(locale)
      const hasTheme = existsSync(themePath)
      const hasConfig = existsSync(configPath)

      const paths = {
        component: validComponentPath,
        theme: hasTheme ? validThemePath : null,
        config: hasConfig ? validConfigPath : null,
      }

      slug = `/${slug}`

      const data: Component = {
        name,
        slug,
        paths,
        metadata,
      }

      return data
    } catch {}
  }

export const checkInvalidLabels = ({ metadata, slug }: Component) => {
  metadata?.labels?.forEach((label) => {
    if (!CONSTANT.LABEL.includes(label)) {
      throw Error(
        `"${label}" is not a valid label.\nSee: "contents/${slug}/metadata.json"`,
      )
    }
  })
}
