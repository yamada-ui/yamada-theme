import type { ResizableProps, StackProps } from "@yamada-ui/react"
import {
  useDisclosure,
  VStack,
  useIsMounted,
  runIfFunc,
  useLoading,
  useUpdateEffect,
  useBreakpoint,
} from "@yamada-ui/react"
import { useCallback, useEffect, useState } from "react"
import type { SetStateAction, FC } from "react"
import { ComponentBody, ComponentHeader } from "components/layouts"
import { CONSTANT } from "constant"
import { getCookie, setCookie } from "utils/storage"

export const MOBILE_BREAKPOINTS = ["md", "sm"]
export const DEFAULT_DIRECTION = "vertical"
export type ThemeDirection = ResizableProps["direction"]

type ComponentLayoutOptions = {}

export type ComponentLayoutProps = ComponentLayoutOptions

export const ComponentLayout: FC<ComponentLayoutProps> = ({}) => {
  return (
    <>
      <ComponentLayoutBody />
    </>
  )
}

type ComponentLayoutBodyProps = StackProps

const ComponentLayoutBody: FC<ComponentLayoutBodyProps> = ({ ...rest }) => {
  const { screen } = useLoading()
  const themeControls = useDisclosure()
  const [themeDirection, setThemeDirection] =
    useState<ThemeDirection>("vertical")
  const [, isMounted] = useIsMounted({ rerender: true })
  const breakpoint = useBreakpoint()
  const isThemePreviewOpen = themeControls.isOpen

  const onThemePreviewOpen = useCallback(() => {
    themeControls.onOpen()
    setCookie(CONSTANT.STORAGE.COMPONENT_THEME_PREVIEW_IS_OPEN, "true")
  }, [themeControls])

  const onThemePreviewClose = useCallback(() => {
    themeControls.onClose()
    setCookie(CONSTANT.STORAGE.COMPONENT_THEME_PREVIEW_IS_OPEN, "false")
  }, [themeControls])

  const onThemeDirectionChange = useCallback(
    (valueOrFunc: SetStateAction<ThemeDirection>) =>
      setThemeDirection((prev) => {
        const next = runIfFunc(valueOrFunc, prev)

        setCookie(
          CONSTANT.STORAGE.COMPONENT_THEME_PREVIEW_DIRECTION,
          next ?? DEFAULT_DIRECTION,
        )

        return next
      }),
    [],
  )

  useEffect(() => {
    if (!MOBILE_BREAKPOINTS.includes(breakpoint)) return

    onThemeDirectionChange("vertical")
  }, [breakpoint, onThemeDirectionChange])

  useUpdateEffect(() => {
    if (!isMounted) return

    const isOpen =
      getCookie<string>(
        document.cookie,
        CONSTANT.STORAGE.COMPONENT_THEME_PREVIEW_IS_OPEN,
        "false",
      ) === "true"

    if (isOpen) themeControls.onOpen()

    if (!MOBILE_BREAKPOINTS.includes(breakpoint)) {
      const codeDirection = getCookie<ThemeDirection>(
        document.cookie,
        CONSTANT.STORAGE.COMPONENT_THEME_PREVIEW_DIRECTION,
        "vertical",
      )

      setThemeDirection(codeDirection)
    }

    screen.finish()
  }, [isMounted])

  return (
    <VStack display={isMounted ? "flex" : "none"} h="100dvh" gap="0" {...rest}>
      <ComponentHeader
        {...{
          themeDirection: themeDirection,
          isThemePreviewOpen: isThemePreviewOpen,
          onThemePreviewOpen: onThemePreviewOpen,
        }}
      />

      <ComponentBody
        {...{
          themeDirection: themeDirection,
          onThemeDirectionChange: onThemeDirectionChange,
          isThemePreviewOpen: isThemePreviewOpen,
          onThemePreviewClose: onThemePreviewClose,
        }}
      />
    </VStack>
  )
}
