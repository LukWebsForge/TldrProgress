import * as React from "react";

// https://reactjs.org/docs/faq-ajax.html
// https://reactjs.org/docs/hooks-reference.html#usecontext

enum TranslationStatus {
    Outdated = 1,
    Translated = 2,
}

type OperatingSystem = string;
type Language = string;
type PageName = string;

interface TranslationData {
    last_update: string,
    languages: Language[],
    entries: Record<OperatingSystem, TranslationOS>,
}

interface TranslationOS {
    progress: Record<Language, number>,
    pages: Record<PageName, TranslationPage>,
}

interface TranslationPage {
    status: Record<Language, TranslationStatus>,
}

const DataContext = React.createContext<{ data: TranslationData | null, error: string | null }>(
    {data: null, error: null});

// We're using React.ReactElement & React.ReactNode instead of JSX.Element: https://stackoverflow.com/a/47899926/4106848
type DataFetcherProps = { error: React.ReactElement, loading: React.ReactElement, children: React.ReactNode };
const DataFetcher = (props: DataFetcherProps) => {
    const [error, setError] = React.useState<string | null>(null);
    const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
    const [data, setData] = React.useState<TranslationData | null>(null);

    // [] = only run on component mount
    React.useEffect(() => {
        fetch("data.json")
            .then(r => {
                if (!r.ok)
                    throw new Error(r.status + ': ' + r.statusText);

                return r.json();
            })
            .then(
                (result) => {
                    setData(result as TranslationData);
                    setIsLoaded(true);
                },

                (error) => {
                    setError(error.toString());
                    setIsLoaded(true);
                });
    }, []);

    if (error) {
        return <DataContext.Provider value={{data: null, error: error}}>
            {props.error}
        </DataContext.Provider>
    } else if (!isLoaded) {
        return props.loading
    } else {
        return <DataContext.Provider value={{data: data, error: null}}>
            {props.children}
        </DataContext.Provider>
    }
}

export {DataFetcher, DataContext, TranslationStatus};
export type {OperatingSystem, Language, PageName};
