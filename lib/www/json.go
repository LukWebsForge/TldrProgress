package www

import (
	"encoding/json"
	"github.com/iancoleman/orderedmap"
	"os"
	"time"
	"tldr-translation-progress/lib/tldr"
)

const defaultFileMask = 0740

const (
	jsonStatusOutdated   = 1
	jsonStatusTranslated = 2
)

// Root of the json file
type ProgressJson struct {
	// human readable timestamp of the last update
	LastUpdate string `json:"last_update"`
	// sorted list of short language codes
	Languages []string `json:"languages"`
	// map[os]OperatingSystemJson
	Entries orderedmap.OrderedMap `json:"entries"`
}

// Section for every operating system
type OperatingSystemJson struct {
	// map[language]percentage
	Progress map[string]float64 `json:"progress"`
	// map[page]PageProgressJson
	Pages orderedmap.OrderedMap `json:"pages"`
}

// The translation status in different languages of a given page
type PageProgressJson struct {
	// map[language]{1 = outdated, 2 = translated}
	Status map[string]int `json:"status"`
}

// Writes a json file containing the progress information given by the index to the given path
func GenerateJson(index *tldr.Index, path string) error {
	// Storing the languages in order
	languages := make([]string, len(index.Languages))
	for i, language := range index.Languages {
		languages[i] = string(language)
	}

	entries := orderedmap.New()
	for _, oss := range index.Os {

		// Mapping the overall progress percentage for different languages into the map
		progress := make(map[string]float64)
		for _, language := range index.Languages {
			// Converting the percentage [0;1] to an integer [0;100]
			progress[string(language)] = (float64)((int)(index.Progress[oss][language] * 100))
		}

		// Mapping the data for every page into PageProgressJson structs
		pages := orderedmap.New()
		for _, name := range index.Names[oss] {
			status := make(map[string]int)

			for _, language := range index.Languages {
				// We don't create an entry for the StatusNotTranslated
				switch index.Status[oss][name][language] {
				case tldr.StatusOutdated:
					status[string(language)] = jsonStatusOutdated
				case tldr.StatusTranslated:
					status[string(language)] = jsonStatusTranslated
				default:

				}
			}

			pages.Set(string(name), PageProgressJson{Status: status})
		}

		entries.Set(string(oss), OperatingSystemJson{
			Progress: progress,
			Pages:    *pages,
		})
	}

	progress := ProgressJson{
		LastUpdate: time.Now().Format(time.RFC850),
		Languages:  languages,
		Entries:    *entries,
	}

	// We're indenting the json file to easily identify changes in Git commits
	bytes, err := json.MarshalIndent(progress, "", "\t")
	if err != nil {
		return err
	}

	_, err = os.Create(path)
	if err != nil {
		return err
	}

	return os.WriteFile(path, bytes, defaultFileMask)
}
