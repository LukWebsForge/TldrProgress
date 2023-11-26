enum FileAction {
  View,
  Create,
}

function tldrPageUrl(action: FileAction, os: string, page: string, language: string) {
  const languageSuffix = language === 'en' ? '' : '.' + language

  const baseUrl = 'https://github.com/tldr-pages/tldr'
  const folderPath = `/main/pages${languageSuffix}/${os}`

  if (action === FileAction.Create) {
    return `${baseUrl}/new${folderPath}?filename=${page}.md`
  }

  if (action === FileAction.View) {
    return `${baseUrl}/blob${folderPath}/${page}.md`
  }

  throw new Error('Unknown FileAction: ' + action)
}

export { FileAction, tldrPageUrl }
