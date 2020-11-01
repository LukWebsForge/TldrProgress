package tldr

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"sync"
)

const (
	StatusTranslated    = iota
	StatusOutdated      = iota
	StatusNoTranslation = iota
)

const DefaultLanguage = "en"

// [os][name][lang] = page
type IndexMap map[Os]map[Name]map[Lang]Page

// [os][name][lang] = status
type StatusMap map[Os]map[Name]map[Lang]StatusEnum

// [os] = []string
type OrderedNameMap map[Os][]Name

// [os][lang] = float64
type ProgressMap map[Os]map[Lang]float64

type Os string
type Name string
type Lang string
type StatusEnum int

type Page struct {
	Name     Name
	Os       Os
	Language Lang
	Examples int
}

type Index struct {
	Pages     []Page
	Index     IndexMap
	Status    StatusMap
	Names     OrderedNameMap
	Progress  ProgressMap
	Languages []Lang
	Os        []Os
}

func MapTldr(basePath string) (*Index, error) {
	sep := string(os.PathSeparator)
	matches, err := filepath.Glob(basePath + sep + "pages*" + sep + "*" + sep + "*.md")
	if err != nil {
		return nil, err
	}

	pages := make([]Page, len(matches))
	anError := false
	wg := sync.WaitGroup{}
	wg.Add(len(matches))

	// Keeping the slice in sync: https://stackoverflow.com/a/18499708/4106848
	for i, match := range matches {
		go func(match string, basePath string, i int) {
			defer wg.Done()
			page, err := mapFile(match, basePath)
			if err != nil {
				log.Printf("can't index file %v: %v", match, err)
				anError = true
			} else {
				pages[i] = *page
			}
		}(match, basePath, i)
	}

	wg.Wait()

	if anError {
		newPages := make([]Page, 0, len(matches))
		for _, page := range pages {
			if pages != nil {
				newPages = append(newPages, page)
			}
		}
		pages = newPages
	}

	return generateIndex(pages), nil
}

func mapFile(path string, basePath string) (*Page, error) {
	rel, err := filepath.Rel(basePath, path)
	if err != nil {
		return nil, fmt.Errorf("unable to compute relative path: %v", err)
	}

	slash := filepath.ToSlash(rel)
	split := strings.Split(slash, "/")
	if len(split) < 3 {
		return nil, fmt.Errorf("relative path should yield at least three parts (only %v): %v", len(split), rel)
	}

	name := strings.TrimSuffix(split[2], ".md")
	lang := strings.TrimPrefix(split[0], "pages.")
	if split[0] == "pages" {
		lang = "en"
	}

	file, err := os.OpenFile(path, os.O_RDONLY, 0640)
	if err != nil {
		return nil, fmt.Errorf("unable to open the file: %v", err)
	}
	defer file.Close()

	examples := 0
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		if strings.HasPrefix(strings.TrimSpace(scanner.Text()), "-") {
			examples++
		}
	}

	return &Page{
		Name:     Name(name),
		Os:       Os(split[1]),
		Language: Lang(lang),
		Examples: examples,
	}, nil
}

func generateIndex(pages []Page) *Index {
	languages := make([]Lang, 0, 10)
	oses := make([]Os, 0, 10)

	index := make(IndexMap)
	for _, page := range pages {
		// Adding to the slices
		languages = appendIfMissingLang(languages, page.Language)
		oses = appendIfMissingOs(oses, page.Os)

		// Generating the index
		_, ok := index[page.Os]
		if !ok {
			index[page.Os] = make(map[Name]map[Lang]Page)
		}
		_, ok = index[page.Os][page.Name]
		if !ok {
			index[page.Os][page.Name] = make(map[Lang]Page)
		}
		index[page.Os][page.Name][page.Language] = page
	}

	// Sorting the slices
	defaultIndex := 0
	for i, lang := range languages {
		if lang == DefaultLanguage {
			defaultIndex = i
			break
		}
	}
	languages[0], languages[defaultIndex] = languages[defaultIndex], languages[0]
	sortLang(languages[1:])

	sort.Slice(languages, func(i, j int) bool {
		if languages[i] == DefaultLanguage {
			return true
		} else if languages[j] == DefaultLanguage {
			return false
		}
		return strings.Compare(string(languages[i]), string(languages[j])) < 0
	})
	sortOs(oses)

	// Generating the status
	status := make(StatusMap)
	for _, oss := range oses {
		status[oss] = make(map[Name]map[Lang]StatusEnum)
		for name, langMap := range index[oss] {
			status[oss][name] = make(map[Lang]StatusEnum)

			defaultExamples := 0
			if pageEn, ok := langMap[DefaultLanguage]; ok {
				defaultExamples = pageEn.Examples
			}

			for _, lang := range languages {
				page, ok := langMap[lang]
				status[oss][name][lang] = statusForLanguage(ok, &page, defaultExamples)
			}
		}
	}

	// Sorting the names of pages
	names := make(OrderedNameMap)
	for oss, pageMap := range index {
		lst := make([]Name, len(pageMap))

		i := 0
		for name := range pageMap {
			lst[i] = name
			i++
		}

		sortNames(lst)

		names[oss] = lst
	}

	// Checking the progress
	progress := make(ProgressMap)
	for oss, pageMap := range status {
		counterAll := make(map[Lang]int)
		counterOk := make(map[Lang]int)

		for _, langMap := range pageMap {
			for lang, status := range langMap {
				if status != StatusNoTranslation {
					incrementOrOne(counterOk, lang)
				}
				incrementOrOne(counterAll, lang)
			}
		}

		progress[oss] = make(map[Lang]float64)
		for _, lang := range languages {
			ca, okA := counterAll[lang]
			co, okO := counterOk[lang]
			p := 0.0
			if okA && okO {
				p = float64(co) / float64(ca)
			}
			progress[oss][lang] = p
		}
	}

	return &Index{
		Pages:     pages,
		Index:     index,
		Status:    status,
		Names:     names,
		Progress:  progress,
		Languages: languages,
		Os:        oses,
	}
}

func statusForLanguage(pageExists bool, page *Page, defaultExamples int) StatusEnum {
	if !pageExists {
		return StatusNoTranslation
	}

	if defaultExamples == 0 {
		return StatusTranslated
	}

	if page.Examples == defaultExamples {
		return StatusTranslated
	} else {
		return StatusOutdated
	}
}

func incrementOrOne(m map[Lang]int, l Lang) {
	count, ok := m[l]
	if !ok {
		m[l] = 1
	} else {
		m[l] = count + 1
	}
}

func appendIfMissingLang(slice []Lang, elm Lang) []Lang {
	for _, s := range slice {
		if s == elm {
			return slice
		}
	}
	return append(slice, elm)
}

func appendIfMissingOs(slice []Os, elm Os) []Os {
	for _, s := range slice {
		if s == elm {
			return slice
		}
	}
	return append(slice, elm)
}

func sortNames(slices []Name) {
	sort.Slice(slices, func(i, j int) bool {
		return string(slices[i]) < string(slices[j])
	})
}

func sortOs(slice []Os) {
	sort.Slice(slice, func(i, j int) bool {
		return string(slice[i]) < string(slice[j])
	})
}

func sortLang(slice []Lang) {
	sort.Slice(slice, func(i, j int) bool {
		return string(slice[i]) < string(slice[j])
	})
}
