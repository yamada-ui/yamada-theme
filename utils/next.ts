import type {
  GetServerSidePropsContext,
  GetStaticPathsContext,
  GetStaticPropsContext,
} from "next"
import { toArray } from "./array"
import {
  checkInvalidLabels,
  getComponent,
  getComponentPaths,
} from "./component"
import type { Locale } from "./i18n"
import type { Component } from "component"

export const getServerSideCommonProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const cookies = req.headers.cookie ?? ""

  return { props: { cookies } }
}

export const getStaticComponentProps =
  (categoryGroupName: string) =>
  async ({
    params,
    locale,
  }: GetStaticPropsContext): Promise<{
    props: {
      component?: Component
    }
    notFound?: boolean
  }> => {
    const paths = toArray(params?.slug ?? [])

    const slug = [categoryGroupName, ...paths].join("/")

    const component = await getComponent(slug)(locale as Locale)

    if (component) checkInvalidLabels(component)

    const props = { component }

    return { props, notFound: !component }
  }
// }

export const getStaticComponentPaths =
  (categoryGroupName: string) =>
  async ({ locales }: GetStaticPathsContext) => {
    const paths = await getComponentPaths(categoryGroupName)(locales)

    return { paths, fallback: false }
  }
