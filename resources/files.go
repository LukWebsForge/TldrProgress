package resources

import (
	"embed"
	"io/fs"
	"os"
	"path/filepath"
)

const defaultFileMask = 0740
const baseFSDir = "build"
const staticDir = "static"

//go:embed build
var f embed.FS

// Writes all static asset files from the 'resources/build' folder (now in the binary) to the given folder
func WriteTo(ospath string) error {

	// Removes the 'static' directory to prevent old hashed asset files from piling up
	staticDirPath := filepath.Join(ospath, staticDir)
	if _, err := os.Stat(staticDirPath); !os.IsNotExist(err) {
		err := os.RemoveAll(staticDirPath)
		if err != nil {
			return err
		}
	}

	// Copies all files from this binary to the disk
	return fs.WalkDir(f, baseFSDir, func(fspath string, d fs.DirEntry, err error) error {
		relPath, err := filepath.Rel(baseFSDir, filepath.FromSlash(fspath))
		fPath := filepath.Join(ospath, relPath)
		if err != nil {
			return err
		}

		if d.IsDir() {
			return os.MkdirAll(fPath, defaultFileMask)
		} else {
			bytes, err := f.ReadFile(fspath)
			if err != nil {
				return err
			}
			return os.WriteFile(fPath, bytes, defaultFileMask)
		}
	})
}
