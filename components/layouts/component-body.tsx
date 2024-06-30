import {
  forwardRef,
  Resizable,
  ResizableItem,
  ResizableTrigger,
  useBreakpoint,
} from "@yamada-ui/react"
import type {
  ResizableItemControl,
  ResizableProps,
  ResizableStorage,
} from "@yamada-ui/react"
import type { SetStateAction } from "react"
import { memo, useEffect, useMemo, useRef } from "react"
import { ComponentThemePreview } from "components/data-display"
import { CONSTANT } from "constant"

export type CodeDirection = ResizableProps["direction"]
export const MOBILE_BREAKPOINTS = ["md", "sm"]

export type ComponentBodyProps = ResizableProps & {
  codeDirection: CodeDirection
  onCodeDirectionChange: (valueOrFunc: SetStateAction<CodeDirection>) => void
  isCodePreviewOpen: boolean
  onCodePreviewClose: () => void
}

export const ComponentBody = memo(
  forwardRef<ComponentBodyProps, "div">(
    (
      {
        codeDirection,
        onCodeDirectionChange,
        isCodePreviewOpen,
        onCodePreviewClose,
        ...rest
      },
      ref,
    ) => {
      const controlRef = useRef<ResizableItemControl>(null)
      const breakpoint = useBreakpoint()

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
      const isVertical = codeDirection === "vertical"

      return (
        <Resizable
          ref={ref}
          direction={codeDirection}
          flex="1"
          storageKey={CONSTANT.STORAGE.COMPONENT_LAYOUT}
          storage={storage}
          {...rest}
        >
          <ResizableItem
            id="preview"
            order={1}
            defaultSize={isCodePreviewOpen ? (isMobile ? 0 : 70) : 100}
            overflow="auto"
            h="full"
          >
            component preview
          </ResizableItem>

          {isCodePreviewOpen ? (
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
                  codeDirection={codeDirection}
                  onCodeDirectionChange={onCodeDirectionChange}
                  onCodePreviewClose={onCodePreviewClose}
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
