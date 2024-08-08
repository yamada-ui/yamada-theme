import { Eye, EyeOff } from "@yamada-ui/lucide"
import {
  ComponentMultiStyle,
  ComponentStyle,
  Editable,
  EditableInput,
  EditablePreview,
  isObject,
  List,
  ListItem,
  NativeTable,
  RadioGroup,
  RadioItem,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  UIStyle,
  Text,
  VStack,
  HStack,
  useBoolean,
  Collapse,
  isArray,
  Button,
  Textarea,
  isFunction,
} from "@yamada-ui/react"
import { FC } from "react"

// NOTE: https://unruffled-hoover-de9320.netlify.app/?path=/story/displays-card--with-cover
// TODO: 項目の追加機能
type OnChangeTheme = (keyTree: string[], value: any) => void

type EditableFieldProps = {
  value: any
  keyTree: string[]
  onChangeTheme: OnChangeTheme
}

const EditableField: FC<EditableFieldProps> = ({
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
        width="3xs"
        ml="sm"
        defaultValue={value.toString()}
        onChange={(value) => onChangeTheme(keyTree, value)}
      >
        <EditablePreview />
        <EditableInput />
      </Editable>
    )
  }
}

type RecursiveObjectItemProps = {
  name: string
  value: any
  keyTree: string[]
  onChangeTheme: OnChangeTheme
}

const RecursiveObjectItem: FC<RecursiveObjectItemProps> = ({
  name,
  value,
  keyTree,
  onChangeTheme,
}) => {
  const [isOpen, { toggle }] = useBoolean(true)

  return (
    <ListItem>
      {isObject(value) ? (
        <VStack gap={0}>
          <Text onClick={() => toggle()}>{`${name} : {`}</Text>

          <Collapse isOpen={isOpen} unmountOnExit>
            <List pl="md" gap={0} borderLeftWidth="1px">
              {Object.entries(value).map(([key, value]) => (
                <RecursiveObjectItem
                  key={key}
                  name={key}
                  value={value}
                  keyTree={keyTree ? [...keyTree, key] : [key]}
                  onChangeTheme={onChangeTheme}
                />
              ))}
            </List>
          </Collapse>

          <Text>{`}`}</Text>
        </VStack>
      ) : (
        <HStack gap={0}>
          <Text>{`${name} : `}</Text>

          <EditableField
            value={value}
            keyTree={keyTree}
            onChangeTheme={onChangeTheme}
          />
        </HStack>
      )}
    </ListItem>
  )
}

type TableRowProps = {
  name: string
  value: any
  onChangeTheme: OnChangeTheme
}

const TableRow: FC<TableRowProps> = ({ name, value, onChangeTheme }) => {
  const [isOpenCollapse, { toggle: toggleCollapse }] = useBoolean(true)
  const [isRaw, { toggle: toggleRaw }] = useBoolean(false)

  const isFunc = isFunction(value)
  const isObj = isObject(value)

  return (
    <Tr>
      <Td onClick={() => toggleCollapse()}>{name}</Td>

      <Td>
        {isObj || isFunc ? (
          <HStack alignItems="flex-start" justifyContent="space-between">
            {isRaw || isFunc ? (
              <Textarea
                autosize
                defaultValue={
                  isFunc ? value.toString() : JSON.stringify(value, null, 4)
                }
                onChange={(value) => {
                  try {
                    onChangeTheme([name], JSON.parse(value.target.value))
                  } catch (error) {
                    // TODO: parseのエラー処理
                  }
                }}
              />
            ) : (
              <VStack gap={0}>
                <Text>{`{`}</Text>

                <Collapse isOpen={isOpenCollapse} unmountOnExit>
                  <List pl="md" gap={0} borderLeftWidth="1px">
                    {Object.entries(value).map(([key, value]) => (
                      <RecursiveObjectItem
                        key={key}
                        name={key}
                        value={value}
                        keyTree={[name, key]}
                        onChangeTheme={onChangeTheme}
                      />
                    ))}
                  </List>
                </Collapse>

                <Text>{`}`}</Text>
              </VStack>
            )}

            <Button
              variant="text"
              size="xs"
              leftIcon={isRaw || isFunc ? <EyeOff /> : <Eye />}
              onClick={() => toggleRaw()}
            >
              Raw
            </Button>
          </HStack>
        ) : (
          <EditableField
            value={value}
            keyTree={[name]}
            onChangeTheme={onChangeTheme}
          />
        )}
      </Td>
    </Tr>
  )
}

export type ThemeBlockProps = {
  styles?: UIStyle
  onChangeTheme: OnChangeTheme
}

export const ThemeBlock: FC<ThemeBlockProps> = ({ styles, onChangeTheme }) => {
  if (styles === undefined) return

  return (
    <TableContainer>
      <NativeTable>
        <Thead>
          <Tr>
            <Th>style</Th>
            <Th>value</Th>
          </Tr>
        </Thead>

        <Tbody>
          {Object.entries(styles).map(([key, value]) => (
            <TableRow
              key={key}
              name={key}
              value={value}
              onChangeTheme={onChangeTheme}
            />
          ))}
        </Tbody>
      </NativeTable>
    </TableContainer>
  )
}

export type DefaultPropsBlockProps = {
  theme: ComponentStyle | ComponentMultiStyle
  colorSchemes: string[]
  onChangeTheme: OnChangeTheme
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
    <TableContainer>
      <NativeTable>
        <Thead>
          <Tr>
            <Th>style</Th>
            <Th>value</Th>
          </Tr>
        </Thead>

        <Tbody>
          <Tr>
            <Td>variant</Td>

            <Td>
              <RadioGroup
                w="60%"
                items={variantItems}
                defaultValue={defaultProps?.variant as string | undefined}
                onChange={(value) => {
                  onChangeTheme(["variant"], value)
                }}
              />
            </Td>
          </Tr>
          <Tr>
            <Td>size</Td>

            <Td>
              <RadioGroup
                w="60%"
                items={sizeItems}
                defaultValue={defaultProps?.size as string | undefined}
                onChange={(value) => {
                  onChangeTheme(["size"], value)
                }}
              />
            </Td>
          </Tr>
          <Tr>
            <Td>colorScheme</Td>

            <Td>
              <RadioGroup
                w="60%"
                items={colorSchemeItems}
                defaultValue={defaultProps?.colorScheme as string | undefined}
                onChange={(value) => {
                  onChangeTheme(["colorScheme"], value)
                }}
              />
            </Td>
          </Tr>
        </Tbody>
      </NativeTable>
    </TableContainer>
  )
}
