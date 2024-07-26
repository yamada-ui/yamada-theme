import type { InferGetStaticPropsType, NextPage } from "next"
import { AppProvider } from "contexts/app-context"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { getStaticCommonProps } from "utils/next"

export const getStaticProps = getStaticCommonProps

type PageProps = InferGetStaticPropsType<typeof getStaticProps>

const Page: NextPage<PageProps> = ({ componentTree }) => {
  const { t } = useI18n()

  return (
    <AppProvider {...{ componentTree }}>
      <AppLayout
        title={t("app.title")}
        description={t("app.description")}
        gap="lg"
      ></AppLayout>
    </AppProvider>
  )
}

export default Page
