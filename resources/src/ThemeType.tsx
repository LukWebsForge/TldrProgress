import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'

const ThemeTypeContext = createContext<{
  themeType: string
  setThemeType: (themeType: string) => void
}>({
  themeType: 'light',
  setThemeType: () => {},
})

const ThemeTypeProvider = (props: PropsWithChildren<{}>) => {
  const [themeType, setThemeType] = useState('light')
  const webStorageThemeTypeKey = 'theme-type'

  // Fetch the user preference using the Web Storage API or determine the system theme
  useEffect(() => {
    const stored = localStorage.getItem(webStorageThemeTypeKey)
    if (stored === 'light' || stored === 'dark') {
      setThemeType(stored)
    } else if (window && typeof window.matchMedia === 'function') {
      // Inspired by: https://github.com/xcv58/use-system-theme/blob/master/src/index.tsx
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setThemeType(isDark ? 'dark' : 'light')
    }
  }, [])

  const setPersistentThemeType = (themeType: string) => {
    setThemeType(themeType)
    localStorage.setItem(webStorageThemeTypeKey, themeType)
  }

  return (
    <ThemeTypeContext.Provider value={{ themeType, setThemeType: setPersistentThemeType }}>
      {props.children}
    </ThemeTypeContext.Provider>
  )
}

const useThemeType = () => {
  const { themeType } = useContext(ThemeTypeContext)
  return themeType
}

export { ThemeTypeContext, ThemeTypeProvider, useThemeType }
