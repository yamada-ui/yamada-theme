import {
  Dict,
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  Spacer,
  Text,
  UIStyle,
} from "@yamada-ui/react"
import { FC } from "react"

export type ThemeBlockProps = {
  styles?: UIStyle
  onChangeTheme: (theme: Dict) => void
}

export const ThemeBlock: FC<ThemeBlockProps> = ({ styles, onChangeTheme }) => {
  if (styles === undefined) return

  return Object.entries(styles).map(([key, value]) => {
    return (
      <HStack key={key}>
        <Text>{key}</Text>

        <Spacer />

        <Editable
          defaultValue={value.toString()}
          onChange={(value) => onChangeTheme({ [key]: value })}
        >
          <EditablePreview />
          <EditableInput />
        </Editable>
      </HStack>
    )
  })
}
