import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  FormControl,
  forwardRef,
  HStack,
  Input,
  isArray,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@yamada-ui/react"
import { memo } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { OnChangeTheme, OnRemoveTheme } from "components/data-display"
import { useI18n } from "contexts/i18n-context"

export type ThemeCommandMenuProps = {
  value: any
  keyTree: string[]
  onChangeTheme: OnChangeTheme
  onRemoveTheme: OnRemoveTheme
}

type ThemeItem = {
  name: string
  control: string
}

export const ThemeCommandMenu = memo(
  forwardRef<ThemeCommandMenuProps, "div">(
    ({ value, keyTree, onChangeTheme, onRemoveTheme, children }, ref) => {
      const { t } = useI18n()
      const { isOpen, onOpen, onClose } = useDisclosure()

      const parentKeyTree = keyTree.slice(0, -1)
      const isArrayValue = isArray(value)

      const { control, handleSubmit, reset } = useForm<ThemeItem>({
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

      const onSubmit: SubmitHandler<ThemeItem> = ({
        name,
        control,
      }: ThemeItem) => {
        onChangeTheme(parentKeyTree, { [name]: control })

        onClose()
        reset()
      }

      return (
        <>
          <ContextMenu>
            <ContextMenuTrigger ref={ref}>{children}</ContextMenuTrigger>

            <MenuList>
              <MenuItem
                onClick={() => {
                  if (isArrayValue) onChangeTheme(keyTree, "")
                  else onChangeTheme(keyTree, [])
                }}
              >
                {isArrayValue
                  ? t("component.theme-command-menu.change-to-value")
                  : t("component.theme-command-menu.change-to-list")}
              </MenuItem>
              <MenuItem onClick={onOpen}>
                {t("component.theme-command-menu.add")}
              </MenuItem>
              <MenuDivider />
              <MenuItem
                color="red.500"
                onClick={() => {
                  onRemoveTheme(keyTree)
                }}
              >
                {t("component.theme-command-menu.remove")}
              </MenuItem>
            </MenuList>
          </ContextMenu>

          <Modal
            isOpen={isOpen}
            onClose={onClose}
            as="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <ModalHeader>
              {t("component.theme-command-menu-modal.header")}
            </ModalHeader>

            <ModalBody>
              <HStack>
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
              </HStack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="primary" type="submit">
                {t("component.theme-command-menu-modal.submit")}
              </Button>
            </ModalFooter>
          </Modal>
        </>
      )
    },
  ),
)
