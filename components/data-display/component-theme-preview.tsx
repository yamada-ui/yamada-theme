import { X } from "@yamada-ui/lucide"
import {
  Accordion,
  AccordionItem,
  AccordionLabel,
  AccordionPanel,
  defaultTheme,
  Editable,
  EditableInput,
  EditablePreview,
  forwardRef,
  handlerAll,
  HStack,
  IconButton,
  merge,
  Spacer,
  TabList,
  TabPanel,
  Tabs,
  Text,
  VStack,
} from "@yamada-ui/react"
import type {
  ComponentMultiStyle,
  ComponentStyle,
  TabsProps,
} from "@yamada-ui/react"
import type { SetStateAction } from "react"
import { memo, useState } from "react"
import { LayoutHorizontal, LayoutVertical } from "components/media-and-icons"
import type { ThemeDirection } from "layouts/component-layout"

export type ComponentThemePreviewProps = TabsProps & {
  themeDirection?: ThemeDirection
  onThemeDirectionChange?: (valueOrFunc: SetStateAction<ThemeDirection>) => void
  onThemePreviewClose?: () => void
  onChangeTheme?: (theme: ComponentStyle | ComponentMultiStyle) => void
}

export const ComponentThemePreview = memo(
  forwardRef<ComponentThemePreviewProps, "div">(
    (
      {
        themeDirection,
        onThemeDirectionChange,
        onThemePreviewClose,
        onChangeTheme,
        ...rest
      },
      ref,
    ) => {
      const isVertical = themeDirection === "vertical"
      //NOTE: multiかどうかはtypeを見ればよさそう
      const [theme, setTheme] = useState(defaultTheme.components.Button)

      const temp = Object.keys(theme).map((key) => {
        const styles = theme[key as keyof ComponentStyle]
        // console.log(styles)

        return (
          <AccordionItem key={key}>
            <AccordionLabel>{key}</AccordionLabel>
            <AccordionPanel>
              <VStack>
                {styles !== undefined &&
                  Object.entries(styles).map(([innerKey, value]) => {
                    return (
                      <HStack key={innerKey}>
                        <Text>{innerKey}</Text>

                        <Spacer />

                        <Editable
                          defaultValue={value.toString()}
                          onChange={(value) => {
                            const newTheme = merge(theme, {
                              [key]: { [innerKey]: value },
                            })

                            setTheme(newTheme)
                            onChangeTheme?.(newTheme)
                          }}
                        >
                          <EditablePreview />
                          <EditableInput />
                        </Editable>
                      </HStack>
                    )
                  })}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        )
      })

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
            {/* <VStack divider={<Divider size="full" />}> */}
            {/*   <HStack> */}
            {/*     <Text>title</Text> */}
            {/**/}
            {/*     <Spacer /> */}
            {/**/}
            {/*     <Input /> */}
            {/*   </HStack> */}
            {/*   <HStack> */}
            {/*     <Text>color</Text> */}
            {/**/}
            {/*     <Spacer /> */}
            {/**/}
            {/*     <ColorPicker /> */}
            {/*   </HStack> */}
            {/* </VStack> */}
            <Accordion>{temp}</Accordion>
          </TabPanel>
        </Tabs>
      )
    },
  ),
)

ComponentThemePreview.displayName = "ComponentThemePreview"
