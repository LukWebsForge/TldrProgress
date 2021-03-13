import React, {useEffect, useState} from "react";

// https://reactjs.org/docs/faq-ajax.html
// https://reactjs.org/docs/hooks-reference.html#usecontext

const DataContext = React.createContext(null);
const ErrorMessageContext = React.createContext(null);

const TranslationStatus = {
    Outdated: 1,
    Translated: 2
}

function DataFetcher(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [data, setData] = useState(null);

    // [] = only run on component mount
    useEffect(() => {
        fetch("data.json")
            .then(r => {
                if (!r.ok)
                    throw new Error(r.status + ': ' + r.statusText);

                return r.json();
            })
            .then(
                (result) => {
                    setData(result);
                    setIsLoaded(true);
                },

                (error) => {
                    setError(error.toString());
                    setIsLoaded(true);
                });
    }, []);

    if (error) {
        return <ErrorMessageContext.Provider value={error}>
            {props.error}
        </ErrorMessageContext.Provider>
    } else if (!isLoaded) {
        return props.loading
    } else {
        return <DataContext.Provider value={data}>
            {props.children}
        </DataContext.Provider>
    }
}

export {DataFetcher, DataContext, TranslationStatus, ErrorMessageContext};
