module.exports = {
    // https://tailwindcss.com/docs/controlling-file-size
    purge: {
        mode: 'layers',
        layers: ['base', 'components', 'utilities'],
        content: [
            '../lib/html/body.go',
            '../lib/html/jumplist.go',
            '../lib/html/table.go'
        ]
    },
    theme: {},
    variants: {},
    plugins: [],
}
