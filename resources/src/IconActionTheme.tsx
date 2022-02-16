import { useContext } from 'react'
import { Tooltip } from '@geist-ui/core'
import { Moon, Sun } from '@geist-ui/icons'
import { ThemeType, ThemeTypeContext } from './ThemeType'

const IconActionTheme = (props: { side?: boolean }) => {
  const { themeType, setThemeType } = useContext(ThemeTypeContext)

  const placement = props.side ? 'left' : 'top'
  const icon =
    themeType === ThemeType.Light ? (
      <Moon className="cursor-pointer" size={28} onClick={() => setThemeType(ThemeType.Dark)} />
    ) : (
      <Sun className="cursor-pointer" size={28} onClick={() => setThemeType(ThemeType.Light)} />
    )

  return (
    <Tooltip text="Change theme" placement={placement} enterDelay={0}>
      {icon}
    </Tooltip>
  )
}

export { IconActionTheme }
