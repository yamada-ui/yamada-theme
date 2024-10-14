import type { ResizableProps, StackProps } from "@yamada-ui/react"
import {
  useDisclosure,
  VStack,
  useIsMounted,
  runIfFunc,
  useLoading,
  useUpdateEffect,
  useBreakpoint,
  HStack,
} from "@yamada-ui/react"
import { useCallback, useEffect, useState } from "react"
import type { SetStateAction, FC, ReactNode } from "react"
import { ComponentBody, ComponentHeader, Sidebar } from "components/layouts"
import { CONSTANT } from "constant"
import { getCookie, setCookie } from "utils/storage"

export const MOBILE_BREAKPOINTS = ["md", "sm"]
export const DEFAULT_DIRECTION = "vertical"
export type ThemeDirection = ResizableProps["direction"]

type ComponentLayoutOptions = {
  children?: ReactNode
}

export type ComponentLayoutProps = ComponentLayoutOptions

export const ComponentLayout: FC<ComponentLayoutProps> = () => {
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
      const themeDirection = getCookie<ThemeDirection>(
        document.cookie,
        CONSTANT.STORAGE.COMPONENT_THEME_PREVIEW_DIRECTION,
        "vertical",
      )

      setThemeDirection(themeDirection)
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

      <HStack alignItems="flex-start" w="full" h="100dvh" maxW="full" gap="0">
        {/* TODO: サイドバーは短くできてもよいのでは */}
        <Sidebar display={{ base: "flex", lg: "none" }} />

        <ComponentBody
          {...{
            themeDirection: themeDirection,
            onThemeDirectionChange: onThemeDirectionChange,
            isThemePreviewOpen: isThemePreviewOpen,
            onThemePreviewClose: onThemePreviewClose,
          }}
        />
      </HStack>
    </VStack>
  )
}