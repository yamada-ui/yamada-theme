import {
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  isArray,
  Text,
} from "@yamada-ui/react"
import { FC } from "react"
import { OnChangeTheme } from "components/data-display/theme-block"

type EditableFieldProps = {
  value: any
  keyTree: string[]
  onChangeTheme: OnChangeTheme
}

export const EditableField: FC<EditableFieldProps> = ({
  value,
  keyTree,
  onChangeTheme,
}) => {
  if (isArray(value)) {
    return (
      <HStack gap="sm">
        <Text>[</Text>

        <Editable
          width="5xs"
          textAlign="center"
          defaultValue={value[0]}
          onChange={(valueProp) =>
            onChangeTheme(keyTree, [valueProp, value[1]])
          }
        >
          <EditablePreview />
          <EditableInput />
        </Editable>

        <Text>:</Text>

        <Editable
          width="5xs"
          textAlign="center"
          defaultValue={value[1]}
          onChange={(valueProp) =>
            onChangeTheme(keyTree, [value[0], valueProp])
          }
        >
          <EditablePreview />
          <EditableInput />
        </Editable>

        <Text>]</Text>
      </HStack>
    )
  } else {
    return (
      <Editable
        minW="3xs"
        defaultValue={value.toString()}
        onChange={(value) => onChangeTheme(keyTree, value)}
      >
        <EditablePreview />
        <EditableInput />
      </Editable>
    )
  }
}
