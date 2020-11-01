# tldr translation progress

Generates and publishes a website, which shows the progress of translation of the 
[tldr](https://github.com/tldr-pages/tldr/) project.

## Building

This software is build using a [`Taskfile.yml`](Taskfile.yml). 

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
| SSH_KEY_PASSWORD     | A password for the SSH key                   | No       |
| DONT_PUBLISH         | No changes will be committed & pushed        | No       |

You can either let the program generate a new SSH key pair, or you can use your own even if a password is required.
This application doesn't support HTTP authentication.

The program exits after its first run, if you don't use your own key pair.
A new SSH key pair will be generated at the folder `keys`.
Add the public key as a deploy key (with writing access) to the specified repository (`SITE_REMOTE_URL`).

In the next run the software will generate the status page in the `upstream` folder, commit the changes and push it. 

It's recommended to execute this software daily to keep the website up-to-date.

If you want to test your changes, I recommend you set the environment variable `DONT_PUBLISH` 
and view the updated website locally before deploying it.
The value of this environment variable doesn't matter, it just has be set.

## Contributing

If you spot a bug or got an idea for an improvement, free welcome to open a new issue or create a pull request. 