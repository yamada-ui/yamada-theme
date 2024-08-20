import {
  ContextMenu,
  ContextMenuTrigger,
  forwardRef,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@yamada-ui/react"
import { memo } from "react"
import { OnChangeTheme, OnRemoveTheme } from "components/data-display"
import { useI18n } from "contexts/i18n-context"

export type ThemeCommandMenuProps = {
  keyTree: string[]
  onChangeTheme: OnChangeTheme
  onRemoveTheme: OnRemoveTheme
}

export const ThemeCommandMenu = memo(
  forwardRef<ThemeCommandMenuProps, "div">(
    ({ keyTree, onRemoveTheme, children }, ref) => {
      const { t } = useI18n()

      return (
        <ContextMenu>
          <ContextMenuTrigger ref={ref}>{children}</ContextMenuTrigger>

          <MenuList>
            <MenuItem>
              {t("component.theme-command-menu.change-to-list")}
            </MenuItem>
            <MenuItem>{t("component.theme-command-menu.add")}</MenuItem>
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
      )
    },
  ),
)
