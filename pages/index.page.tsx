import type { NextPage } from "next"
import type { AppProps } from "next/app"
import { useI18n } from "contexts/i18n-context"
import { AppLayout } from "layouts/app-layout"
import { ComponentLayout } from "layouts/component-layout"

const Page: NextPage<AppProps> = () => {
  const { t } = useI18n()

  return (
    <AppLayout
      title={t("app.title")}
      description={t("app.description")}
      gap="lg"
    >
      <ComponentLayout />
    </AppLayout>
  )
}

export default Page
