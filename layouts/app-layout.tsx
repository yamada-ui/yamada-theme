import type { StackProps } from "@yamada-ui/react"
import { Center, HStack, VStack } from "@yamada-ui/react"
import { type FC } from "react"
import { Footer, Header, Sidebar } from "components/layouts"
import { SEO } from "components/media-and-icons"

type AppLayoutOptions = { title?: string; description?: string }

export type AppLayoutProps = StackProps & AppLayoutOptions

export const AppLayout: FC<AppLayoutProps> = ({
  title,
  description,
  children,
  ...rest
}) => {
  return (
    <>
      <SEO title={title} description={description} />

      <Header />

      <Center as="main">
        <VStack
          w="full"
          maxW="9xl"
          gap="0"
          py={{ base: "lg", md: "normal" }}
          px={{ base: "lg", md: "md" }}
          {...rest}
        >
          <HStack alignItems="flex-start" w="full" maxW="full" gap="0">
            <Sidebar display={{ base: "flex", lg: "none" }} />

            {children}
          </HStack>
        </VStack>
      </Center>

      <Footer />
    </>
  )
}
