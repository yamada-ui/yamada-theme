import type { InferGetStaticPropsType, NextPageWithConfig } from "next"
import { AppProvider } from "contexts/app-context"
import { ComponentProvider } from "contexts/component-context"
import { ComponentLayout } from "layouts/component-layout"
import { getStaticComponentPaths, getStaticComponentProps } from "utils/next"
import { getComponentConfig } from "utils/ui"

type PageProps = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticPaths = getStaticComponentPaths("forms")

export const getStaticProps = getStaticComponentProps("forms")

const Page: NextPageWithConfig<PageProps> = ({ component, componentTree }) => {
  if (component) {
    return (
      <AppProvider {...{ componentTree }}>
        <ComponentProvider {...component}>
          <ComponentLayout
          // title={metadata?.title}
          // description={metadata?.description}
          />
        </ComponentProvider>
      </AppProvider>
    )
  }

  return <div>No component found</div>
  // return (
  //   <AppProvider {...{ componentTree, categoryGroup, category }}>
  //     <AppLayout
  //       title={category?.title ?? categoryGroup?.title}
  //       description={category?.description ?? categoryGroup?.description}
  //       gap="md"
  //     >
  //       {category ? <Category /> : <CategoryGroup />}
  //     </AppLayout>
  //   </AppProvider>
  // )
}

export default Page

Page.config = getComponentConfig
