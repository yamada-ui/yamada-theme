import {
  ComponentMultiStyle,
  ComponentStyle,
  Dict,
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  isFunction,
  isObject,
  SegmentedControl,
  SegmentedControlItem,
  Spacer,
  Text,
  UIStyle,
  VStack,
} from "@yamada-ui/react"
import { FC } from "react"

type RecursiveRowProps = {
  parentTree?: string[]
  onChangeTheme: (theme: Dict) => void
  name: string
  value: any
}

export type ThemeBlockProps = {
  styles?: UIStyle
  onChangeTheme: (theme: Dict) => void
}

export type DefaultPropsBlockProps = {
  theme: ComponentStyle | ComponentMultiStyle
  colorSchemes: string[]
  onChangeTheme: (theme: Dict) => void
}

const RecursiveRow: FC<RecursiveRowProps> = ({
  parentTree,
  name,
  value,
  onChangeTheme,
}) => {
  if (isObject(value) && !isFunction(value)) {
    return (
      <>
        <Text>{name}</Text>

        <VStack pl="lg" gap={0}>
          {Object.entries(value).map(([key, value]) => (
            <RecursiveRow
              key={key}
              parentTree={parentTree ? [...parentTree, name] : [name]}
              name={key}
              value={value}
              onChangeTheme={onChangeTheme}
            />
          ))}
        </VStack>
      </>
    )
  } else {
    return (
      <HStack key={name}>
        <Text>{name}</Text>

        <Spacer />

        <Editable
          defaultValue={value.toString()}
          onChange={(value) => {
            const createObject = (parentTree: string[]): Dict =>
              parentTree.reduceRight(
                (acc, key) => ({ [key]: acc }),
                value as unknown as Dict,
              )

            const updatedTheme = createObject(
              parentTree ? [...parentTree, name] : [name],
            )
            onChangeTheme(updatedTheme)
          }}
        >
          <EditablePreview />
          <EditableInput />
        </Editable>
      </HStack>
    )
  }
}

export const ThemeBlock: FC<ThemeBlockProps> = ({ styles, onChangeTheme }) => {
  if (styles === undefined) return

  return Object.entries(styles).map(([key, value]) => (
    <RecursiveRow
      key={key}
      name={key}
      value={value}
      onChangeTheme={onChangeTheme}
    />
  ))
}

export const DefaultPropsBlock: FC<DefaultPropsBlockProps> = ({
  theme,
  colorSchemes,
  onChangeTheme,
}) => {
  const defaultProps = theme["defaultProps"]
  //TODO: size, colorScheme
  const variants = theme["variants"]
  const sizes = theme["sizes"]

  const variantItems: SegmentedControlItem[] =
    variants !== undefined
      ? Object.keys(variants).map((value) => ({
          label: value,
          value: value,
        }))
      : []

  const sizeItems: SegmentedControlItem[] =
    sizes !== undefined
      ? Object.keys(sizes).map((value) => ({
          label: value,
          value: value,
        }))
      : []

  const colorSchemeItems: SegmentedControlItem[] =
    colorSchemes !== undefined
      ? colorSchemes.map((value) => ({
          label: value,
          value: value,
        }))
      : []

  return (
    <VStack>
      <HStack>
        <Text>variant</Text>

        <Spacer />

        <SegmentedControl
          items={variantItems}
          defaultValue={defaultProps?.variant as string | undefined}
          onChange={(value) => {
            onChangeTheme({ variant: value })
          }}
        />
      </HStack>

      <HStack>
        <Text>size</Text>

        <Spacer />

        <SegmentedControl
          items={sizeItems}
          defaultValue={defaultProps?.size as string | undefined}
          onChange={(value) => {
            onChangeTheme({ size: value })
          }}
        />
      </HStack>

      <HStack>
        <Text>colorScheme</Text>

        <Spacer />

        <SegmentedControl
          items={colorSchemeItems}
          defaultValue={defaultProps?.colorScheme as string | undefined}
          onChange={(value) => {
            onChangeTheme({ colorScheme: value })
          }}
        />
      </HStack>
    </VStack>
  )
}
