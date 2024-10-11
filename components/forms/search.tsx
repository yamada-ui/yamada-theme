import type { ButtonProps, ModalProps, StackProps } from "@yamada-ui/react"
import type { FC, KeyboardEvent, KeyboardEventHandler, RefObject } from "react"
import {
  ExternalLink,
  LayoutList,
  PanelsTopLeft,
  Search as SearchIcon,
} from "@yamada-ui/lucide"
import {
  dataAttr,
  Divider,
  forwardRef,
  handlerAll,
  Highlight,
  HStack,
  Icon,
  IconButton,
  isApple,
  Kbd,
  Modal,
  ModalBody,
  ModalHeader,
  Text,
  ui,
  useDisclosure,
  useUpdateEffect,
  VStack,
} from "@yamada-ui/react"
import { useI18n } from "contexts/i18n-context"
import { useEventListener } from "hooks/use-event-listener"
import { matchSorter } from "match-sorter"
import NextLink from "next/link"
import { useRouter } from "next/router"
import {
  createRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import scrollIntoView from "scroll-into-view-if-needed"

const ACTION_DEFAULT_KEY = "Ctrl"
const ACTION_APPLE_KEY = "⌘"

const useSearch = () => {
  const { events } = useRouter()
  const { isOpen, onClose, onOpen } = useDisclosure()

  useEffect(() => {
    events.on("routeChangeComplete", onClose)

    return () => {
      events.off("routeChangeComplete", onClose)
    }
  }, [onClose, events])

  return { isOpen, onClose, onOpen }
}

export type SearchProps = {} & StackProps

export const Search = memo(
  forwardRef<SearchProps, "button">(({ ...rest }, ref) => {
    const { tc } = useI18n()
    const { isOpen, onClose, onOpen } = useSearch()
    const [actionKey, setActionKey] = useState(ACTION_APPLE_KEY)

    useEffect(() => {
      if (!isApple()) setActionKey(ACTION_DEFAULT_KEY)
    }, [])

    useEventListener("keydown", (ev) => {
      if (
        ev.key.toLowerCase() !== "k" ||
        !ev[isApple() ? "metaKey" : "ctrlKey"]
      )
        return

      ev.preventDefault()

      if (isOpen) {
        onClose()
      } else {
        onOpen()
      }
    })

    return (
      <>
        <HStack
          ref={ref}
          as="button"
          type="button"
          bg={["white", "black"]}
          border="1px solid"
          color={["blackAlpha.600", "whiteAlpha.400"]}
          gap="sm"
          h="10"
          maxW="lg"
          outline="0"
          px="3"
          rounded="md"
          transitionDuration="slower"
          transitionProperty="common"
          w="full"
          _focusVisible={{ shadow: "outline" }}
          {...rest}
          onClick={handlerAll(rest.onClick, onOpen)}
        >
          <SearchIcon fontSize="xl" />
          <Text flex="1">{tc("component.forms.search.message")}</Text>
          <Kbd>{actionKey} + K</Kbd>
        </HStack>

        <SearchModal isOpen={isOpen} onClose={onClose} />
      </>
    )
  }),
)

export type SearchButtonProps = {} & ButtonProps

export const SearchButton = memo(
  forwardRef<SearchButtonProps, "button">(({ ...rest }, ref) => {
    const { isOpen, onClose, onOpen } = useSearch()

    return (
      <>
        <IconButton
          ref={ref}
          type="button"
          variant="ghost"
          color="muted"
          icon={<SearchIcon fontSize="2xl" />}
          _hover={{ bg: ["blackAlpha.100", "whiteAlpha.50"] }}
          {...rest}
          onClick={handlerAll(rest.onClick, onOpen)}
        />

        <SearchModal isOpen={isOpen} onClose={onClose} />
      </>
    )
  }),
)

type SearchModalProps = ModalProps

const SearchModal: FC<SearchModalProps> = memo(
  ({ isOpen, onClose, ...rest }) => {
    const [query, setQuery] = useState<string>("")
    const [selectedIndex, setSelectedIndex] = useState<number>(0)
    const { contents, t } = useI18n()
    const router = useRouter()
    const eventRef = useRef<"keyboard" | "mouse" | null>(null)
    const directionRef = useRef<"down" | "up">("down")
    const compositionRef = useRef<boolean>(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const itemRefs = useRef<Map<number, RefObject<HTMLAnchorElement>>>(
      new Map(),
    )

    const hits = useMemo(() => {
      if (query.length < 1) return []

      return matchSorter(contents, query, {
        keys: [
          "hierarchy.categoryGroup",
          "hierarchy.category",
          "hierarchy.component",
          "description",
          "title",
        ],
      }).slice(0, 20)
    }, [query, contents])

    const onKeyDown = useCallback(
      (ev: KeyboardEvent<HTMLInputElement>) => {
        if (compositionRef.current) return

        eventRef.current = "keyboard"

        const actions: {
          [key: string]: KeyboardEventHandler<HTMLInputElement> | undefined
        } = {
          ArrowDown: () => {
            if (selectedIndex + 1 === hits.length) return

            directionRef.current = "down"
            setSelectedIndex(selectedIndex + 1)
          },
          ArrowUp: () => {
            if (selectedIndex === 0) return

            directionRef.current = "up"
            setSelectedIndex(selectedIndex - 1)
          },
          End: () => {
            directionRef.current = "down"
            setSelectedIndex(hits.length - 1)
          },
          Enter: () => {
            if (!hits.length) return

            const { type, slug } = hits[selectedIndex] ?? {}

            if (type === "component") {
              window.open(slug, "_blank")
            } else {
              onClose?.()
              router.push(slug)
            }
          },
          Home: () => {
            directionRef.current = "up"
            setSelectedIndex(0)
          },
        }

        const action = actions[ev.key]

        if (!action) return

        ev.preventDefault()
        ev.stopPropagation()

        action(ev)
      },
      [hits, onClose, selectedIndex, router],
    )

    useEffect(() => {
      if (isOpen) return

      setQuery("")
    }, [isOpen])

    useUpdateEffect(() => {
      setSelectedIndex(0)
    }, [query])

    useUpdateEffect(() => {
      if (!containerRef.current || eventRef.current === "mouse") return

      const itemRef = itemRefs.current.get(selectedIndex)

      if (!itemRef?.current) return

      scrollIntoView(itemRef.current, {
        behavior: (actions) =>
          actions.forEach(({ el, top }) => {
            if (directionRef.current === "down") {
              el.scrollTop = top + 16
            } else {
              el.scrollTop = top - 17
            }
          }),
        block: "nearest",
        boundary: containerRef.current,
        inline: "nearest",
        scrollMode: "if-needed",
      })
    }, [selectedIndex])

    return (
      <Modal
        size="3xl"
        isOpen={isOpen}
        placement="top"
        withCloseButton={false}
        onClose={onClose}
        {...rest}
      >
        <ModalHeader fontSize="md" fontWeight="normal" pb="md">
          <HStack position="relative" w="full">
            <ui.input
              autoComplete="off"
              autoCorrect="off"
              flex="1"
              maxLength={64}
              pl="lg"
              placeholder={t("component.forms.search.placeholder") as string}
              spellCheck="false"
              value={query}
              onChange={(ev) => setQuery(ev.target.value)}
              onCompositionEnd={() => {
                compositionRef.current = false
              }}
              onCompositionStart={() => {
                compositionRef.current = true
              }}
              onKeyDown={onKeyDown}
            />

            <SearchIcon
              color={["blackAlpha.700", "whiteAlpha.600"]}
              fontSize="2xl"
              left="0"
              pointerEvents="none"
              position="absolute"
              top="50%"
              transform="translateY(-50%)"
            />
          </HStack>
        </ModalHeader>

        {hits.length ? (
          <ModalBody ref={containerRef} my="0" pb="md">
            <Divider />

            <VStack as="ul" gap="sm">
              {hits.map(({ type, hierarchy, slug, title }, index) => {
                const isSelected = index === selectedIndex
                const ref = createRef<HTMLAnchorElement>()

                itemRefs.current.set(index, ref)

                return (
                  <HStack
                    key={slug}
                    ref={ref}
                    as={type === "component" ? "a" : NextLink}
                    href={slug}
                    target={type === "component" ? "_blank" : undefined}
                    data-selected={dataAttr(isSelected)}
                    bg={["blackAlpha.50", "whiteAlpha.50"]}
                    borderWidth="1px"
                    gap="2"
                    minH="16"
                    px="md"
                    py="sm"
                    rel={type === "component" ? "noopener" : undefined}
                    rounded="md"
                    transitionDuration="normal"
                    transitionProperty="colors"
                    _active={{}}
                    _focus={{ outline: "none" }}
                    _focusVisible={{ boxShadow: "outline" }}
                    _hover={{ boxShadow: "outline" }}
                    _selected={{ boxShadow: "outline" }}
                    onClick={type !== "component" ? onClose : undefined}
                    onMouseEnter={() => {
                      eventRef.current = "mouse"
                      setSelectedIndex(index)
                    }}
                  >
                    {type === "component" ? (
                      <Icon
                        as={PanelsTopLeft}
                        color={["blackAlpha.700", "whiteAlpha.600"]}
                        fontSize="2xl"
                      />
                    ) : (
                      <Icon
                        as={LayoutList}
                        color={["blackAlpha.700", "whiteAlpha.600"]}
                        fontSize="2xl"
                      />
                    )}

                    <VStack flex="1" gap="0">
                      {type === "category" || type === "component" ? (
                        <HStack gap="xs">
                          <Highlight
                            color="muted"
                            fontSize="xs"
                            lineClamp={1}
                            query={query}
                            markProps={{ variant: "text-accent" }}
                          >
                            {hierarchy.categoryGroup}
                          </Highlight>

                          {type === "component" ? (
                            <>
                              <Text
                                color="muted"
                                fontSize="xs"
                                lineHeight={1.2}
                              >
                                /
                              </Text>

                              <Highlight
                                color="muted"
                                fontSize="xs"
                                lineClamp={1}
                                query={query}
                                markProps={{ variant: "text-accent" }}
                              >
                                {hierarchy.category}
                              </Highlight>
                            </>
                          ) : null}
                        </HStack>
                      ) : null}

                      <Highlight
                        lineClamp={1}
                        query={query}
                        markProps={{ variant: "text-accent" }}
                      >
                        {title}
                      </Highlight>
                    </VStack>

                    {type === "component" ? (
                      <ExternalLink
                        color={["blackAlpha.700", "whiteAlpha.600"]}
                        fontSize="xl"
                      />
                    ) : null}
                  </HStack>
                )
              })}
            </VStack>
          </ModalBody>
        ) : null}
      </Modal>
    )
  },
)

SearchModal.displayName = "SearchModal"
