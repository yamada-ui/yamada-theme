import {
  ComponentMultiStyle,
  ComponentStyle,
  Dict,
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
// TODO: RAWデータとの切り替えをできるようにする
// TODO: 関数が入っている場合はRAWデータ固定にする。オブジェクトの表示もきれいにできるやつ作る
type RecursiveObjectProps = {
  name: string
  value: any
}

const RecursiveObject: FC<RecursiveObjectProps> = ({ name, value }) => {
  const [isOpen, { toggle }] = useBoolean(true)

  return (
    <ListItem>
      {isObject(value) ? (
        <VStack gap={0}>
          <Text onClick={() => toggle()}>{`${name} : {`}</Text>

          <Collapse isOpen={isOpen} unmountOnExit>
            <List ml="md" gap={0}>
              {Object.entries(value).map(([key, value]) => (
                <RecursiveObject key={key} name={key} value={value} />
              ))}
            </List>
          </Collapse>

          <Text>{`}`}</Text>
        </VStack>
      ) : (
        <HStack gap={0}>
          <Text>{`${name} : `}</Text>
          <Editable
            width="3xs"
            ml="sm"
            // TODO: リストとかだった場合にどう表示するか考える
            defaultValue={
              isArray(value) ? `[ ${value.toString()} ]` : value.toString()
            }
            // onChange={(value) => {
            //   const createObject = (parentTree: string[]): Dict =>
            //     parentTree.reduceRight(
            //       (acc, key) => ({ [key]: acc }),
            //       value as unknown as Dict,
            //     )

            //   const updatedTheme = createObject(
            //     parentTree ? [...parentTree, name] : [name],
            //   )
            //   onChangeTheme(updatedTheme)
            // }}
          >
            <EditablePreview />
            <EditableInput />
          </Editable>
        </HStack>
      )}
    </ListItem>
  )
}

const TableRow: FC<RecursiveRowProps> = ({
  name,
  value,
  // parentTree,
  // onChangeTheme,
}) => {
  const [isOpen, { toggle }] = useBoolean(true)

  return (
    <Tr>
      <Td onClick={() => toggle()}>{name}</Td>
      <Td>
        {isObject(value) ? (
          <VStack gap={0}>
            <Text>{`{`}</Text>

            <Collapse isOpen={isOpen} unmountOnExit>
              <List ml="md" gap={0}>
                {Object.entries(value).map(([key, value]) => (
                  <RecursiveObject key={key} name={key} value={value} />
                ))}
              </List>
            </Collapse>

            <Text>{`}`}</Text>
          </VStack>
        ) : (
          <Editable width="3xs" defaultValue={value.toString()}>
            <EditablePreview />
            <EditableInput />
          </Editable>
        )}
      </Td>
    </Tr>
  )
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
                  onChangeTheme({ variant: value })
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
                  onChangeTheme({ size: value })
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
                  onChangeTheme({ colorScheme: value })
                }}
              />
            </Td>
          </Tr>
        </Tbody>
      </NativeTable>
    </TableContainer>
  )
}
