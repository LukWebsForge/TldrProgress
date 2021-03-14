package git

import (
	"fmt"
	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/config"
	"github.com/go-git/go-git/v5/plumbing/object"
	"github.com/go-git/go-git/v5/plumbing/transport/ssh"
	ssh2 "golang.org/x/crypto/ssh"
	"net"
	"os"
	"time"
)

const DefaultFileMask = 0740
const DefaultRemoteName = "origin"

type TldrGit struct {
	name      string
	email     string
	publicKey *ssh.PublicKeys
}

// Prepares git operations by loading the ssh key, checking the known_hosts file and settings the details of the author
func NewTldrGit(name string, email string, sshKeyPath string, sshKeyPassword string) (*TldrGit, error) {
	publicKey, err := ssh.NewPublicKeysFromFile("git", sshKeyPath, sshKeyPassword)
	if err != nil {
		return nil, err
	}

	// If CHECK_KNOWN_HOSTS is set, the ssh library of go-git tries to validate the remote ssh keys
	// by checking your local known_hosts file.
	if _, exists := os.LookupEnv("CHECK_KNOWN_HOSTS"); !exists {
		publicKey.HostKeyCallback = func(hostname string, remote net.Addr, key ssh2.PublicKey) error {
			// We're not checking the SSH key of remote, because it would be difficult to keep track of them.
			// Feel free to work on this problem, this might be useful:
			// https://pkg.go.dev/golang.org/x/crypto/ssh/knownhosts
			return nil
		}
	}

	return &TldrGit{
		name:      name,
		email:     email,
		publicKey: publicKey,
	}, nil
}

// If no git repository exists at the given path, the remote repository at the given url is cloned to the path.
// Else the existing repository will be updated by pulling the latest changes from the remote repository.
func (g *TldrGit) CloneOrUpdate(url string, path string) error {
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		return g.Clone(url, path)
	} else {
		err = g.Pull(url, path)
		if err == git.ErrRepositoryNotExists {
			err = os.RemoveAll(path)
			if err != nil {
				return err
			}
			return g.Clone(url, path)
		} else {
			return err
		}
	}
}

// Clones a remote git repository at the url into the given path, which will be created if needed
func (g *TldrGit) Clone(url string, path string) error {
	// Creates the directory for the repository
	err := os.MkdirAll(path, DefaultFileMask)
	if err != nil {
		return err
	}

	// Clones the repository into the given dir, just as a normal git clone does
	_, err = git.PlainClone(path, false, &git.CloneOptions{
		URL:  url,
		Auth: g.publicKey,
	})

	return err
}

// Pulls the latest changes of the remote repository into the git repository at the given path
func (g *TldrGit) Pull(url string, path string) error {
	repository, err := git.PlainOpen(path)
	if err != nil {
		return err
	}

	_, err = g.setupDefaultRemote(repository, url)
	if err != nil {
		return err
	}

	worktree, err := repository.Worktree()
	if err != nil {
		return err
	}

	pullOptions := &git.PullOptions{
		Auth: g.publicKey,
	}
	err = worktree.Pull(pullOptions)
	if git.NoErrAlreadyUpToDate == err {
		return nil
	} else if err == git.ErrNonFastForwardUpdate || err == git.ErrUnstagedChanges {
		// Trying to hard reset the repository to the HEAD & attempt to pull again
		head, err := repository.Head()
		if err != nil {
			return err
		}

		err = worktree.Reset(&git.ResetOptions{
			Commit: head.Hash(),
			Mode:   git.HardReset,
		})
		if err != nil {
			return err
		}

		err = worktree.Pull(pullOptions)
		if err != git.NoErrAlreadyUpToDate && err != nil {
			return fmt.Errorf("can't update the repository %v automatically, please try to fix it by hand: %v", path, err)
		}
	} else if err != nil {
		return fmt.Errorf("can't update the repository %v automatically, please try to fix it by hand: %v", path, err)
	}

	return nil
}

// Commits all changed files in the git repository at the path with the given commit message.
// Files ignored by a .gitignore won't be committed.
func (g *TldrGit) CommitAll(path string, message string) error {
	repository, err := git.PlainOpen(path)
	if err != nil {
		return err
	}

	worktree, err := repository.Worktree()
	if err != nil {
		return err
	}

	// Doesn't detect deleted files, just new ones: https://github.com/go-git/go-git/issues/113
	err = worktree.AddGlob(".")
	if err != nil {
		return err
	}

	_, err = worktree.Commit(message, &git.CommitOptions{
		// That's why we're requiring that the commit includes all (new, changed, deleted) files
		All: true,
		Author: &object.Signature{
			Name:  g.name,
			Email: g.email,
			When:  time.Now(),
		},
	})

	return err
}

// Pushes all local changes of a git repository at the path to the remote repository at the given origin url.
// If none remote exists, a remote with name DefaultRemoteName and the origin url will be created.
// If a remote exists, but its first url isn't equal to the origin url, this url will be overwritten.
func (g *TldrGit) Push(path string, origin string) error {
	repository, err := git.PlainOpen(path)
	if err != nil {
		return err
	}

	remote, err := g.setupDefaultRemote(repository, origin)
	if err != nil {
		return err
	}

	err = remote.Fetch(&git.FetchOptions{Auth: g.publicKey})
	if err != git.NoErrAlreadyUpToDate && err != nil {
		return err
	}

	err = remote.Push(&git.PushOptions{Auth: g.publicKey})
	if err != git.NoErrAlreadyUpToDate && err != nil {
		return err
	}

	return nil
}

// Checks if remote with the name DefaultRemoteName exists and has the correct url.
// If not, this method tries to fix these problems.
func (g *TldrGit) setupDefaultRemote(repository *git.Repository, url string) (*git.Remote, error) {
	resetRemote := false

	// Checking if the remote exists, if not creating it
	remote, err := repository.Remote(DefaultRemoteName)
	if err == git.ErrRemoteNotFound {
		resetRemote = true
	} else if err != nil {
		return nil, err
	} else {
		// Checking if the first url of the remote is correct
		urls := remote.Config().URLs
		if urls[0] != url {
			resetRemote = true
			// Sadly it isn't possible to change properties of a remote, so we have to delete it and recreate it
			err := repository.DeleteRemote(DefaultRemoteName)
			if err != nil {
				return nil, err
			}
		}
	}

	// Creates a new default remote (if needed)
	if resetRemote {
		_, err = repository.CreateRemote(&config.RemoteConfig{
			Name: DefaultRemoteName,
			URLs: []string{url},
		})
		if err != nil {
			return nil, err
		}
	}

	return remote, nil
}
