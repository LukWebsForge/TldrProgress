package html

import (
	"github.com/tdewolff/minify/v2"
	"github.com/tdewolff/minify/v2/html"
	"io"
)

// Wraps a writer which minifies html data around the file writer and passes it to the function f
func minifyWhileWriting(file io.Writer, f func(w io.Writer) error) error {
	m := minify.New()
	m.AddFunc("text/html", html.Minify)
	w := m.Writer("text/html", file)

	err := f(w)
	if err != nil {
		return err
	}

	// It's important to close the minify writer in order to flush the data
	return w.Close()
}
