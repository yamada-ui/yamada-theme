import {
  Dict,
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  isObject,
  Spacer,
  Text,
  UIStyle,
  VStack,
} from "@yamada-ui/react"
import { FC } from "react"

export type ThemeBlockProps = {
  styles?: UIStyle
  onChangeTheme: (theme: Dict) => void
}

type RecursiveRowProps = {
  parentTree?: string[]
  onChangeTheme: (theme: Dict) => void
  name: string
  value: any
}

//TODO: ((props: UIStyleProps) => CSSUIObject)の型にも対応する必要がある
const RecursiveRow: FC<RecursiveRowProps> = ({
  parentTree,
  name,
  value,
  onChangeTheme,
}) => {
  if (isObject(value)) {
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
