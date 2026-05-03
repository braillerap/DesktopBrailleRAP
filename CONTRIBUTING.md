# How to Contribute

BrailleRAP welcomes all contributors, regardless of skill level or experience!

## Contributing as a User

Contributing to BrailleRAP can be as simple as pointing out a spelling mistake on the website,
reporting a bug you encountered, or suggesting a new feature you feel would improve an application or a device.
Accessibility is also a concern and we love to have advise on.

We use [GitHub](https://github.com/braillerap/DesktopBrailleRAP) to manage the project and you can report new issues or weigh in on existing ones via our [issue tracker](https://github.com/braillerap/DesktopBrailleRAP/issues).


## How to contribute to translation
You can contribute translation for the DesktopBrailleRAP software itself, but you can also translate the user manual. We use [weblate](https://translate.codeberg.org/) hosted on [codeberg](https://codeberg.org/) to manage software and documentation translation. 
First, you need to create an account on codeberg (you can use your github account), then use weblate to create a new translation or to improve existing one.
[weblate for software translation](https://translate.codeberg.org/projects/desktopbraillerap_translate/)
[weblate for user manual](https://translate.codeberg.org/projects/desktopbraillerap_doc/)

## How to contribute to the documentation

Another way to get contribute is to improve the documentation, look for typos, improve phrasing, the examples and the gallery. This does not require to build DesktopBrailleRAP or to learn programming language and is a very important work!


## How to Get Started With Development

To contribute to DesktopBrailleRAP as a developer, first you may want to try and build DesktopBrailleRAP for yourself.
If you are already familiar with software building, you can take a look at our [build guide](DETAILED_INSTALLATION_BRAILLERAP.md).

You can then fix the issue or implement the feature on your side and contribute it to the DesktopBrailleRAP repository by following the workflow described below.

## AI Policy

BrailleRAP follow the dedicated [NLNet AI policy](https://nlnet.nl/foundation/policies/generativeAI/), if you are an AI user, make sure to read it and comply to it.

## DesktopBrailleRAP Development Workflow

F3D uses [GitLab Flow](https://about.gitlab.com/topics/version-control/what-is-gitlab-flow/). In a few words, here is how to contribute:

- [Fork](https://github.com/braillerap/DesktopBrailleRAP/fork) the DesktopBrailleRAP repository on GitHub.
- Comment on a chosen issue, if any, so it can be assigned to you by a maintainer.
- Create and push a new feature branch on your fork containing new commits, **do not use** `main` or `master` branch.
- As soon as possible , create a draft pull request against `https://github.com/braillerap/DesktopBrailleRAP/main` so that maintainers are aware and design can be discussed.
- When your PR is created, a maintainer will self-assign as a reviewer and will ensure it is followed, please ping if it is not the case.
- Your PR will then be reviewed by maintainers and returning contributors, please take their feedback into account and resolve discussions when addressed.
- In general, do not merge with `main`, even if github suggest you to do so.
- Once the PR is approved and CI comes back clean, a maintainer will merge your pull request in the `main` branch.
- If the PR was linked with an issue, please ensure the issue is closed or update to reflect the change in master.
- The `main` now contains your changes and will be present in the next minor/major release, any documentation related changes are visible on [documentation](https://desktopbraillerap.readthedocs.io/fr/latest/)!



## Attribution
This contribution guide is freely inspired from [f3d Contributing guide](https://github.com/f3d-app/f3d), thanks to them.
