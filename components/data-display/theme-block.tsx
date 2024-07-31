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
} from "@yamada-ui/react"
import { FC } from "react"

export type ThemeBlockProps = {
  styles?: UIStyle
  onChangeTheme: (theme: Dict) => void
}

type RecursiveRowProps = {
  name: string
  value: any
}

//TODO: ((props: UIStyleProps) => CSSUIObject)の型にも対応する必要がある
const RecursiveRow: FC<RecursiveRowProps> = ({ name, value }) => {
  if (isObject(value)) {
    return Object.entries(value).map(([key, value]) => {
      return <RecursiveRow key={key} name={key} value={value} />
    })
  } else {
    return (
      <HStack key={name}>
        <Text>{name}</Text>

        <Spacer />

        <Editable
          defaultValue={value.toString()}
          //TODO: onchangeThemeを何とかする（再帰的にできるようにしたい）
          // onChange={(value) => onChangeTheme({ [key]: value })}
        >
          <EditablePreview />
          <EditableInput />
        </Editable>
      </HStack>
    )
  }
}

export const ThemeBlock: FC<ThemeBlockProps> = ({ styles }) => {
  if (styles === undefined) return

  return Object.entries(styles).map(([key, value]) => {
    return <RecursiveRow key={key} name={key} value={value} />
    // return (
    //   <HStack key={key}>
    //     <Text>{key}</Text>

    //     <Spacer />

    //     <Editable
    //       defaultValue={value.toString()}
    //       onChange={(value) => onChangeTheme({ [key]: value })}
    //     >
    //       <EditablePreview />
    //       <EditableInput />
    //     </Editable>
    //   </HStack>
    // )
  })
}
