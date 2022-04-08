package git

import (
	"github.com/charmbracelet/keygen"
)

// CreateSSHKey generates an SSH key pair with the given password ("" = empty) and stores it as path and path.pub
// If successful it returns the public key as a string, otherwise returns an error
func CreateSSHKey(path string, password string) (string, error) {
	// Create a key pair with the keygen library: https://github.com/charmbracelet/keygen
	keyPair, err := keygen.NewWithWrite(path, []byte(password), keygen.Ed25519)
	if err != nil {
		return "", err
	}

	// Returns the public key as a string
	return string(keyPair.PublicKey()), nil
}
