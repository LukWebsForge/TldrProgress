# tldr translation progress

Generates and publishes a website, which shows the progress of translation of the 
[tldr](https://github.com/tldr-pages/tldr/) project.

This project is inspired by
* [Extension Registration Wall of Superpowers](https://extreg-wos.toolforge.org/)
* [Python 3 Wall of Superpowers](http://python3wos.appspot.com/)

## Building

### Docker

If you've got [Docker](https://www.docker.com/) on your system you need nothing else to build and run this project.

```shell script
docker build -t lukwebsforge/tldrprogress:latest .
```

### Local installation

To build this project without Docker, you'll need Task and a GO SDK.

The build instructions are defined in the [`Taskfile.yml`](Taskfile.yml). 
Install [Task](https://taskfile.dev/#/installation) and run
```shell script
task build
```

By default, the css file is minimized (from ~2MB to 6KB), so it just contains the used classes, 
but if you want to tinker on this application, it might be useful to activate the development mode.
In this mode the css file won't be minimized.
```shell script
task build DEV=true
```

If you've already built the project and then activate the development mode it may not work.
Please append the `--force` switch to the task command to force a rebuild.

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
| MINIFY_HTML          | Minifies the output html file                | No       |
| START_NOW            | Executes the first update instantly          | No       |

You can either let the program generate a new SSH key pair, or you can use your own even if a password is required.
This application doesn't support HTTP authentication.

The program exits after its first run, if you don't use your own key pair.
A new SSH key pair will be generated at the folder `keys`.
Add the public key as a deployment key (with writing access) to the specified repository (`SITE_REMOTE_URL`).

If you specify the environment variable `MINIFY_HTML`, 
the size of the html output file will be reduced by removing spaces and new line characters. 
This is done by the library [tdewolff/minify](https://github.com/tdewolff/minify).
You can expect the file size to reduce by around 20 % (1.76 MB 🡒 1.38 MB).
The css file is minified during the JavaScript build process. 

In the next run the software will generate the status page in the `upstream` folder, commit the changes and push it. 

If you want to test your changes, I recommend you set the environment variables `DONT_PUBLISH` and `START_NOW` 
and view the updated website locally before deploying it.
The value of this environment variable doesn't matter, it just has be set.

## Run

### Docker

You can simply start a container which runs this program.
The program will start the repository update at 2am (local time) each day.

```shell script
docker run -d --restart=always --name=tldrprogress \
 -e GIT_NAME=LukWebBuilder -e GIT_EMAIL=gitbuilder@lukweb.de \
 -e SITE_REMOTE_URL=git@github.com:LukWebsForge/tldri18n.git \
 lukwebsforge/tldrprogress:latest
# Optional: Take a look at the logs to view the new public SSH key
docker logs tldrprogress
```

### systemd

The program runs permanently, and start the repository update at 2am (local time) each day.
This repository contains a systemd configuration file, which can be used to keep it running.

If you want to use the systemd unit file
1. Create a user named `tldr`
2. Put the executable at the path `/home/tldr/progress/update`
3. Copy the files from the [`systemd`](systemd) folder into `/etc/systemd/system/`
4. Finally, run
```shell script
systemctl daemon-reload
# Starting the program on system startup
systemctl enable tldrprogress.service
# Starting the program now
sudo systemctl start tldrprogress.service
# Optional: View generated the public SSH key
cat /home/tldr/progress/keys/id_rsa.pub
```

## Contributing

If you spot a bug or got an idea for an improvement, free welcome to open a new issue or create a pull request. 
