enum FileAction {
  View,
  Create,
}

function tldrPageUrl(action: FileAction, os: string, page: string, language: string) {
  const languageSuffix = language === 'en' ? '' : '.' + language

  const baseUrl = 'https://github.com/tldr-pages/tldr'
  const filePath = `/main/pages${languageSuffix}/${os}/${page}.md`

  if (action === FileAction.Create) {
    return baseUrl + '/new' + filePath + `?filename=${page}.md`
  }

  if (action === FileAction.View) {
    return baseUrl + '/blob' + filePath
  }

  throw new Error('Unknown FileAction: ' + action)
}

export { FileAction, tldrPageUrl }
