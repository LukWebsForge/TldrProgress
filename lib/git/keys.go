package git

import (
	"bytes"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"golang.org/x/crypto/ssh"
	"io/ioutil"
	"os"
	"path/filepath"
)

// Stolen from
// - https://stackoverflow.com/a/37316544/4106848
// - https://github.com/nanobox-io/golang-ssh/blob/master/key.go#L54

// Generates an ssh key pair with the given password ("" = empty) and stores it as path and path.pub
func CreateSSHKey(path string, password string) error {
	// Generate a key with the length of 4096 bits
	privateKey, err := rsa.GenerateKey(rand.Reader, 4096)
	if err != nil {
		return err
	}

	// Convert it to pem
	block := &pem.Block{
		Type:  "RSA PRIVATE KEY",
		Bytes: x509.MarshalPKCS1PrivateKey(privateKey),
	}

	// Encrypt the pem
	if password != "" {
		block, err = x509.EncryptPEMBlock(rand.Reader, block.Type, block.Bytes, []byte(password), x509.PEMCipherAES256)
		if err != nil {
			return err
		}
	}

	// Encode the private key
	var private bytes.Buffer
	if err := pem.Encode(&private, block); err != nil {
		return err
	}

	// Generate the public key
	pub, err := ssh.NewPublicKey(&privateKey.PublicKey)
	if err != nil {
		return err
	}

	public := ssh.MarshalAuthorizedKey(pub)

	// Save the private & public keys
	err = os.MkdirAll(filepath.Dir(path), DefaultFileMask)
	if err != nil {
		return err
	}
	err = ioutil.WriteFile(path, private.Bytes(), DefaultFileMask)
	if err != nil {
		return err
	}

	err = ioutil.WriteFile(path+".pub", public, DefaultFileMask)
	if err != nil {
		return err
	}

	return nil
}
