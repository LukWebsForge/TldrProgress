const http = require('https')
const fs = require('fs')

// Inspiration: https://stackoverflow.com/a/17676794/4106848

const destination = 'public/data.json'
const url = 'https://raw.githubusercontent.com/LukWebsForge/tldri18n/main/data.json'

const file = fs.createWriteStream(destination)
http
  .get(url, (response) => {
    response.pipe(file)
    file.on('finish', () => {
      file.close()
      console.log(destination + ' was downloaded successfully')
    })
  })
  .on('error', (err) => {
    console.log('Error while downloading ' + destination + ': ' + err)
  })
