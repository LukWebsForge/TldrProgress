import { useContext } from 'react'
import { Tooltip } from '@geist-ui/react'
import { Moon, Sun } from '@geist-ui/react-icons'
import { ThemeTypeContext } from './ThemeType'

const IconActionTheme = (props: { side?: boolean }) => {
  const { themeType, setThemeType } = useContext(ThemeTypeContext)

  const placement = props.side ? 'left' : 'top'
  const icon =
    themeType === 'light' ? (
      <Moon className="cursor-pointer" size={28} onClick={() => setThemeType('dark')} />
    ) : (
      <Sun className="cursor-pointer" size={28} onClick={() => setThemeType('light')} />
    )

  return (
    <Tooltip text="Change theme" placement={placement} enterDelay={0}>
      {icon}
    </Tooltip>
  )
}

export { IconActionTheme }
