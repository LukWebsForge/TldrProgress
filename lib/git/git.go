package git

import (
	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/config"
	"github.com/go-git/go-git/v5/plumbing/object"
	"github.com/go-git/go-git/v5/plumbing/transport/ssh"
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

func NewTldrGit(name string, email string, sshKeyPath string, sshKeyPassword string) (*TldrGit, error) {
	publicKey, err := ssh.NewPublicKeysFromFile("git", sshKeyPath, sshKeyPassword)
	if err != nil {
		return nil, err
	}
	return &TldrGit{
		name:      name,
		email:     email,
		publicKey: publicKey,
	}, nil
}

func (g *TldrGit) CloneOrUpdate(url string, path string) error {
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		return g.Clone(url, path)
	} else {
		err = g.Pull(path)
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

func (g *TldrGit) Pull(path string) error {
	repository, err := git.PlainOpen(path)
	if err != nil {
		return err
	}

	worktree, err := repository.Worktree()
	if err != nil {
		return err
	}

	err = worktree.Pull(&git.PullOptions{
		Auth: g.publicKey,
	})
	if git.NoErrAlreadyUpToDate == err {
		return nil
	} else {
		return err
	}
}

func (g *TldrGit) CommitAll(path string, message string) error {
	repository, err := git.PlainOpen(path)
	if err != nil {
		return err
	}

	worktree, err := repository.Worktree()
	if err != nil {
		return err
	}

	err = worktree.AddGlob(".")
	if err != nil {
		return err
	}

	_, err = worktree.Commit(message, &git.CommitOptions{
		Author: &object.Signature{
			Name:  g.name,
			Email: g.email,
			When:  time.Now(),
		},
	})

	return err
}

func (g *TldrGit) Push(path string, origin string) error {
	repository, err := git.PlainOpen(path)
	if err != nil {
		return err
	}

	_, err = repository.Remote(DefaultRemoteName)
	if err == git.ErrRemoteNotFound {
		_, err = repository.CreateRemote(&config.RemoteConfig{
			Name: DefaultRemoteName,
			URLs: []string{origin},
		})
		if err != nil {
			return err
		}
	} else if err != nil {
		return err
	}

	err = repository.Fetch(&git.FetchOptions{Auth: g.publicKey})
	if err != git.NoErrAlreadyUpToDate && err != nil {
		return err
	}

	err = repository.Push(&git.PushOptions{
		RemoteName: DefaultRemoteName,
		Auth:       g.publicKey,
	})
	if err == git.NoErrAlreadyUpToDate && err != nil {
		return err
	}

	return nil
}
