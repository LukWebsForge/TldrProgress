import {DataFetcher, ErrorMessageContext} from "./Data";
import {DataTable, Footer, JumpList} from "./Table";
import * as React from "react";

const App = () =>
    <div className="container mx-auto text-center">
        <h1 className="font-bold text-4xl m-10">tldr translation progress</h1>
        <DataFetcher loading={<Loading/>} error={<ErrorMessage/>}>
            <Legend/>
            <JumpList/>
            <DataTable/>
            <Footer/>
        </DataFetcher>
    </div>;

const Legend = () =>
    <div className="mt-2">
        <h3 className="text-2xl p-5">Legend</h3>
        <table className="border-collapse mx-auto">
            <tbody>
            <tr>
                <td className="border-b border-gray-400 px-4 py-2">✔</td>
                <td className="border-b border-gray-400 px-4 py-2">
                    translated & same number of entries as the english version
                </td>
            </tr>
            <tr>
                <td className="border-b border-gray-400 px-4 py-2">⚠</td>
                <td className="border-b border-gray-400 px-4 py-2">
                    not up-to-date (different number of entries than the english version)
                </td>
            </tr>
            <tr>
                <td className="px-4 py-2">✖</td>
                <td className="px-4 py-2">not translated</td>
            </tr>
            </tbody>
        </table>
    </div>;

const Loading = () =>
    <div className="text-3xl text-blue-400">
        Loading ...
    </div>;

const ErrorMessage = () => {
    const error = React.useContext(ErrorMessageContext);

    return (
        <div className="text-2xl text-red-400">
            Unable to load the data ): <br/>
            <div className="text-lg">{error}</div>
        </div>
    );
}

export {App}
