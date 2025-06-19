import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'

enum ThemeType {
  Light = 'light',
  Dark = 'dark',
}

const ThemeTypeContext = createContext<{
  themeType: ThemeType
  setThemeType: (themeType: ThemeType) => void
}>({
  themeType: ThemeType.Light,
  setThemeType: () => {},
})

const ThemeTypeProvider = (props: PropsWithChildren<object>) => {
  const [themeType, setThemeType] = useState(ThemeType.Light)
  const webStorageThemeTypeKey = 'theme-type'

  // Fetch the user preference using the Web Storage API or determine the system theme
  useEffect(() => {
    const stored = localStorage.getItem(webStorageThemeTypeKey)
    if (stored === ThemeType.Light || stored === ThemeType.Dark) {
      setThemeType(stored)
    } else if (window && typeof window.matchMedia === 'function') {
      // Inspired by: https://github.com/xcv58/use-system-theme/blob/master/src/index.tsx
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setThemeType(isDark ? ThemeType.Dark : ThemeType.Light)
    }
  }, [])

  const setPersistentThemeType = (themeType: ThemeType) => {
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

export { ThemeType, ThemeTypeContext, ThemeTypeProvider, useThemeType }
