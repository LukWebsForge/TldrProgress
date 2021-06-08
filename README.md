# tldr translation progress

Generates and publishes a website, which shows the progress of translation of the 
[tldr](https://github.com/tldr-pages/tldr/) project.

This project is inspired by
* [Extension Registration Wall of Superpowers](https://extreg-wos.toolforge.org/)
* [Python 3 Wall of Superpowers](http://python3wos.appspot.com/)

## Building

### Docker

If you've got [Docker](https://www.docker.com/) on your system, you need nothing else to build and run this project.

```shell script
docker build -t ghcr.io/lukwebsforge/tldrprogress:1 .
```

### Local installation

To build this project without Docker, you'll need the task runner Task and a Go SDK (>= 1.16).

The build instructions are defined in the [`Taskfile.yml`](Taskfile.yml). 
Install [Task](https://taskfile.dev/#/installation) and run
```shell script
task build
```

## Configuration

You can configure certain details using environment variables.

| Environment variable | Description                                  | Required |
| ---                  | ---                                          | ---      |
| GIT_NAME             | The committers name                          | Yes      |
| GIT_EMAIL            | The committers email                         | Yes      |
| SITE_REMOTE_URL      | The Git SSH url of the deployment repository | Yes      |
| CHECK_KNOWN_HOSTS    | Checks the known_hosts file when connecting  | No       |
| SSH_KEY_PASSWORD     | A password for the SSH key                   | No       |
| DONT_PUBLISH         | No changes will be committed & pushed        | No       |
| RUN_ONCE             | Instantly updates & quits                    | No       |

You can either let the program generate a new SSH key pair, or you can use your own even if a password is required.
This application doesn't support HTTP authentication.

The SSH key pair `id_rsa` and `id_rsa.pub` in the folder `keys` will be used to access the tldr repository and 
publish changes to the deployment repository (`SITE_REMOTE_URL`). 
If the key pair is missing, it'll be generated during the startup of the application.
The generated public key `id_rsa.pub` will be printed to the console.
I recommend adding the public key as a deployment key (with writing access) for the deployment repository.

Each day at midnight (UTC) the program will execute the update.
This includes the steps of cloning / updating the tldr repository in the folder `tldr` and 
generating the static asset files and copying them to the `upstream` folder.
Finally, changes in this folder will be committed and pushed to the upstream repository.

If you want to test your changes, I recommend you set the environment variables `DONT_PUBLISH` and `RUN_ONCE` 
and view the updated website locally before deploying it.
The value of this environment variable doesn't matter, it just has be set.

## Run

### Docker

You can simply start a container which runs this program.
The program will start the repository update at midnight (UTC) each day.

```shell script
# Create a docker container with name tldrprogress, which will always restart (system reboot, error)
docker run -d --restart=always --name=tldrprogress \
 -e GIT_NAME=LukWebBuilder -e GIT_EMAIL=gitbuilder@lukweb.de \
 -e SITE_REMOTE_URL=git@github.com:LukWebsForge/tldri18n.git \
 lukwebsforge/tldrprogress:latest
# Optional: Take a look at the logs to view the new public SSH key
docker logs tldrprogress
```

### systemd

The program runs permanently, and start the repository update at midnight (UTC) each day.
This repository contains a systemd configuration file, which can be used to keep it running.

If you want to use the systemd unit file
1. Create a user named `tldr`
2. Put the executable at the path `/home/tldr/progress/update`
3. Copy the files from the [`systemd`](systemd) folder into `/etc/systemd/system/`
4. Finally, run
```shell script
# Load the new systemd unit file
systemctl daemon-reload
# Start the program on every system startup
systemctl enable tldrprogress.service
# Start the program now
sudo systemctl start tldrprogress.service
# Optional: View generated the public SSH key
cat /home/tldr/progress/keys/id_rsa.pub
```

## Contributing

If you spot a bug or got an idea for an improvement, free welcome to open a new issue or create a pull request.

### Development tips

#### Working on the Go application

It's useful to set the environment variables `DONT_PUBLISH` and `RUN_ONCE` to any value (e.g. `true`).

Even, if you don't want to push anything, don't forget to add the public SSH key to a GitHub account or as a deployment key.
Otherwise, GitHub repositories can't be cloned or updated.

#### Working on the React website

Run the Go application once to generate a `data.json` file.
Copy this file to the `resources/public` folder.
Now you can use HMR by starting the development web server with `yarn run start`.

#### Testing the application as a whole

Run the compiled artifact and start a local webserver by using `npx serve upstream` to inspect the generated website.
