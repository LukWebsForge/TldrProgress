import { CssBaseline, GeistProvider, Page, Text } from '@geist-ui/react'
import { ThemeTypeProvider, useThemeType } from './ThemeType'
import { DataFetcher } from './Data'
import { DataTable } from './Table'
import { AppLoader } from './AppLoader'
import { ErrorMessage } from './ErrorMessage'
import { AppFooter } from './AppFooter'
import { IconActions } from './IconActions'
import 'inter-ui/inter.css'
import './App.css'

const App = () => (
  <ThemeTypeProvider>
    <GeistApp />
  </ThemeTypeProvider>
)

const GeistApp = () => {
  const themeType = useThemeType()

  return (
    <GeistProvider themeType={themeType}>
      <CssBaseline />
      <Page size="large" style={{ minHeight: '1px' }} className={themeType}>
        <Page.Header>
          <Text h1>tldr translation progress</Text>
        </Page.Header>
        <Page.Content>
          <DataFetcher loading={<AppLoader />} error={<ErrorMessage />}>
            <IconActions />
            <DataTable />
          </DataFetcher>
        </Page.Content>
        <Page.Footer style={{ position: 'static' }}>
          <AppFooter />
        </Page.Footer>
      </Page>
    </GeistProvider>
  )
}

export { App }
