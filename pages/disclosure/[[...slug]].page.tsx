import type { InferGetStaticPropsType, NextPageWithConfig } from "next"
import { ComponentProvider } from "contexts/component-context"
import { ComponentLayout } from "layouts/component-layout"
import { getStaticComponentPaths, getStaticComponentProps } from "utils/next"
import { getComponentConfig } from "utils/ui"

type PageProps = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticPaths = getStaticComponentPaths("disclosure")

export const getStaticProps = getStaticComponentProps("disclosure")

const Page: NextPageWithConfig<PageProps> = ({ component }) => {
  if (component) {
    return (
      <ComponentProvider {...component}>
        <ComponentLayout
        // title={metadata?.title}
        // description={metadata?.description}
        />
      </ComponentProvider>
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
