# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 07th June 2021
- Dark mode (#14)

## [1.2.0] - 29th May 2021
- Brand-new web interface built using Geist UI (#11)
  - Filter for not translated or outdated pages
  - Select columns to be highlighted
  - Help dialogue with more information
  - Thanks to @navarroaxel, @marchersimon, @bl-ue, @patricedenis and @waldyrious for testing and reviewing

## [1.1.3] - 18th March 2021
- Stores the SSH keys using a Docker volume

## [1.1.2] - 14th March 2021
- Highlights a row if the pointer hovers over it

## [1.1.1] - 14th March 2021
- The build of the React website supports relative paths
- Commits deleted files

## [1.1.0] - 13th March 2021
- Uses React + TypeScript for the website
  - All progress information is stored in a `data.json` file
  - Every cell is clickable and links to ...
    * the translation *if it exists*
    * an editor to create the translation *otherwise*
  - Uses `go:embed` for embedding the static website assets in the binary application
- The application now runs continuous and schedules updates by itself
  - Adds the `RUN_ONCE` environment variable to execute a single update
  - Packages the application as a Docker container
- Improves the commit messages (#4 - thanks @bl-ue)

## [1.0.1] - 14th November 2020
- Minify the HTML output by activating the environment variable `MINIFY_HTML`
- While sorting strings their capitalization will be ignored 

## [1.0.0] - 04th November 2020
This is the first release. If you spot any bugs, please let us know.

### Added
- A Website generator which creates a website displaying the progress of translating all tldr pages
- Automatic SSH key generator (those keys can be used as deployment keys)
- [Taskfile.yml](https://taskfile.dev/#/) used to build the project
- GitHub workflow files
- Automatic release builds for linux_amd64, linux_arm and windows
- Configuration files for systemd
- This Changelog  

[Unreleased]: https://github.com/LukWebsForge/TldrProgress/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/LukWebsForge/TldrProgress/releases/tag/v1.3.0
[1.2.0]: https://github.com/LukWebsForge/TldrProgress/releases/tag/v1.2.0
[1.1.3]: https://github.com/LukWebsForge/TldrProgress/releases/tag/v1.1.3
[1.1.2]: https://github.com/LukWebsForge/TldrProgress/releases/tag/v1.1.2
[1.1.1]: https://github.com/LukWebsForge/TldrProgress/releases/tag/v1.1.1
[1.1.0]: https://github.com/LukWebsForge/TldrProgress/releases/tag/v1.1.0
[1.0.1]: https://github.com/LukWebsForge/TldrProgress/releases/tag/v1.0.1
[1.0.0]: https://github.com/LukWebsForge/TldrProgress/releases/tag/v1.0.0
