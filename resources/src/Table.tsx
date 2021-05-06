import * as React from "react";
import {DataContext, OperatingSystem, TranslationStatus} from "./Data";
import {FileAction, tldrPageUrl} from "./GitHubPage";
import './Table.css';

const DataTable = () =>
    <table className="text-center">
        <DataTableHeader/>
        <DataTableBody/>
    </table>;

const DataTableHeader = () => {
    const {data} = React.useContext(DataContext);

    // We're applying the sticky class to each <th>, because Chrome does not support sticky on <thead> and <tr>
    // https://bugs.chromium.org/p/chromium/issues/detail?id=702927
    const languageRows = data?.languages.map((lang) => {
        let classNames = 'sticky vertical-padding';
        if (lang.length > 3) classNames += ' small-font';

        return <th className={classNames} key={lang}>{lang}</th>
    });

    return <thead>
    <tr>
        <th className="sticky vertical-padding">page</th>
        {languageRows}
    </tr>
    </thead>
}

const DataTableBody = () => {
    const {data} = React.useContext(DataContext);

    const osSections = Object.keys(data!.entries).map((os) =>
        <React.Fragment key={os}>
            <DataTableOSHeader os={os}/>
            <DataTableOSPages os={os}/>
        </React.Fragment>
    );

    return <tbody>{osSections}</tbody>
}

const DataTableOSHeader = (props: { os: OperatingSystem }) => {
    const {data} = React.useContext(DataContext);
    const osProgress = data!.entries[props.os].progress;

    const percentages = data!.languages.map((lang) =>
        <td className="vertical-padding small-font" key={lang}>{osProgress[lang]}%</td>);

    return <tr className="background-blue">
        <th className="vertical-padding" id={props.os}>{props.os}</th>
        {percentages}
    </tr>
}

const DataTableOSPages = (props: { os: OperatingSystem }) => {
    const {data} = React.useContext(DataContext);
    const osPages = data!.entries[props.os].pages;

    const pages = Object.keys(osPages)
        .map((page) => <DataTableOSPageRow os={props.os} pageName={page} key={page}/>);

    return <>{pages}</>;
}

const DataTableOSPageRow = (props: { os: OperatingSystem, pageName: string }) => {
    const {data} = React.useContext(DataContext);
    const pageData = data!.entries[props.os].pages[props.pageName];

    function handleClick(action: FileAction, language: string) {
        const win = window.open(tldrPageUrl(action, props.os, props.pageName, language));
        if (win != null)
            win.focus();
    }

    // Pick symbols from: https://rsms.me/inter/#charset
    const cells = data!.languages.map((lang) => {
        if (lang in pageData.status) {
            const status = pageData.status[lang];
            switch (status) {
                case TranslationStatus.Translated:
                    return <td className="background-green cursor-pointer" key={lang}
                               onClick={() => handleClick(FileAction.VIEW, lang)}>✓</td>
                case TranslationStatus.Outdated:
                    return <td className="background-yellow cursor-pointer" key={lang}
                               onClick={() => handleClick(FileAction.VIEW, lang)}>◇</td>
                default:
                    return <td>?</td>
            }
        } else {
            return <td className="background-red cursor-pointer" key={lang}
                       onClick={() => handleClick(FileAction.CREATE, lang)}>✗</td>
        }
    });

    return <tr>
        <td className="text-left">{props.pageName}</td>
        {cells}
    </tr>
}

export {DataTable};
