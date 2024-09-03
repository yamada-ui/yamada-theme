import { Eye, EyeOff, Plus } from "@yamada-ui/lucide"
import type {
  ComponentMultiStyle,
  ComponentStyle,
  RadioItem,
  UIStyle,
} from "@yamada-ui/react"
import {
  isObject,
  List,
  ListItem,
  NativeTable,
  RadioGroup,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  VStack,
  HStack,
  useBoolean,
  Collapse,
  Button,
  Textarea,
  isFunction,
  FormControl,
  Input,
  Tfoot,
  IconButton,
} from "@yamada-ui/react"
import type { FC } from "react"
import type { SubmitHandler } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { EditableField } from "components/forms"
import { ThemeCommandMenu } from "components/overlay"

// NOTE: https://unruffled-hoover-de9320.netlify.app/?path=/story/displays-card--with-cover
// TODO: 項目の追加機能
export type OnChangeTheme = (keyTree: string[], value: any) => void
export type OnRemoveTheme = (keyTree: string[]) => void

type RecursiveObjectItemProps = {
  name: string
  value: any
  keyTree: string[]
  onChangeTheme: OnChangeTheme
  onRemoveTheme: OnRemoveTheme
}

const RecursiveObjectItem: FC<RecursiveObjectItemProps> = ({
  name,
  value,
  keyTree,
  onChangeTheme,
  onRemoveTheme,
}) => {
  const [isOpen, { toggle }] = useBoolean(true)

  return (
    <ListItem>
      {isObject(value) ? (
        <VStack gap={0}>
          <Text onClick={() => toggle()}>{`${name} : {`}</Text>

          <Collapse isOpen={isOpen} unmountOnExit>
            <List pl="md" gap={0}>
              {Object.entries(value).map(([key, value]) => (
                <RecursiveObjectItem
                  key={key}
                  name={key}
                  value={value}
                  keyTree={keyTree ? [...keyTree, key] : [key]}
                  onChangeTheme={onChangeTheme}
                  onRemoveTheme={onRemoveTheme}
                />
              ))}
            </List>
          </Collapse>

          <Text>{`}`}</Text>
        </VStack>
      ) : (
        <ThemeCommandMenu
          value={value}
          keyTree={keyTree}
          onChangeTheme={onChangeTheme}
          onRemoveTheme={onRemoveTheme}
        >
          <HStack gap={0}>
            <Text>{`${name} : `}</Text>

            <EditableField
              value={value}
              keyTree={keyTree}
              onChangeTheme={onChangeTheme}
            />
          </HStack>
        </ThemeCommandMenu>
      )}
    </ListItem>
  )
}

type TableRowProps = {
  name: string
  value: any
  onChangeTheme: OnChangeTheme
  onRemoveTheme: OnRemoveTheme
}

const TableRow: FC<TableRowProps> = ({
  name,
  value,
  onChangeTheme,
  onRemoveTheme,
}) => {
  const [isOpenCollapse, { toggle: toggleCollapse }] = useBoolean(true)
  const [isRaw, { toggle: toggleRaw }] = useBoolean(false)

  const isFunc = isFunction(value)
  const isObj = isObject(value)

  return (
    <Tr>
      <Td onClick={() => toggleCollapse()}>{name}</Td>

      <Td>
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
                  // TODO: parseのエラー処理。React Hook Form使う？
                  console.error("Error parsing JSON:", error)
                }
              }}
            />
          ) : (
            <>
              {isObj ? (
                <VStack gap={0}>
                  <Text>{`{`}</Text>

                  <Collapse isOpen={isOpenCollapse} unmountOnExit>
                    <List pl="md" gap={0}>
                      {Object.entries(value).map(([key, value]) => (
                        <RecursiveObjectItem
                          key={key}
                          name={key}
                          value={value}
                          keyTree={[name, key]}
                          onChangeTheme={onChangeTheme}
                          onRemoveTheme={onRemoveTheme}
                        />
                      ))}
                    </List>
                  </Collapse>

                  <Text>{`}`}</Text>
                </VStack>
              ) : (
                <EditableField
                  value={value}
                  keyTree={[name]}
                  onChangeTheme={onChangeTheme}
                />
              )}
            </>
          )}

          <Button
            variant="ghost"
            colorScheme="gray"
            size="xs"
            leftIcon={isRaw || isFunc ? <EyeOff /> : <Eye />}
            onClick={() => toggleRaw()}
          >
            Raw
          </Button>
        </HStack>
      </Td>
    </Tr>
  )
}

export type ThemeBlockProps = {
  styles?: UIStyle
  onChangeTheme: OnChangeTheme
  onRemoveTheme: OnRemoveTheme
}

type TableItem = {
  name: string
  control: string
}

export const ThemeBlock: FC<ThemeBlockProps> = ({
  styles,
  onChangeTheme,
  onRemoveTheme,
}) => {
  const { control, handleSubmit, reset } = useForm<TableItem>({
    defaultValues: {
      name: "",
      control: "",
    },
  })

  const validationRules = {
    name: {
      required: true,
    },
    control: {
      required: true,
    },
  }

  const onSubmit: SubmitHandler<TableItem> = ({ name, control }: TableItem) => {
    onChangeTheme([], { [name]: control })

    reset()
  }

  if (styles === undefined) return

  return (
    <TableContainer>
      <NativeTable>
        <Thead>
          <Tr>
            <Th>name</Th>
            <Th>control</Th>
          </Tr>
        </Thead>

        <Tbody>
          {Object.entries(styles).map(([key, value]) => (
            <TableRow
              key={key}
              name={key}
              value={value}
              onChangeTheme={onChangeTheme}
              onRemoveTheme={onRemoveTheme}
            />
          ))}
        </Tbody>

        <Tfoot>
          <Tr>
            <Th>
              <Controller
                name="name"
                control={control}
                rules={validationRules.name}
                render={({ field, fieldState }) => (
                  <FormControl isInvalid={fieldState.invalid}>
                    <Input {...field} id="name" placeholder="name" />
                  </FormControl>
                )}
              />
            </Th>
            <Th>
              <HStack>
                <Controller
                  name="control"
                  control={control}
                  rules={validationRules.control}
                  render={({ field, fieldState }) => (
                    <FormControl isInvalid={fieldState.invalid}>
                      <Input {...field} id="control" placeholder="control" />
                    </FormControl>
                  )}
                />

                <IconButton
                  variant="ghost"
                  icon={<Plus />}
                  onClick={handleSubmit(onSubmit)}
                />
              </HStack>
            </Th>
          </Tr>
        </Tfoot>
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
            <Th>name</Th>
            <Th>control</Th>
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
