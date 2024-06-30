import {
  Box,
  Button,
  Center,
  forwardRef,
  Loading,
  UIProvider,
  useAsync,
} from "@yamada-ui/react"
import type {
  BoxProps,
  Dict,
  HTMLUIProps,
  LoadingProps,
  ThemeConfig,
} from "@yamada-ui/react"
import { memo, useMemo } from "react"
import type { ComponentContainerProps } from "component"

export type ComponentPreviewProps = BoxProps & {
  containerProps?: ComponentContainerProps
  loadingProps?: LoadingProps
}

export const ComponentPreview = memo(
  forwardRef<ComponentPreviewProps, "div">(
    ({ containerProps: _containerProps, loadingProps, ...rest }, ref) => {
      // const Component = dynamic(() => import(`/contents/${paths.component}`))

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

      return (
        <Center
          ref={ref}
          flexDirection="column"
          boxSize="full"
          minH="48"
          {...rest}
        >
          <UIProvider {...value}>
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
          </UIProvider>
        </Center>
      )
    },
  ),
)

ComponentPreview.displayName = "ComponentPreview"
