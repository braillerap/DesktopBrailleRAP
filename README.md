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
* GCODE download for hacking

# Releases
We provide pre-built binaries for Windows. See [releases](https://github.com/BrailleRAP/DesktopBrailleRAP/releases) for more information.

## Contributing

### Translation
If you need the software in your locale language, we will be happy to add a new translation. Translation files are hosted on codeberg and can be updated by anyone [weblate host on codeberg](https://translate.codeberg.org/projects/desktopbraillerap_translate/ihm/) for more information.

### Code and features
Feel free to open issues or pull requests ! We will be happy to review and merge your changes. BTW we have a great focus on accessibility and user friendly design.

## Translations status

Translation files are available [on codeberg weblate host](https://translate.codeberg.org/projects/desktopbraillerap_translate/ihm/) . Some languages are partialy translated , we are looking for contributors to complete and check them.     

| Locale              | Status | 
| :------------------ | :------: |
| French              |   OK   | 
| English             |   OK   | 
| Ukrainian           |   OK   | 
| Dutch               |  Partial - need someone to check it   | 
| German              |  Partial - need someone to check it   | 
| Spanish             |  Partial - need someone to check it   | 
| Arabic              |  Partial - need someone to check it   | 

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



