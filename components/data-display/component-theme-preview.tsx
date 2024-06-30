import { X } from "@yamada-ui/lucide"
import {
  forwardRef,
  handlerAll,
  HStack,
  IconButton,
  TabList,
  Tabs,
} from "@yamada-ui/react"
import type { ResizableProps, TabsProps } from "@yamada-ui/react"
import type { SetStateAction } from "react"
import { memo } from "react"
import { LayoutHorizontal, LayoutVertical } from "components/media-and-icons"

export type CodeDirection = ResizableProps["direction"]

export type ComponentThemePreviewProps = TabsProps & {
  codeDirection?: CodeDirection
  onCodeDirectionChange?: (valueOrFunc: SetStateAction<CodeDirection>) => void
  onCodePreviewClose?: () => void
}

export const ComponentThemePreview = memo(
  forwardRef<ComponentThemePreviewProps, "div">(
    (
      { codeDirection, onCodeDirectionChange, onCodePreviewClose, ...rest },
      ref,
    ) => {
      const isVertical = codeDirection === "vertical"

      return (
        <Tabs ref={ref} {...rest} onChange={handlerAll(rest.onChange)}>
          <TabList position="sticky" top="0" bg={["white", "black"]}>
            <HStack
              tabIndex={-1}
              mb="-px"
              w="full"
              gap="0"
              overflowX="auto"
              scrollbarWidth="none"
              _scrollbar={{ display: "none" }}
            >
              tabs
            </HStack>

            <HStack ms="md" me="sm" gap="0">
              CopyButton
              {codeDirection ? (
                <IconButton
                  aria-label="Change code preview direction"
                  size="sm"
                  variant="ghost"
                  display={{ base: "inline-flex", md: "none" }}
                  color="muted"
                  icon={
                    isVertical ? (
                      <LayoutHorizontal boxSize="4" />
                    ) : (
                      <LayoutVertical boxSize="4" />
                    )
                  }
                  onClick={() =>
                    onCodeDirectionChange?.((prev) =>
                      prev === "vertical" ? "horizontal" : "vertical",
                    )
                  }
                />
              ) : null}
              {onCodePreviewClose ? (
                <IconButton
                  aria-label="Close code preview"
                  size="sm"
                  variant="ghost"
                  color="muted"
                  fontSize="lg"
                  icon={<X />}
                  onClick={onCodePreviewClose}
                />
              ) : null}
            </HStack>
          </TabList>
          code
        </Tabs>
      )
    },
  ),
)

ComponentThemePreview.displayName = "ComponentThemePreview"
