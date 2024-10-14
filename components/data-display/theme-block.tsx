import type {
  ComponentMultiStyle,
  ComponentStyle,
  RadioItem,
  UIStyle,
} from "@yamada-ui/react"
import type { FC } from "react"
import type { SubmitHandler } from "react-hook-form"
import { Eye, EyeOff, Plus } from "@yamada-ui/lucide"
import {
  Box,
  Button,
  Collapse,
  FormControl,
  HStack,
  IconButton,
  Input,
  isFunction,
  isObject,
  isUndefined,
  List,
  ListItem,
  NativeTable,
  RadioGroup,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Tfoot,
  Th,
  Thead,
  Tr,
  useBoolean,
  VStack,
} from "@yamada-ui/react"
import { EditableField } from "components/forms"
import { ThemeCommandMenu } from "components/overlay"
import { Controller, useForm } from "react-hook-form"
import { stringToUIStyle } from "utils/object"

// NOTE: https://unruffled-hoover-de9320.netlify.app/?path=/story/displays-card--with-cover
export type OnChangeTheme = (keyTree: string[], value: any) => void
export type OnRemoveTheme = (keyTree: string[]) => void

interface RecursiveObjectItemProps {
  name: string
  keyTree: string[]
  value: any
  onChangeTheme: OnChangeTheme
  onRemoveTheme: OnRemoveTheme
}

const RecursiveObjectItem: FC<RecursiveObjectItemProps> = ({
  name,
  keyTree,
  value,
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
            <List gap={0} pl="md">
              {Object.entries(value).map(([key, value]) => (
                <RecursiveObjectItem
                  key={key}
                  name={key}
                  keyTree={keyTree.length ? [...keyTree, key] : [key]}
                  value={value}
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
          keyTree={keyTree}
          value={value}
          onChangeTheme={onChangeTheme}
          onRemoveTheme={onRemoveTheme}
        >
          <HStack gap={0}>
            <Text>{`${name} : `}</Text>

            <EditableField
              keyTree={keyTree}
              value={value}
              onChangeTheme={onChangeTheme}
            />
          </HStack>
        </ThemeCommandMenu>
      )}
    </ListItem>
  )
}

interface TableRowProps {
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
  const isFunc = isFunction(value)
  const isObj = isObject(value)
  const isUndef = isUndefined(value)

  const strictRaw = isFunc || isUndef

  const [isOpenCollapse, { toggle: toggleCollapse }] = useBoolean(true)
  const [isRaw, { toggle: toggleRaw }] = useBoolean(strictRaw)

  return (
    <Tr>
      <Td onClick={() => toggleCollapse()}>{name}</Td>

      <Td>
        <HStack alignItems="flex-start" justifyContent="space-between">
          {isRaw || strictRaw ? (
            <Textarea
              autosize
              defaultValue={
                isFunc ? value.toString() : JSON.stringify(value, null, 4)
              }
              onChange={(valueProp) =>
                onChangeTheme([name], stringToUIStyle(valueProp.target.value))
              }
            />
          ) : (
            <Box>
              {isObj ? (
                <VStack gap={0}>
                  <Text>{`{`}</Text>

                  <Collapse isOpen={isOpenCollapse} unmountOnExit>
                    <List gap={0} pl="md">
                      {Object.entries(value).map(([key, value]) => (
                        <RecursiveObjectItem
                          key={key}
                          name={key}
                          keyTree={[name, key]}
                          value={value}
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
                  keyTree={[name]}
                  value={value}
                  onChangeTheme={onChangeTheme}
                />
              )}
            </Box>
          )}

          <Button
            colorScheme="gray"
            size="xs"
            variant="ghost"
            disabled={strictRaw}
            leftIcon={isRaw || strictRaw ? <EyeOff /> : <Eye />}
            onClick={() => toggleRaw()}
          >
            Raw
          </Button>
        </HStack>
      </Td>
    </Tr>
  )
}

export interface ThemeBlockProps {
  onChangeTheme: OnChangeTheme
  onRemoveTheme: OnRemoveTheme
  styles?: UIStyle
}

interface TableItem {
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
                render={({ field, fieldState }) => (
                  <FormControl isInvalid={fieldState.invalid}>
                    <Input {...field} id="name" placeholder="name" />
                  </FormControl>
                )}
                rules={validationRules.name}
              />
            </Th>
            <Th>
              <HStack>
                <Controller
                  name="control"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl isInvalid={fieldState.invalid}>
                      <Input {...field} id="control" placeholder="control" />
                    </FormControl>
                  )}
                  rules={validationRules.control}
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

export interface DefaultPropsBlockProps {
  colorSchemes: string[]
  theme: ComponentMultiStyle | ComponentStyle
  onChangeTheme: OnChangeTheme
}

export const DefaultPropsBlock: FC<DefaultPropsBlockProps> = ({
  colorSchemes,
  theme,
  onChangeTheme,
}) => {
  const defaultProps = theme.defaultProps
  const variants = theme.variants
  const sizes = theme.sizes

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

  const colorSchemeItems: RadioItem[] = colorSchemes.map((value) => ({
    label: value,
    value: value,
  }))

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
                defaultValue={defaultProps?.variant as string | undefined}
                items={variantItems}
                w="60%"
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
                defaultValue={defaultProps?.size as string | undefined}
                items={sizeItems}
                w="60%"
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
                defaultValue={defaultProps?.colorScheme as string | undefined}
                items={colorSchemeItems}
                w="60%"
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
