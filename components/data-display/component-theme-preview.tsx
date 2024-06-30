import { X } from "@yamada-ui/lucide"
import {
  ColorPicker,
  Divider,
  forwardRef,
  handlerAll,
  HStack,
  IconButton,
  Input,
  Spacer,
  TabList,
  TabPanel,
  Tabs,
  Text,
  VStack,
} from "@yamada-ui/react"
import type { TabsProps } from "@yamada-ui/react"
import type { SetStateAction } from "react"
import { memo } from "react"
import { LayoutHorizontal, LayoutVertical } from "components/media-and-icons"
import type { ThemeDirection } from "layouts/component-layout"

export type ComponentThemePreviewProps = TabsProps & {
  themeDirection?: ThemeDirection
  onThemeDirectionChange?: (valueOrFunc: SetStateAction<ThemeDirection>) => void
  onThemePreviewClose?: () => void
}

export const ComponentThemePreview = memo(
  forwardRef<ComponentThemePreviewProps, "div">(
    (
      { themeDirection, onThemeDirectionChange, onThemePreviewClose, ...rest },
      ref,
    ) => {
      const isVertical = themeDirection === "vertical"

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
              {themeDirection ? (
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
                    onThemeDirectionChange?.((prev) =>
                      prev === "vertical" ? "horizontal" : "vertical",
                    )
                  }
                />
              ) : null}
              {onThemePreviewClose ? (
                <IconButton
                  aria-label="Close code preview"
                  size="sm"
                  variant="ghost"
                  color="muted"
                  fontSize="lg"
                  icon={<X />}
                  onClick={onThemePreviewClose}
                />
              ) : null}
            </HStack>
          </TabList>

          <TabPanel>
            <VStack divider={<Divider size="full" />}>
              <HStack>
                <Text>title</Text>

                <Spacer />

                <Input />
              </HStack>
              <HStack>
                <Text>color</Text>

                <Spacer />

                <ColorPicker />
              </HStack>
            </VStack>
          </TabPanel>
        </Tabs>
      )
    },
  ),
)

ComponentThemePreview.displayName = "ComponentThemePreview"
