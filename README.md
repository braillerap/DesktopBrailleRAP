# DesktopBrailleRAP

Document authoring tool for BrailleRAP allowing to mix svg vector graphics with Braille.

![](./screenshot/screenshot1.jpg)

## Features

* SVG import
* Build tangible sketch from svg by printing Braille dots along vector graphic Path
* Add text label anywhere on the page layout
* Text to Braille conversion
* Scale, rotate and move any element on the page layout
* Display a print preview
* Direct print to BrailleRAP embosser
* GCODE download for hacking and test

# Releases
We provide pre-built binaries for Windows. See [releases](https://github.com/BrailleRAP/DesktopBrailleRAP/releases) for more information.

DesktopBrailleRAP depends on glibc version. Unfortunately recent Debian and Ubuntu distrubition are not using exactly the same. 
If your are using Debian12 or a derivate distribution, use desktopbraillerap-debian. 
If you are using Ubuntu24.04 or a derivate distribution, use desktopbraillerap-ubuntu

[![auto_build_for_ubuntu](https://github.com/braillerap/DesktopBrailleRAP/actions/workflows/auto_build_for_ubuntu.yml/badge.svg?event=release)](https://github.com/braillerap/DesktopBrailleRAP/actions/workflows/auto_build_for_ubuntu.yml)


[![auto_build_for_debian](https://github.com/braillerap/DesktopBrailleRAP/actions/workflows/auto_build_for_debian.yml/badge.svg?event=release)](https://github.com/braillerap/DesktopBrailleRAP/actions/workflows/auto_build_for_debian.yml)

## Contributing

### Translation
If you need the software in your locale language, we will be happy to add a new translation. Translation files are hosted on codeberg community translation platform and can be updated by anyone [weblate host on codeberg](https://translate.codeberg.org/projects/desktopbraillerap_translate/ihm/) for more information.


### Code and features
Feel free to open issues or pull requests ! We will be happy to review and merge your changes. BTW we have a great focus on accessibility and user friendly design.

## Translations status

Translation files are available [on codeberg weblate host](https://translate.codeberg.org/projects/desktopbraillerap_translate/ihm/) . Some languages are partialy translated , we are looking for contributors to complete and check them.     


<a href="https://translate.codeberg.org/engage/desktopbraillerap_translate/">
<img src="https://translate.codeberg.org/widget/desktopbraillerap_translate/ihm/multi-auto.svg" alt="État de la traduction" width="75%"/>
</a>

# Building on Windows

## Prerequisites

* Python 3.6 or later
* NodeJS 20.12 or later

## Create a python virtual environment

```
python -m venv venv
```

## Activate python virtual environment

```
.\venv\Scripts\activate
```

## Install python dependencies

```
pip install -r requirements.txt
```

## Install nodejs dependencies

```
npm install
```

## Run in dev environement

```
npm run startview
```

## Build windows .exe

```
npm run buildview
```
check DesktopBrailleRAP.exe in dist folder


# Building on Linux

## Prerequisites
We need several development tools to build DesktopBrailleRAP, python, nodejs and gcc to build some python dependencies.
Depending on your system, you will also need a desktop environment installed on the build machine.


### Python / gcc / nodejs

General build tools:

    apt install  cmake build-essential git ninja-build autoconf gnulib
    apt install  ca-certificates curl gnupg
    apt install  software-properties-common
    apt install  python3 python3-venv python3-dev
    apt install  pkg-config 
    apt install  gir1.2-gtk-3.0 gir1.2-webkit2-4.1
    apt install  python3-tk 
    apt install  xvfb
    apt install  libcairo2 libcairo2-dev libgirepository1.0-dev
    apt install  tcl curl

Nodejs:

General Nodejs
    
    curl -sL https://deb.nodesource.com/setup_20.x | bash -
    apt update
    apt install -y nodejs
    npm i npm@latest -g

Install DesktopBrailleRAP nodejs dependencies

    npm install

Python:

Create a python3 virtual environment

    python3 -m venv venv

Activate python3 virtual environment

    source ./venv/bin/activate

Install python3 DesktopBrailleRAP dependencies

    pip install -r requirement_linux.txt

## Build DesktopBrailleRAP

Activate python virtual env 

    source ./venv/bin/activate

### Run in development environement

    npm run startview

### Build DesktopBrailleRAP

    npm run builddebian

Check the ./dist folder for the desktopbraillerap-debian executable. You can install the .deb package with:

    sudo dpkg -i desktopbraillerap-debian-x.x.x.deb


# Building for Raspberry PI 4

## Prerequisites
The packaged  binary release has been build on a Raspberry 4 2GO with latest 64 bits Raspberry PI OS (debian bookworm)

Raspberry PI OS come with python, we only need to istall nodejs and some python dependicies. We love to use virtual env on python, but the needed python packages are not available has wheel packages on arm (packages for pip cmd), so we must install the python dependencies in the global system configuration.

### build tools
    
    sudo apt install git-extras

### Python

    sudo apt install python3-gi python3-gi-cairo gir1.2-gtk-3.0 gir1.2-webkit2-4.1
    sudo apt install python3-pyqt5 python3-pyqt5.qtwebengine python3-pyqt5.qtwebchannel 
    sudo apt install libqt5webkit5-dev

### Install nodejs
    curl -sL https://deb.nodesource.com/setup_20.x | bash -
    apt update
    apt install -y nodejs
    npm i npm@latest -g

### Create python environnement

    python3 -m venv venv --system-site-packages

### install nodejs dependencies

    npm i

### activate virtualenv

    source ./venv/bin/activate

### install python dependencies in virtualenv

    pip install pywebview
    pip install pyserial
    pip install pyinstaller

### Run in development environement

    npm run startview

### build DesktopBrailleRAP

    npm run buildrpi

Check the dist folder for desktopbraillerap-rpi executable. You can install the .deb package with :

    sudo apt install desktopbraillerap-rpi-x.x.x.deb

# Building for Linux using Docker
You can use Docker configuration to build DesktopBrailleRAP for a Linux distribution. Docker configuration to build DesktopBrailleRAP for Debian or Ubuntu are available here:
[Debian](https://github.com/braillerap/BuildDesktopBrailleRAPDebian)
[Ubuntu](https://github.com/braillerap/BuildDesktopBrailleRAPLinux)
