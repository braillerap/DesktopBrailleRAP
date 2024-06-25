import os
import sys
import json
import argostranslate.package
import argostranslate.translate

def main ():
    if (len (sys.argv) < 4):
        print ("Usage: python3 translate.py <locale.json> <locale source> <locale destination>")
        print ("Usage: python3 translate.py ../src/locales/en.json en de")
        sys.exit ()

    
    fpath = sys.argv[1]
    abspath = os.path.abspath(fpath)
    src = sys.argv[2]
    dst = sys.argv[3]
    print ("translate", abspath,"from", src, "to", dst)
    
    # load locale file
    locale = json.load(open(abspath))
    
    #↓ init translation
    argostranslate.package.update_package_index()
    available_packages = argostranslate.package.get_available_packages()
    package_to_install = next(
        filter(
            lambda x: x.from_code == src and x.to_code == dst, available_packages
        )
    )
    argostranslate.package.install_from_path(package_to_install.download())

    # walk locale file and translate
    translated = {}
    for pair in locale.items():
        translatedText = argostranslate.translate.translate(pair[1], src, dst)
        translated.update ({pair[0]:translatedText})
        print(translatedText)

    if len(translated) > 0:
        json.dump(translated, open(dst + ".json", "w",encoding="utf-8"))
        

if __name__ == "__main__":
    main ()