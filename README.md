# tldr translation progress

Generates and publishes a website, which shows the progress of translation of the 
[tldr](https://github.com/tldr-pages/tldr/) project.

## Building

This software is build using a [`Taskfile.yml`](Taskfile.yml). 

Install [Task](https://taskfile.dev/#/installation) and run
```shell script
task build
```

You can also minimize size (~2MB to ) of the css files by passing the option PURGE
```shell script
task build PURGE=true
```

If you've already built the project and then activate the purge mode, it may not work.
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

You can either let the program generate a new SSH key pair, or you can use your own, even if a password is required.
This application doesn't support HTTP authentication.

The program exits after its first run, if you don't use your own.
A new SSH key pair has been generated at the folder `keys`.
Add the public key as a deploy key to the specified repository (`SITE_REMOTE_URL`).

In the next run the software will generate the status page in the `upstream` folder, commit the changes and push it. 

It's recommend to execute this software daily.

If you want to test your changes, I recommend that you set `DONT_PUBLISH` and view the updated website locally.
The value of this environment variable doesn't matter, it just has be set.

## Contributing

If you spot a bug or got an idea for an improvement, free welcome to open a new issue or create a pull request. 