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

export const DefaultPropsBlock: FC<DefaultPropsBlockProps> = ({ theme }) => {
  const defaultProps = theme["defaultProps"]
  const variants = theme["variants"]

  const items: SegmentedControlItem[] =
    variants !== undefined
      ? Object.keys(variants).map((value) => ({
          label: value,
          value: value,
        }))
      : []

  return (
    <HStack>
      <Text>variant</Text>

      <Spacer />

      <SegmentedControl
        items={items}
        defaultValue={defaultProps?.variant as string | undefined}
      />
    </HStack>
  )
}
