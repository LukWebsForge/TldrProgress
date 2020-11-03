package main

import (
	"log"
	"os"
	"strings"
	"time"
	"tldr-translation-progress/lib/git"
	"tldr-translation-progress/lib/html"
	"tldr-translation-progress/lib/tldr"
)

const TldrDir = "tldr"
const UpstreamDir = "upstream"

const KeyPath = "keys/id_rsa"
const TldrGitUrl = "git@github.com:tldr-pages/tldr.git"

func main() {
	keyPassword := env("SSH_KEY_PASSWORD", true)
	gitName := env("GIT_NAME", false)
	gitEmail := env("GIT_EMAIL", false)
	siteUrl := env("SITE_REMOTE_URL", false)
	_, dontPublish := os.LookupEnv("DONT_PUBLISH")

	if _, err := os.Stat(KeyPath); os.IsNotExist(err) {
		err := git.CreateSSHKey(KeyPath, keyPassword)
		if err != nil {
			log.Fatalln(err)
		}
		log.Println("New ssh keys were generated, please add them and run the program again")
		return
	}
	log.Println("SSH Keys exists")

	tldrGit, err := git.NewTldrGit(gitName, gitEmail, KeyPath, keyPassword)
	if err != nil {
		log.Fatalln(err)
	}
	log.Println("Git configuration is correct")

	err = tldrGit.CloneOrUpdate(TldrGitUrl, TldrDir)
	if err != nil {
		log.Fatalln(err)
	}
	log.Println("tldr repository updated")

	index, err := tldr.MapTldr(TldrDir)
	if err != nil {
		log.Fatalln(err)
	}
	log.Println("Scanned the tldr files")

	err = tldrGit.CloneOrUpdate(siteUrl, UpstreamDir)
	if err != nil {
		log.Fatalln(err)
	}
	log.Println("Site repository updated")

	err = html.GenerateHtml(index, UpstreamDir)
	if err != nil {
		log.Fatalln(err)
	}
	log.Println("Files for website created")

	if dontPublish {
		log.Println("Won't publish the changes, because DONT_PUBLISH is set")
		return
	}

	// Note: All files in the directory will be added and committed (except those ignored by a .gitignore)
	date := time.Now().Format("2nd of Jan 2006")
	err = tldrGit.CommitAll(UpstreamDir, "Daily update - "+date)
	if err != nil {
		log.Fatalln(err)
	}
	log.Println("Changes committed")

	err = tldrGit.Push(UpstreamDir, siteUrl)
	if err != nil {
		log.Fatalln(err)
	}
	log.Println("Changes published")

	log.Println("Successful")
}

// Gets a value for an environment variable with the given key.
// If defaultEmpty is true, then an empty string is returned when variable doesn't exists,
// else the program terminates if the environment variable is not set.
func env(key string, defaultEmpty bool) string {
	value, ok := os.LookupEnv(key)
	if !ok {
		if defaultEmpty {
			return ""
		}
		log.Fatalf("Please set the environment variable %v\n", key)
	} else if strings.TrimSpace(value) == "" {
		if defaultEmpty {
			return ""
		}
		log.Fatalf("The environment variable %v is set, but empty\n", key)
	}

	return value
}
