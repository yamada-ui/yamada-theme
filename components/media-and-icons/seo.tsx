import type { NextSeoProps } from "next-seo"
import { NextSeo } from "next-seo"
import React from "react"
import { CONSTANT } from "constant"

export type SEOProps = Pick<NextSeoProps, "title" | "description">

export const SEO = ({ title, description }: SEOProps) => (
  <NextSeo
    title={title}
    description={description}
    {...CONSTANT.SEO.NEXT_SEO_PROPS}
  />
)
