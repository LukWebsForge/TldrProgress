package main

import (
	"github.com/robfig/cron/v3"
	"log"
	"os"
	"strings"
	"time"
	"tldr-translation-progress/lib/git"
	"tldr-translation-progress/lib/tldr"
	"tldr-translation-progress/resources"
)

const TldrDir = "tldr"
const UpstreamDir = "upstream"

const KeyPath = "keys/id_rsa"
const TldrGitUrl = "git@github.com:tldr-pages/tldr.git"

var quit = make(chan struct{})

func main() {
	createSSHKey()

	// If the environment variable START_NOW is set, the update function is executed immediately
	if _, runNow := os.LookupEnv("START_NOW"); runNow {
		log.Println("Because START_NOW is set, a update is executed now")
		update()
	}

	c := cron.New(cron.WithChain(cron.Recover(cron.DefaultLogger)))

	// Executing the update function every day at 2am (local time)
	_, err := c.AddFunc("0 2 * * *", update)
	if err != nil {
		log.Printf("Failed to add the cron task: %v", err)
	} else {
		log.Println("Added the cron task for each day at 02am")
	}
	c.Start()

	// Blocking the main thread for an infinite amount of time
	// To stop the program you can close the channel using close(quit)
	<-quit
}

// Creates SSH keys if they don't exist
func createSSHKey() {
	keyPassword := env("SSH_KEY_PASSWORD", true)

	if _, err := os.Stat(KeyPath); os.IsNotExist(err) {
		publicKey, err1 := git.CreateSSHKey(KeyPath, keyPassword)
		if err1 != nil {
			log.Fatalln(err1)
		}
		log.Printf("A new SSH key was generated, please add it to a GitHub account\n%v", publicKey)
	} else {
		log.Println("Using the existing SSH key")
	}
}

func update() {
	keyPassword := env("SSH_KEY_PASSWORD", true)
	gitName := env("GIT_NAME", false)
	gitEmail := env("GIT_EMAIL", false)
	siteUrl := env("SITE_REMOTE_URL", false)
	_, dontPublish := os.LookupEnv("DONT_PUBLISH")

	tldrGit, err := git.NewTldrGit(gitName, gitEmail, KeyPath, keyPassword)
	if err != nil {
		log.Println(err)
		return
	}
	log.Println("Git configuration is correct")

	err = tldrGit.CloneOrUpdate(TldrGitUrl, TldrDir)
	if err != nil {
		log.Println(err)
		return
	}
	log.Println("tldr repository updated")

	index, err := tldr.MapTldr(TldrDir)
	if err != nil {
		log.Println(err)
		return
	}
	log.Println("Scanned the tldr files")

	err = tldrGit.CloneOrUpdate(siteUrl, UpstreamDir)
	if err != nil {
		log.Println(err)
		return
	}
	log.Println("Site repository updated")

	err = resources.WriteTo(UpstreamDir)
	if err != nil {
		log.Println(err)
		return
	}
	log.Println("Files for website copied")

	if dontPublish {
		log.Println("Won't publish the changes, because DONT_PUBLISH is set")
		return
	}

	// Note: All files in the directory will be added and committed (except those ignored by a .gitignore)
	date := time.Now().Format("2 January 2006")
	err = tldrGit.CommitAll(UpstreamDir, "Daily update - "+date)
	if err != nil {
		log.Println(err)
		return
	}
	log.Println("Changes committed")

	err = tldrGit.Push(UpstreamDir, siteUrl)
	if err != nil {
		log.Println(err)
		return
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
