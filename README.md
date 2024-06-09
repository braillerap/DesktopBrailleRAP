# DesktopBrailleRAP

Document authoring tool for BrailleRAP allowing to mix svg vector graphics with Braille.

![](./screenshot/screenshot1.jpg)

## Features

* Text to Braille conversion
* SVG import
* Build tangible sketch from svg by printing Braille dots along vector graphic Path
* Add text label anywhere on the page layout
* Scale, rotate and move any element on the page layout
* Display a print preview
* Direct print to BrailleRAP embosser

# Building on Windows

## Prerequisites

* Python 3.6 or later
* NodeJS 20.12 or later

## Creating python virtual environment

```
python -m venv venv
```

## Activating python virtual environment

```
.\venv\Scripts\activate
```

## Installing python dependencies

```
pip install -r requirements.txt
```

## Installing nodejs dependencies

```
npm install
```

## Running in dev environement

```
npm run startview
```

## Building exe

```
npm run buildview
```
check DesktopBrailleRAP.exe in dist folder


# Building on Linux

more to come soon
    
`