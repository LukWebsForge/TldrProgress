import { ReactElement, createContext, useEffect, useState, PropsWithChildren } from 'react'

// https://reactjs.org/docs/faq-ajax.html
// https://reactjs.org/docs/hooks-reference.html#usecontext

enum TranslationStatus {
  Outdated = 1,
  Translated = 2,
}

type OperatingSystem = string
type Language = string
type PageName = string

interface TranslationData {
  last_update: string
  languages: Language[]
  entries: Record<OperatingSystem, TranslationOS>
}

interface TranslationOS {
  progress: Record<Language, number>
  pages: Record<PageName, TranslationPage>
}

interface TranslationPage {
  status: Record<Language, TranslationStatus>
}

const DataContext = createContext<{
  data: TranslationData | null
  error: string | null
  highlighted: Set<Language>
  setHighlighted: (languages: Language[]) => void
}>({ data: null, error: null, highlighted: new Set(), setHighlighted: () => {} })

const DataFetcher = (props: PropsWithChildren<{ error: ReactElement; loading: ReactElement }>) => {
  const [error, setError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [data, setData] = useState<TranslationData | null>(null)
  const [highlighted, setHighlighted] = useState<Set<Language>>(new Set())
  const webStorageHighlightsKey = 'language-highlighted'

  // Fetch the data.json file
  useEffect(() => {
    fetch('data.json')
      .then(async (r) => {
        if (!r.ok) {
          throw new Error(r.status + ': ' + r.statusText)
        }

        return r.json()
      })
      .then(
        (result) => {
          setData(result as TranslationData)
          setIsLoaded(true)
        },
        (error) => {
          setError(error.toString())
          setIsLoaded(true)
        }
      )
  }, [])
  // [] = only run on component mount

  // Fetch the user preferences using the Web Storage API
  useEffect(() => {
    const stored = localStorage.getItem(webStorageHighlightsKey)
    if (stored) {
      setHighlighted(new Set(JSON.parse(stored)))
    }
  }, [])

  const setHighlightedExternal = (languages: Language[]) => {
    // Convert the array to a set for better performance and broadcast the change
    // See: https://stackoverflow.com/a/57277566/4106848
    setHighlighted(new Set(languages))
    // Persists the user selection of highlighted columns
    localStorage.setItem(webStorageHighlightsKey, JSON.stringify(Array.from(languages)))
  }

  if (error) {
    const provided = {
      data: null,
      error: error,
      highlighted: new Set<Language>(),
      setHighlighted: () => {},
    }
    return <DataContext.Provider value={provided}>{props.error}</DataContext.Provider>
  }

  if (!isLoaded) {
    return props.loading
  }

  const provided = {
    data: data,
    error: null,
    highlighted: highlighted,
    setHighlighted: setHighlightedExternal,
  }
  return <DataContext.Provider value={provided}>{props.children}</DataContext.Provider>
}

export { DataFetcher, DataContext, TranslationStatus }
export type { TranslationData, OperatingSystem, Language, PageName }
