import type {
  ComponentMultiStyle,
  ComponentStyle,
  Dict,
  TabsProps,
} from "@yamada-ui/react"
import type { Component } from "component"
import type { ThemeDirection } from "layouts/component-layout"
import type { SetStateAction } from "react"
import { X } from "@yamada-ui/lucide"
import {
  defaultTheme,
  forwardRef,
  handlerAll,
  HStack,
  IconButton,
  merge,
  omitObject,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@yamada-ui/react"
import { LayoutHorizontal, LayoutVertical } from "components/media-and-icons"
import { memo, useState } from "react"
import { DefaultPropsBlock, ThemeBlock } from "./theme-block"

export type ComponentThemePreviewProps = {
    themeDirection?: ThemeDirection
    onChangeTheme?: (theme: ComponentMultiStyle | ComponentStyle) => void
    onThemeDirectionChange?: (
      valueOrFunc: SetStateAction<ThemeDirection>,
    ) => void
    onThemePreviewClose?: () => void
  } &
  Pick<Component, "name"> & TabsProps

export const ComponentThemePreview = memo(
  forwardRef<ComponentThemePreviewProps, "div">(
    (
      {
        name,
        themeDirection,
        onChangeTheme: onChangeThemeProp,
        onThemeDirectionChange,
        onThemePreviewClose,
        ...rest
      },
      ref,
    ) => {
      const isVertical = themeDirection === "vertical"
      // TODO: テーマをグローバルで保管するかとか考える
      const colorSchemes = Object.keys(
        defaultTheme.semantics.colorSchemes ?? {},
      )

      // TODO: multiかどうかで表示も切り替える必要があるか
      // TODO: テーマをグローバルで保管するかどうするかとか考える
      // TODO: 継承もできるようにするか考える
      const [theme, setTheme] = useState(
        defaultTheme.components[name as keyof typeof defaultTheme.components],
      )

      const onChangeTheme =
        (key: string) => (keyTree: string[], value: any) => {
          const newTheme = merge(
            theme,
            [key, ...keyTree].reduceRight(
              (acc, key) => ({ [key]: acc }),
              value as unknown as Dict,
            ),
          )

          setTheme(newTheme)
          onChangeThemeProp?.(newTheme)
        }

      const onRemoveTheme = (key: string) => (keyTree: string[]) => {
        const newTheme = omitObject<Dict>(theme, [[key, ...keyTree].join(".")])

        setTheme(newTheme)
        onChangeThemeProp?.(newTheme)
      }

      return (
        <Tabs ref={ref} {...rest} onChange={handlerAll(rest.onChange)}>
          <TabList bg={["white", "black"]} position="sticky" top="0">
            <HStack
              gap="0"
              mb="-px"
              overflowX="auto"
              scrollbarWidth="none"
              tabIndex={-1}
              w="full"
              _scrollbar={{ display: "none" }}
            >
              {Object.keys(theme).map((key) => (
                <Tab
                  key={key}
                  color="muted"
                  mb="0"
                  overflow="visible"
                  _focusVisible={{}}
                >
                  {key}
                </Tab>
              ))}
            </HStack>

            <HStack gap="0" me="sm" ms="md">
              {themeDirection ? (
                <IconButton
                  size="sm"
                  variant="ghost"
                  aria-label="Change code preview direction"
                  color="muted"
                  display={{ base: "inline-flex", md: "none" }}
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
                  size="sm"
                  variant="ghost"
                  aria-label="Close code preview"
                  color="muted"
                  fontSize="lg"
                  icon={<X />}
                  onClick={onThemePreviewClose}
                />
              ) : null}
            </HStack>
          </TabList>

          {Object.keys(theme).map((key) => {
            if (key === "defaultProps") {
              return (
                <TabPanel key={key}>
                  <DefaultPropsBlock
                    colorSchemes={colorSchemes}
                    theme={theme}
                    onChangeTheme={onChangeTheme(key)}
                  />
                </TabPanel>
              )
            } else {
              const styles =
                theme[key as keyof (ComponentMultiStyle | ComponentStyle)]

              return (
                <TabPanel key={key}>
                  <ThemeBlock
                    styles={styles}
                    onChangeTheme={onChangeTheme(key)}
                    onRemoveTheme={onRemoveTheme(key)}
                  />
                </TabPanel>
              )
            }
          })}
        </Tabs>
      )
    },
  ),
)

ComponentThemePreview.displayName = "ComponentThemePreview"
