import createEmotionCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import weakMemoize from "@emotion/weak-memoize"
import {
  Box,
  Button,
  Center,
  defaultConfig,
  defaultTheme,
  EnvironmentProvider,
  forwardRef,
  GlobalStyle,
  Loading,
  LoadingProvider,
  NoticeProvider,
  ResetStyle,
  ThemeProvider,
  useAsync,
  createThemeSchemeManager,
  useColorMode,
  useTheme,
  ui,
} from "@yamada-ui/react"
import type {
  BoxProps,
  Dict,
  Environment,
  HTMLUIProps,
  LoadingProps,
  ThemeConfig,
  UIProviderProps,
} from "@yamada-ui/react"
import type { FC } from "react"
import { memo, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import type { ComponentContainerProps } from "component"

const UIProvider: FC<UIProviderProps & { environment?: Environment }> = ({
  theme = defaultTheme,
  config = defaultConfig,
  children,
  environment,
  ...rest
}) => {
  return (
    <EnvironmentProvider environment={environment}>
      <ThemeProvider theme={theme} config={config} {...rest}>
        <LoadingProvider {...config.loading}>
          <ResetStyle />
          <GlobalStyle />
          {children}
          <NoticeProvider {...config.notice} />
        </LoadingProvider>
      </ThemeProvider>
    </EnvironmentProvider>
  )
}

export type ComponentPreviewProps = BoxProps & {
  containerProps?: ComponentContainerProps
  loadingProps?: LoadingProps
  iframe?: boolean
}

const createCache = weakMemoize((container: Node) =>
  createEmotionCache({ container, key: "iframe-css" }),
)

export const ComponentPreview = memo(
  forwardRef<ComponentPreviewProps, "div">(
    (
      { containerProps: _containerProps, loadingProps, iframe, ...rest },
      ref,
    ) => {
      // const Component = dynamic(() => import(`/contents/${paths.component}`))
      const { colorMode } = useColorMode()
      const { themeScheme } = useTheme()
      const iframeRef = useRef<HTMLIFrameElement>(null)
      const headRef = useRef<HTMLHeadElement | null>(null)
      const bodyRef = useRef<HTMLElement | null>(null)
      const head = headRef.current
      const body = bodyRef.current
      const [, forceUpdate] = useState({})
      const themeSchemeManager = createThemeSchemeManager("cookie")

      useEffect(() => {
        if (!iframeRef.current) return

        const iframe = iframeRef.current

        headRef.current = iframe.contentDocument?.head ?? null
        bodyRef.current = iframe.contentDocument?.body ?? null

        forceUpdate({})
      }, [])

      useEffect(() => {
        if (!iframeRef.current) return

        const iframe = iframeRef.current

        if (iframe.contentDocument) {
          iframe.contentDocument.documentElement.dataset.mode = colorMode
          iframe.contentDocument.documentElement.dataset.theme = themeScheme
          iframe.contentDocument.documentElement.style.colorScheme = colorMode
        }
      }, [colorMode, themeScheme])

      const { loading, value } = useAsync(async () => {
        let theme: Dict | undefined
        let config: ThemeConfig | undefined

        // if (paths.theme) {
        //   const module = await import(`/contents/${paths.theme}`)
        //   theme = module.default ?? module.theme
        // }
        // if (paths.config) {
        //   const module = await import(`/contents/${paths.config}`)
        //   config = module.default ?? module.theme
        // }

        return { theme, config }
      })

      const containerProps = useMemo<HTMLUIProps<"div">>(() => {
        const { centerContent, ...rest } = _containerProps ?? {}

        let props: HTMLUIProps<"div"> = {
          w: "full",
          h: "full",
          containerType: "inline-size",
          ...rest,
        }

        if (centerContent) {
          props = {
            ...props,
            display: "flex",
            placeContent: "center",
            placeItems: "center",
          }
        }

        return props
      }, [_containerProps])

      const environment: Environment = {
        getDocument: () => iframeRef.current?.contentDocument ?? document,
        getWindow: () =>
          iframeRef.current?.contentDocument?.defaultView ?? window,
      }

      return iframe ? (
        <ui.iframe
          title="component-preview-iframe"
          ref={iframeRef}
          w="full"
          minH="md"
          h="full"
          display={rest.display}
        >
          {head && body
            ? createPortal(
                <CacheProvider value={createCache(head)}>
                  <UIProvider
                    {...{ ...value, environment, themeSchemeManager }}
                  >
                    <Center
                      ref={ref}
                      flexDirection="column"
                      boxSize="full"
                      minH="48"
                      {...rest}
                    >
                      {!loading ? (
                        <Box boxSize="full" flex="1" {...containerProps}>
                          {/* <Component /> */}
                          <Center>
                            <Button>button</Button>
                          </Center>
                        </Box>
                      ) : (
                        <Center boxSize="full" flex="1">
                          <Loading size="6xl" {...loadingProps} />
                        </Center>
                      )}
                    </Center>
                  </UIProvider>
                </CacheProvider>,
                body,
              )
            : undefined}
        </ui.iframe>
      ) : (
        <UIProvider {...{ ...value, environment, themeSchemeManager }}>
          <Center
            ref={ref}
            flexDirection="column"
            boxSize="full"
            minH="48"
            {...rest}
          >
            {!loading ? (
              <Box boxSize="full" flex="1" {...containerProps}>
                {/* <Component /> */}
                <Center>
                  <Button>button</Button>
                </Center>
              </Box>
            ) : (
              <Center boxSize="full" flex="1">
                <Loading size="6xl" {...loadingProps} />
              </Center>
            )}
          </Center>
        </UIProvider>
      )
    },
  ),
)

ComponentPreview.displayName = "ComponentPreview"
