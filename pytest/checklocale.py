import os
import sys
import json

def get_locale_files(dir):
    flist = []
    for root, dirs, files in os.walk(dir):
        print (root, files)
        for file in files:
            flist.append(os.path.join(root, file))
           
    return flist

def load_locale_files(files):
    locales = []
    for file in files:
        print("loading file :",file)
        locale = json.load(open(file))
        locales.append({"file":file, "data":locale})

    return locales
def test_locales (files):
    errlist = []
    for file in files:
        print("checking file :",file['file'])
        for testfile in files:
            if testfile == file:
                continue
            for key in file['data'].keys():
                if (key not in testfile['data']):
                    errlist.append("{0} : key {1}  not in :{2}".format (file['file'],key,testfile['file']))
    return errlist

def main ():
    # get locale data files
    dir = sys.argv[1]
    abspath = os.path.abspath(dir);
    
    print("checking files in :",abspath)
    files = get_locale_files(dir)
    print (files)

    print("loading files in :",abspath)
    locales = load_locale_files(files)
    
    errlist = test_locales(locales)
    if (len(errlist) > 0):
        for err in errlist:
            print (err)
        print("errors found :", len(errlist))
        return (1)
    else:
        print("no errors found")    
        return (0)

if __name__ == "__main__":
    if main () != 0:
        sys.exit (1)
    sys.exit(0)