import { Menu } from "@yamada-ui/lucide"
import {
  CloseButton,
  forwardRef,
  handlerAll,
  Heading,
  HStack,
  IconButton,
  useDisclosure,
} from "@yamada-ui/react"
import type { StackProps, UseDisclosureReturn } from "@yamada-ui/react"
import type { FC } from "react"
import { memo } from "react"
import { ColorModeButton, ThemeSchemeButton } from "components/forms"
import {
  Github,
  LayoutHorizontal,
  LayoutVertical,
} from "components/media-and-icons"
import { NextLinkIconButton, Tree } from "components/navigation"
import { MobileMenu } from "components/overlay"
import { CONSTANT } from "constant"
import type { CodeDirection } from "layouts/component-layout"

export type ComponentHeaderProps = StackProps & {
  codeDirection: CodeDirection
  isCodePreviewOpen: boolean
  onCodePreviewOpen: () => void
}

export const ComponentHeader = memo(
  forwardRef<ComponentHeaderProps, "div">(
    ({ codeDirection, isCodePreviewOpen, onCodePreviewOpen, ...rest }, ref) => {
      const { isOpen, onOpen, onClose } = useDisclosure()

      return (
        <>
          <HStack ref={ref} py="3" px={{ base: "lg", md: "md" }} {...rest}>
            <Heading fontSize="2xl" lineClamp={1} flex="1">
              component header
            </Heading>

            <ButtonGroup
              {...{
                isOpen,
                onOpen,
                codeDirection,
                isCodePreviewOpen,
                onCodePreviewOpen,
              }}
            />
          </HStack>

          <MobileMenu
            isOpen={isOpen}
            onClose={onClose}
            header={
              <ButtonGroup
                isMobile
                {...{
                  isOpen,
                  onClose,
                  codeDirection,
                  isCodePreviewOpen,
                  onCodePreviewOpen,
                }}
              />
            }
          >
            <Tree py="sm" />
          </MobileMenu>
        </>
      )
    },
  ),
)

ComponentHeader.displayName = "ComponentHeader"

type ButtonGroupProps = Partial<UseDisclosureReturn> & {
  isMobile?: boolean
  codeDirection: CodeDirection
  isCodePreviewOpen: boolean
  onCodePreviewOpen: () => void
}

const ButtonGroup: FC<ButtonGroupProps> = memo(
  ({
    isMobile,
    codeDirection,
    isCodePreviewOpen,
    onCodePreviewOpen,
    isOpen,
    onOpen,
    onClose,
  }) => {
    const isVertical = codeDirection === "vertical"

    return (
      <HStack gap="sm">
        {!isCodePreviewOpen || isMobile ? (
          <IconButton
            aria-label="Open source code"
            variant="ghost"
            color="muted"
            display={{
              base: "inline-flex",
              md: !isMobile ? "none" : undefined,
            }}
            icon={isVertical ? <LayoutVertical /> : <LayoutHorizontal />}
            onClick={handlerAll(
              onCodePreviewOpen,
              isMobile ? onClose : undefined,
            )}
          />
        ) : null}

        <ThemeSchemeButton
          display={{ base: "inline-flex", md: !isMobile ? "none" : undefined }}
        />

        <ColorModeButton />

        <NextLinkIconButton
          href={`${CONSTANT.SNS.GITHUB.EDIT_URL}`}
          isExternal
          display={{ base: "inline-flex", md: !isMobile ? "none" : undefined }}
          aria-label="GitHub source code"
          variant="ghost"
          color="muted"
          icon={<Github />}
        />

        {!isOpen ? (
          <IconButton
            variant="ghost"
            aria-label="Open navigation menu"
            display={{ base: "none", md: "inline-flex" }}
            color="muted"
            onClick={onOpen}
            icon={<Menu fontSize="2xl" />}
          />
        ) : (
          <CloseButton
            size="lg"
            aria-label="Close navigation menu"
            display={{ base: "none", md: "inline-flex" }}
            color="muted"
            onClick={onClose}
          />
        )}
      </HStack>
    )
  },
)

ButtonGroup.displayName = "ButtonGroup"
