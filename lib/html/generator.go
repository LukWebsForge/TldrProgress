//+build ignore

// Learn more about go generate:
// * https://dev.to/koddr/the-easiest-way-to-embed-static-files-into-a-binary-file-in-your-golang-app-no-external-dependencies-43pc
// * https://blog.golang.org/generate

package main

import (
	"io/ioutil"
	"log"
	"os"
	"strings"
)

const (
	outputFile = "style.go"
	inputFile  = "../../resources/output.css"
)

// Generates the Go source file (outputFile), which contains the content of input file (inputFile)
// wrapped inside a single method (styleFromAssets) used to access the content of the input file.
// The file at the path inputFile should be a text file.
func main() {
	stat, err := os.Stat(inputFile)
	if os.IsNotExist(err) {
		log.Fatalln("Input file doesn't exist")
	}

	bytes, err := ioutil.ReadFile(inputFile)
	if err != nil {
		log.Fatalf("Error reading %v: %v\n", inputFile, err)
	}

	style := strings.ReplaceAll(string(bytes), "`", "'")
	content := "package html\n\nfunc styleFromAssets() string {\n return `" + style + "`}\n"

	err = ioutil.WriteFile(outputFile, []byte(content), stat.Mode().Perm())
	if err != nil {
		log.Fatalf("Error writing the file %v: %v\n", outputFile, err)
	}
}
