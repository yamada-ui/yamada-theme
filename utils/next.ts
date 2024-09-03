import type {
  GetServerSidePropsContext,
  GetStaticPathsContext,
  GetStaticPropsContext,
} from "next"
import { toArray } from "./array"
import {
  checkInvalidLabels,
  getComponent,
  getComponentCategoryGroup,
  getComponentPaths,
} from "./component"
import type { Locale } from "./i18n"
import type { Component, ComponentCategoryGroup } from "component"

export const getServerSideCommonProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const cookies = req.headers.cookie ?? ""

  return { props: { cookies } }
}

export const getStaticCommonProps = async ({
  locale,
}: GetStaticPropsContext) => {
  const componentTree = await getComponentCategoryGroup()(locale as Locale)

  return { props: { componentTree } }
}

export const getStaticComponentProps =
  (categoryGroupName: string) =>
  async ({
    params,
    locale,
  }: GetStaticPropsContext): Promise<{
    props: {
      component?: Component
      componentTree: ComponentCategoryGroup[]
    }
    notFound?: boolean
  }> => {
    const paths = toArray(params?.slug ?? [])

    const componentTree = await getComponentCategoryGroup()(
      locale as Locale,
      `/${[categoryGroupName, ...paths].join("/")}`,
    )

    const slug = [categoryGroupName, ...paths].join("/")

    const component = await getComponent(slug)(locale as Locale)

    if (component) checkInvalidLabels(component)

    const props = { component, componentTree }

    return { props, notFound: !component }
  }

export const getStaticComponentPaths =
  (categoryGroupName: string) =>
  async ({ locales }: GetStaticPathsContext) => {
    const paths = await getComponentPaths(categoryGroupName)(locales)

    return { paths, fallback: false }
  }
