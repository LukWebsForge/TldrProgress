import { Fragment, useContext } from 'react'
import { DataContext, OperatingSystem, TranslationStatus } from './Data'
import { FileAction, tldrPageUrl } from './tldrPageUrl'
import './Table.css'

const DataTable = () => (
  <table className="text-center">
    <DataTableHeader />
    <DataTableBody />
  </table>
)

const DataTableHeader = () => {
  const { data } = useContext(DataContext)

  // We're applying the sticky class to each <th>, because Chrome does not support sticky on <thead> and <tr>
  // https://bugs.chromium.org/p/chromium/issues/detail?id=702927
  const languageRows = data?.languages.map((lang) => {
    let classNames = 'vertical-padding sticky bg-white-transparent'
    if (lang.length > 3) {
      classNames += ' small-font'
    }

    return (
      <th key={lang} className={classNames}>
        {lang}
      </th>
    )
  })

  return (
    <thead>
      <tr>
        <th className="vertical-padding bg-white-transparent">page</th>
        {languageRows}
      </tr>
    </thead>
  )
}

const DataTableBody = () => {
  const { data } = useContext(DataContext)

  const osSections = Object.keys(data!.entries).map((os) => (
    <Fragment key={os}>
      <DataTableOSHeader os={os} />
      <DataTableOSPages os={os} />
    </Fragment>
  ))

  return <tbody>{osSections}</tbody>
}

const DataTableOSHeader = (props: { os: OperatingSystem }) => {
  const { data } = useContext(DataContext)
  const osProgress = data!.entries[props.os].progress

  const percentages = data!.languages.map((lang) => (
    <td key={lang} className="vertical-padding small-font">
      {osProgress[lang]}%
    </td>
  ))

  return (
    <tr className="background-blue" id={props.os}>
      <th className="sticky bg-white-opaque zero-padding">
        <div className="vertical-padding background-blue">{props.os}</div>
      </th>
      {percentages}
    </tr>
  )
}

const DataTableOSPages = (props: { os: OperatingSystem }) => {
  const { data } = useContext(DataContext)
  const osPages = data!.entries[props.os].pages

  const pages = Object.keys(osPages).map((page) => (
    <DataTableOSPageRow key={page} os={props.os} pageName={page} />
  ))

  return <>{pages}</>
}

const DataTableOSPageRow = (props: { os: OperatingSystem; pageName: string }) => {
  const { data } = useContext(DataContext)
  const pageData = data!.entries[props.os].pages[props.pageName]

  function handleClick(action: FileAction, language: string) {
    const win = window.open(tldrPageUrl(action, props.os, props.pageName, language))
    if (win != null) {
      win.focus()
    }
  }

  // Pick symbols from: https://rsms.me/inter/#charset
  const cells = data!.languages.map((lang) => {
    if (lang in pageData.status) {
      const status = pageData.status[lang]
      switch (status) {
        case TranslationStatus.Translated:
          return (
            <td
              key={lang}
              className="background-green cursor-pointer"
              onClick={() => {
                handleClick(FileAction.VIEW, lang)
              }}
            >
              ✓
            </td>
          )
        case TranslationStatus.Outdated:
          return (
            <td
              key={lang}
              className="background-yellow cursor-pointer"
              onClick={() => {
                handleClick(FileAction.VIEW, lang)
              }}
            >
              ◇
            </td>
          )
        default:
          return <td>?</td>
      }
    } else {
      return (
        <td
          key={lang}
          className="background-red cursor-pointer"
          onClick={() => {
            handleClick(FileAction.CREATE, lang)
          }}
        >
          ✗
        </td>
      )
    }
  })

  return (
    <tr>
      <td className="text-left">{props.pageName}</td>
      {cells}
    </tr>
  )
}

export { DataTable }
