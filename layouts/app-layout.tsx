import type { StackProps } from "@yamada-ui/react"
import type {FC} from "react";
import { Center, HStack, VStack } from "@yamada-ui/react"
import { Footer, Header, Sidebar } from "components/layouts"
import { Seo } from "components/media-and-icons"

interface AppLayoutOptions {
  description?: string
  title?: string
}

export type AppLayoutProps = AppLayoutOptions & StackProps

export const AppLayout: FC<AppLayoutProps> = ({
  children,
  description,
  title,
  ...rest
}) => {
  return (
    <>
      <Seo description={description} title={title} />

      <Header />

      <Center as="main">
        <VStack
          gap="0"
          maxW="9xl"
          px={{ base: "lg", md: "md" }}
          py={{ base: "lg", md: "normal" }}
          w="full"
          {...rest}
        >
          <HStack alignItems="flex-start" gap="0" maxW="full" w="full">
            <Sidebar display={{ base: "flex", lg: "none" }} />

            {children}
          </HStack>
        </VStack>
      </Center>

      <Footer />
    </>
  )
}
