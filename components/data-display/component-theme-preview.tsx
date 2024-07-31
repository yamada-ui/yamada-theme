import { X } from "@yamada-ui/lucide"
import {
  defaultTheme,
  forwardRef,
  handlerAll,
  HStack,
  IconButton,
  merge,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@yamada-ui/react"
import type {
  ComponentMultiStyle,
  ComponentStyle,
  Dict,
  TabsProps,
} from "@yamada-ui/react"
import type { SetStateAction } from "react"
import { memo, useState } from "react"
import { ThemeBlock } from "./theme-block"
import type { Component } from "component"
import { LayoutHorizontal, LayoutVertical } from "components/media-and-icons"
import type { ThemeDirection } from "layouts/component-layout"

export type ComponentThemePreviewProps = TabsProps &
  Pick<Component, "name"> & {
    themeDirection?: ThemeDirection
    onThemeDirectionChange?: (
      valueOrFunc: SetStateAction<ThemeDirection>,
    ) => void
    onThemePreviewClose?: () => void
    onChangeTheme?: (theme: ComponentStyle | ComponentMultiStyle) => void
  }

export const ComponentThemePreview = memo(
  forwardRef<ComponentThemePreviewProps, "div">(
    (
      {
        name,
        themeDirection,
        onThemeDirectionChange,
        onThemePreviewClose,
        onChangeTheme: onChangeThemeProp,
        ...rest
      },
      ref,
    ) => {
      const isVertical = themeDirection === "vertical"
      //TODO: multiかどうかはtypeを見ればよさそう
      const [theme, setTheme] = useState(
        defaultTheme.components[name as keyof typeof defaultTheme.components],
      )

      const onChangeTheme = (key: string) => (prop: Dict) => {
        const newTheme = merge(theme, {
          [key]: prop,
        })

        setTheme(newTheme)
        onChangeThemeProp?.(newTheme)
      }

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
              {Object.keys(theme).map((key) => (
                <Tab
                  key={key}
                  mb="0"
                  overflow="visible"
                  color="muted"
                  _focusVisible={{}}
                >
                  {key}
                </Tab>
              ))}
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

          {Object.keys(theme).map((key) => {
            const styles = theme[key as keyof ComponentStyle]

            return (
              <TabPanel key={key}>
                <ThemeBlock
                  styles={styles}
                  onChangeTheme={onChangeTheme(key)}
                />
              </TabPanel>
            )
          })}
        </Tabs>
      )
    },
  ),
)

ComponentThemePreview.displayName = "ComponentThemePreview"
