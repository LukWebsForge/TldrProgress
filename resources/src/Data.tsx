import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
  useTransition,
} from 'react'

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
}>({
  data: null,
  error: null,
  highlighted: new Set(['en']),
  setHighlighted: () => {},
})

const DataFetcher = (
  props: PropsWithChildren<{ error: ReactElement; loading: ReactElement; selection: ReactElement }>,
) => {
  const [error, setError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [data, setData] = useState<TranslationData | null>(null)
  const [highlighted, setHighlighted] = useState<Set<Language>>(new Set(['en']))
  const [isPending, startTransition] = useTransition()
  const webStorageHighlightedKey = 'language-highlighted'

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
          startTransition(() => {
            setData(result as TranslationData)
            setIsLoaded(true)
          })
        },
        (error) => {
          startTransition(() => {
            setError(error.toString())
            setIsLoaded(true)
          })
        },
      )
  }, [])
  // [] = only run on component mount

  // Fetch the user preferences using the Web Storage API
  useEffect(() => {
    const stored = localStorage.getItem(webStorageHighlightedKey)
    if (stored) {
      const languages: Set<string> = new Set(JSON.parse(stored))
      languages.add('en')
      startTransition(() => setHighlighted(new Set(languages)))
    }
  }, [])

  const setHighlightedExternal = (languages: Language[]) => {
    // Convert the array to a set for better performance and broadcast the change
    // See: https://stackoverflow.com/a/57277566/4106848
    startTransition(() => setHighlighted(new Set(languages)))
    // Persist the user selection of highlighted columns
    localStorage.setItem(webStorageHighlightedKey, JSON.stringify(Array.from(languages)))
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

  if (!isLoaded || isPending) {
    return props.loading
  }

  const provided = {
    data: data,
    error: null,
    highlighted: highlighted,
    setHighlighted: setHighlightedExternal,
  }
  return (
    <DataContext.Provider value={provided}>
      {highlighted.size < 2 ? props.selection : props.children}
    </DataContext.Provider>
  )
}

export { DataFetcher, DataContext, TranslationStatus }
export type { TranslationData, OperatingSystem, Language, PageName }
