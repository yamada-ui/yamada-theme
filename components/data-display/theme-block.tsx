import {
  ComponentMultiStyle,
  ComponentStyle,
  Dict,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  isFunction,
  isObject,
  RadioGroup,
  RadioItem,
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

// NOTE: https://unruffled-hoover-de9320.netlify.app/?path=/story/displays-card--with-cover
// テーブルにする？
// TODO: RAWデータとの切り替えをできるようにする
// TODO: 関数が入っている場合はRAWデータ固定にする。オブジェクトの表示もきれいにできるやつ作る
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

  return (
    <VStack divider={<Divider />} gap={1}>
      {Object.entries(styles).map(([key, value]) => (
        <RecursiveRow
          key={key}
          name={key}
          value={value}
          onChangeTheme={onChangeTheme}
        />
      ))}
    </VStack>
  )
}

export const DefaultPropsBlock: FC<DefaultPropsBlockProps> = ({
  theme,
  colorSchemes,
  onChangeTheme,
}) => {
  const defaultProps = theme["defaultProps"]
  const variants = theme["variants"]
  const sizes = theme["sizes"]

  const variantItems: RadioItem[] =
    variants !== undefined
      ? Object.keys(variants).map((value) => ({
          label: value,
          value: value,
        }))
      : []

  const sizeItems: RadioItem[] =
    sizes !== undefined
      ? Object.keys(sizes).map((value) => ({
          label: value,
          value: value,
        }))
      : []

  const colorSchemeItems: RadioItem[] =
    colorSchemes !== undefined
      ? colorSchemes.map((value) => ({
          label: value,
          value: value,
        }))
      : []

  return (
    <VStack divider={<Divider />} gap={1}>
      <HStack alignItems="flex-start" justifyContent="space-between">
        <Text>variant</Text>

        <RadioGroup
          w="60%"
          items={variantItems}
          defaultValue={defaultProps?.variant as string | undefined}
          onChange={(value) => {
            onChangeTheme({ variant: value })
          }}
        />
      </HStack>

      <HStack alignItems="flex-start" justifyContent="space-between">
        <Text>size</Text>

        <RadioGroup
          w="60%"
          items={sizeItems}
          defaultValue={defaultProps?.size as string | undefined}
          onChange={(value) => {
            onChangeTheme({ size: value })
          }}
        />
      </HStack>

      <HStack alignItems="flex-start" justifyContent="space-between">
        <Text>colorScheme</Text>

        <RadioGroup
          w="60%"
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
