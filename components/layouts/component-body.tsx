import {
  forwardRef,
  noop,
  Resizable,
  ResizableItem,
  ResizableTrigger,
  useBreakpoint,
} from "@yamada-ui/react"
import type {
  ComponentMultiStyle,
  ResizableItemControl,
  ResizableProps,
  ResizableStorage,
  ComponentStyle,
} from "@yamada-ui/react"
import type { SetStateAction } from "react"
import { memo, useCallback, useEffect, useMemo, useRef } from "react"
import { ComponentThemePreview } from "components/data-display"
import { ComponentPreview } from "components/data-display/component-preview"
import { CONSTANT } from "constant"
import type { ThemeDirection } from "layouts/component-layout"

export const MOBILE_BREAKPOINTS = ["md", "sm"]

export type ComponentBodyProps = ResizableProps & {
  themeDirection: ThemeDirection
  onThemeDirectionChange: (valueOrFunc: SetStateAction<ThemeDirection>) => void
  isThemePreviewOpen: boolean
  onThemePreviewClose: () => void
}

export const ComponentBody = memo(
  forwardRef<ComponentBodyProps, "div">(
    (
      {
        themeDirection,
        onThemeDirectionChange,
        isThemePreviewOpen,
        onThemePreviewClose,
        ...rest
      },
      ref,
    ) => {
      const controlRef = useRef<ResizableItemControl>(null)
      const breakpoint = useBreakpoint()
      const setThemeRef =
        useRef<(theme: ComponentStyle | ComponentMultiStyle) => void>(noop)

      const onChangeTheme = useCallback(
        (theme: ComponentStyle | ComponentMultiStyle) => {
          setThemeRef.current(theme)
        },
        [],
      )

      const storage: ResizableStorage = useMemo(
        () => ({
          getItem: (key) => {
            const match = document.cookie.match(
              new RegExp(`(^| )${key}=([^;]+)`),
            )

            return match ? match[2] : null
          },
          setItem: (key, value) => {
            document.cookie = `${key}=${value}; max-age=31536000; path=/`
          },
        }),
        [],
      )

      useEffect(() => {
        if (!MOBILE_BREAKPOINTS.includes(breakpoint)) return

        if (controlRef.current) controlRef.current.resize(100)
      }, [breakpoint])

      const isMobile = MOBILE_BREAKPOINTS.includes(breakpoint)
      const isVertical = themeDirection === "vertical"

      return (
        <Resizable
          ref={ref}
          direction={themeDirection}
          flex="1"
          storageKey={CONSTANT.STORAGE.COMPONENT_LAYOUT}
          storage={storage}
          {...rest}
        >
          <ResizableItem
            id="preview"
            order={1}
            defaultSize={isThemePreviewOpen ? (isMobile ? 0 : 70) : 100}
            overflow="auto"
            h="full"
          >
            <ComponentPreview setThemeRef={setThemeRef} />
          </ResizableItem>

          {isThemePreviewOpen ? (
            <>
              <ResizableTrigger
                _active={!isMobile ? { bg: "focus" } : undefined}
                _hover={!isMobile ? { bg: "focus" } : undefined}
                transitionProperty="background"
                transitionDuration="normal"
                isDisabled={isMobile}
              />

              <ResizableItem
                id="code"
                controlRef={controlRef}
                order={2}
                defaultSize={isMobile ? 100 : 30}
                minW="xs"
                minH="xs"
                overflow="auto"
              >
                <ComponentThemePreview
                  themeDirection={themeDirection}
                  onThemeDirectionChange={onThemeDirectionChange}
                  onThemePreviewClose={onThemePreviewClose}
                  onChangeTheme={onChangeTheme}
                  borderTopWidth={isVertical ? "0px" : "1px"}
                />
              </ResizableItem>
            </>
          ) : null}
        </Resizable>
      )
    },
  ),
)

ComponentBody.displayName = "ComponentBody"
