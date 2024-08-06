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
  value: any
  isNested?: boolean
}

const RecursiveObject: FC<RecursiveObjectProps> = ({
  value,
  isNested = true,
}) => {
  if (isObject(value)) {
    return (
      <List ml={isNested ? "md" : "none"} gap={0}>
        {Object.entries(value).map(([key, value]) => (
          <ListItem key={key}>
            <VStack gap={0}>
              <Text>{`${key} : {`}</Text>
              <RecursiveObject value={value} />
              <Text>{`}`}</Text>
            </VStack>
          </ListItem>
        ))}
      </List>
    )
  } else {
    return (
      <Editable
        ml={isNested ? "md" : "none"}
        size="sm"
        defaultValue={value.toString()}
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
    )
  }
}

const StyleTable: FC<RecursiveRowProps> = ({
  name,
  value,
  // parentTree,
  // onChangeTheme,
}) => {
  return (
    <Tr>
      <Td>{name}</Td>
      <Td>
        <RecursiveObject value={value} isNested={false} />
      </Td>
    </Tr>
  )

  //TODO: remove this
  // if (isObject(value) && !isFunction(value)) {
  //   return (
  //     <Tr>
  //       <Td alignContent="center">{name}</Td>

  //       {Object.entries(value).map(([key, value]) => (
  //         <StyleTable
  //           key={key}
  //           parentTree={parentTree ? [...parentTree, name] : [name]}
  //           name={key}
  //           value={value}
  //           onChangeTheme={onChangeTheme}
  //         />
  //       ))}
  //     </Tr>
  //   )
  // } else {
  //   return (
  //     <Tr>
  //       <Td alignContent="center">{name}</Td>

  //       <Td>
  //         <Editable
  //           defaultValue={value.toString()}
  //           onChange={(value) => {
  //             const createObject = (parentTree: string[]): Dict =>
  //               parentTree.reduceRight(
  //                 (acc, key) => ({ [key]: acc }),
  //                 value as unknown as Dict,
  //               )

  //             const updatedTheme = createObject(
  //               parentTree ? [...parentTree, name] : [name],
  //             )
  //             onChangeTheme(updatedTheme)
  //           }}
  //         >
  //           <EditablePreview />
  //           <EditableInput />
  //         </Editable>
  //       </Td>
  //     </Tr>
  //   )
  // }
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
            <StyleTable
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
