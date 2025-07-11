import os
import platform
import threading
import webview
import json
import platform
import sys
import serial.tools.list_ports
import time
from pathlib import Path

rpi = False
COM_TIMEOUT =   5  #Communication timeout with device controller (Marlin)

if getattr(sys, "frozen", False):
    try:  # pyi_splash only available while running in pyinstaller
        import pyi_splash
    except ImportError:
        pass

# main app user option
app_options = {
    "comport": "COM1",
    "brailletbl": "70",
    "lang": "en",
    "Paper": {"width": 210, "height": 297, "usablewidth": 190, "usableheight": 250},
    "stepvectormm": 2.4,
    "SvgInterpol":False,
    "ZigZagBloc":False,
    "Optimbloc":False,
    "OptimLevel":0,
    "Speed":6000,
    "Accel":1500,
}

# runtime option to automate some actions
run_options = {
    "path_patterns": "",
    "path_svg": "",
    "direct_print": "",
}

class SerialStatus:
    Ready = 0
    Busy = 2

class KnownOS:
    Windows = 0
    Linux = 1
    RPI = 2
    Unknown = 3

serial_port = None
serial_status = SerialStatus.Ready
filename = ""
root = None
cancel_print = False
detected_os = KnownOS.Unknown

def get_parameter_fname ():
    paramfname = "desktop_brap_parameters.json"
    if detected_os == KnownOS.Linux:
        home = Path.home ()
        dir = Path.joinpath(home, ".desktopbraillerap/")
        print (home, dir)
        if not os.path.exists(dir):
            os.makedirs(dir)
        fpath = Path.joinpath(dir, paramfname)
        print (fpath)
        return fpath

    else:
        return paramfname
        
def load_parameters():
    try:
        fpath = get_parameter_fname()

        with open(fpath, "r", encoding="utf-8") as inf:
            data = json.load(inf)
            for k, v in data.items():
                if k in app_options:
                    app_options[k] = v

    except Exception as e:
        print(e)
    print(app_options)

def load_environment():
    var = [
        ["DESKTOPBRAP_PATTERNS_PATH", "path_patterns"], # pattern association file
        ["DESKTOPBRAP_SVG_PATH", "path_svg"],           # svg file to load at start
        ["DESKTOPBRAP_DIRECT_PRINT", "direct_print"],   # direct print of svg file
    ]

    for v in var:
        if v[0] in os.environ:
            run_options[v[1]] = os.environ[v[0]]

    print ("runtime options:", run_options)            


class Api:
    def fullscreen(self):
        """toggle main window fullscreen"""
        webview.windows[0].toggle_fullscreen()

    # seem obsolete
    """ def save_content(self, content):
        filename = webview.windows[0].create_file_dialog(webview.SAVE_DIALOG)
        if not filename:
            return

        with open(filename, "w") as f:
            f.write(content) """
    
    def remove_comment(self, string):
        """Remove comments from GCode if any"""
        if string.find(';') == -1:
            return string
        return string[:string.index(';')]
    
    def set_window(self, window):
        self._window = window

    def quit(self):
        print ("quit request")
        self._window.destroy()

    def get_parameters(self):
        """Get parameters value"""
        js = json.dumps(app_options)
        print ("backend get parameters: ", js)
        return js

    def get_runtime_options(self):
        """ Get runtime options value """
        js = json.dumps(run_options)
        print ("backend get runtime options: ", js)
        return js

    def gcode_set_parameters(self, opt):
        """Set parameters value"""
        print("parameters", opt, type(opt))
        try:
            for k, v in opt.items():
                if k in app_options:
                    app_options[k] = v

        except Exception as e:
            print(e)
        self.save_parameters()

    def confirm_dialog (self, title, message):
        return window.create_confirmation_dialog(title, message)
    
    def save_parameters(self):
        """Save parameters in local json file"""
        try:
            #print("data", app_options)
            #print("json", json.dumps(app_options))
            fpath = get_parameter_fname()
            with open(fpath, "w", encoding="utf-8") as of:
                json.dump(app_options, of)

        except Exception as e:
            print(e)

    
    def saveas_file(self, data, dialogtitle, filterstring, filter=["(*.brp)", "(*.*)"]):
        global filename

        fname = window.create_file_dialog(
            webview.SAVE_DIALOG,
            allow_multiple=False,
            file_types=(filterstring[0] + " " + filter[0], filterstring[1] + " " +filter[1]),
        )
      
        if fname:
            if detected_os == KnownOS.Windows:
                filename = fname
            else:
                filename = fname[0]
        else:
            return
        
        with open(filename, "w", encoding="utf8") as inf:
            inf.writelines(data)

    def save_file(self, data, dialogtitle, filterstring, filter=["(*.brp)", "(*.*)"]):
        global filename
        if filename == "":
            self.saveas_file (data, dialogtitle, filterstring, filter)
            return

        with open(filename, "w", encoding="utf8") as inf:
            inf.writelines(data)

    def download_file(self, data, dialogtitle, filterstring, filter=["(*.txt)", "(*.*)"]):
        
        if len(filterstring) < 2 or len(filter) < 2:
            print("incorrect file filter")
            return 

        fname = window.create_file_dialog(
            webview.SAVE_DIALOG,
            allow_multiple=False,
            file_types=(filterstring[0] + " " + filter[0], filterstring[1] + " " +filter[1]),
        )
      
        if fname:
            if detected_os == KnownOS.Windows:
                ftowrite = fname
            else:
                ftowrite = fname[0]
        else:
            return
        
        with open(ftowrite, "w", encoding="utf8") as inf:
            inf.writelines(data)

    def read_file (self, path):
        js = {"data": "", "error": ""}
        with open(path, "rt", encoding="utf8") as inf:
            js["data"] = inf.read()
            js["fname"] = os.path.basename(path)
            

        return json.dumps(js)
    
    def import_file(self, dialogtitle, filterstring, filter=["(*.brp)", "(*.*)"]):
        
        js = {"data": "", "error": ""}

        # check file filter
        if len(filterstring) < 2 or len(filter) < 2:
            js["error"] = "incorrect file filter"
            return json.dumps(js)

        # open common dialog
        listfiles = window.create_file_dialog(
            webview.OPEN_DIALOG,
            allow_multiple=False,
            file_types=(filterstring[0] + " " + filter[0], filterstring[1] + " " +filter[1]),
        )
        if not listfiles:
            return json.dumps(js)
        if len(listfiles) != 1:
            return json.dumps(js)
        fname = listfiles[0]
        
        if fname == "" or fname == None:
            return json.dumps(js)

        with open(fname, "rt", encoding="utf8") as inf:
            js["data"] = inf.read()
            js["fname"] = os.path.basename(fname)
            

        return json.dumps(js)
    
    def load_file(self, dialogtitle, filterstring, filter=["(*.brp)", "(*.*)"]):
        global filename
        js = {"data": "", "error": ""}

        # check file filter
        if len(filterstring) < 2 or len(filter) < 2:
            js["error"] = "incorrect file filter"
            return json.dumps(js)

        # open common dialog
        listfiles = window.create_file_dialog(
            webview.OPEN_DIALOG,
            allow_multiple=False,
            file_types=(filterstring[0] + " " + filter[0], filterstring[1] + " " +filter[1]),
        )

        if not listfiles:
            return json.dumps(js)
                
        if len(listfiles) != 1:
            return json.dumps(js)
        
        if listfiles[0]:
            fname = listfiles[0]
        else:
            return json.dumps(js)
        
        with open(fname, "rt", encoding="utf8") as inf:
            js["data"] = inf.read()
            filename = fname

        return json.dumps(js)

    def PrintGcode(self, gcode, comport):
        global serial_status, cancel_print
        print("Opening Serial Port", comport)
        try:
            cancel_print = False
            if serial_status == SerialStatus.Busy:
                print("Printer busy")
                return "Print in progress :"

            serial_status = SerialStatus.Busy
            with serial.Serial(comport, 250000, timeout=2, write_timeout=2) as Printer:
                print(comport, "is open")

                # Hit enter a few times to wake up
                #print(comport, "cleanup")                
                Printer.write(str.encode("\r\n\r\n"))   #cleanup
                
                time.sleep(1) # Wait for initialization
                Printer.flushInput()  # Flush startup text in serial input
                #print("Sending GCode")
                gcodelines = gcode.split("\r\n")
                for line in gcodelines:
                    cmd_gcode = self.remove_comment(line)
                    cmd_gcode = (
                        cmd_gcode.strip()
                    )  # Strip all EOL characters for streaming
                    if cmd_gcode.isspace() is False and len(cmd_gcode) > 0:
                        print("Sending: " + cmd_gcode)
                        Printer.write(
                            cmd_gcode.encode() + str.encode("\n")
                        )  # Send g-code block
                        # Wait for response with carriage return
                        tbegin = time.time()
                        while True:
                            grbl_out = Printer.readline()
                            print(grbl_out.strip().decode("utf-8"))
                            if str.encode("ok") in grbl_out:
                                break
                            if len(grbl_out) > 0:
                                tbegin = time.time()
                            if time.time() - tbegin > COM_TIMEOUT:
                                raise Exception("Timeout in printer communication")

                    if cancel_print:
                        Printer.write(
                            str.encode("M84;\n") # disable motor
                        )  
                        Printer.readline()
                        break
                print("End of printing")
                Printer.close()
        except Exception as e:
            print(e)
            serial_status = SerialStatus.Ready
            return "Erreur d'impression :" + str(e)

        serial_status = SerialStatus.Ready
        return " "

    def CancelPrint(self):
        global cancel_print
        cancel_print = True
        print ("Printing cenceled")
        return


    def gcode_set_serial(serial):
        serial_port = serial

    def gcode_set_com_port(self, port):
        app_options["comport"] = str(port)
        self.save_parameters()

    def gcode_set_nb_line(self, nbline):
        app_options["nbline"] = int(nbline)
        self.save_parameters()

    def gcode_set_nb_col(self, nbcol):
        app_options["nbcol"] = int(nbcol)
        json.dump()

    def gcode_get_serial(self):
        data = []
        try:
            ports = serial.tools.list_ports.comports()
            for port in ports:
                # print (port.device)
                # print (port.hwid)
                # print (port.name)
                # print (port.description)
                # print (port.product)
                # print (port.manufacturer)
                data.append(
                    {
                        "device": port.device,
                        "description": port.description,
                        "name": port.name,
                        "product": port.product,
                        "manufacturer": port.manufacturer,
                    }
                )
            print(data)
        except Exception as e:
            print(e)

        # check if com port in parameters is present in port enumeration
        if not any(d.get("device", "???") == app_options["comport"] for d in data):
            print("adding com port in parameters")
            data.append(
                {
                    "device": app_options["comport"],
                    "description": "inconnu",
                    "name": "inconnu",
                    "product": "inconnu",
                    "manufacturer": "inconnu",
                }
            )

        # dump data in json format for frontend
        js = json.dumps(data)

        return js

def get_entrypoint():
    def exists(path):
        print(os.path.join(os.path.dirname(__file__), path))
        return os.path.exists(os.path.join(os.path.dirname(__file__), path))

   
    if exists("./build/index.html"):  # unfrozen development
        return "./build/index.html"

    raise Exception("No index.html found")


def set_interval(interval):
    def decorator(function):
        def wrapper(*args, **kwargs):
            stopped = threading.Event()

            def loop():  # executed in another thread
                while not stopped.wait(interval):  # until stopped
                    function(*args, **kwargs)

            t = threading.Thread(target=loop)
            t.daemon = True  # stop if the program exits
            t.start()
            return stopped

        return wrapper

    return decorator


def delete_splash(window):
    print ("delete splash **************************************************")
    
    
    try:
        if (platform.machine () == 'aarch64'):
            time.sleep(10)
            print ("#################################  resize the window")
            window.resize (512,512)
            window.maximize()
    except:
        pass
        
    try:
        if getattr(sys, "frozen", True):
            pyi_splash.close()
    except:
        pass

    
    # print ("started", time())


entry = get_entrypoint()

if __name__ == "__main__":
    api = Api()
    debugihm = False

    #print(sys.argv)
    dir, script = os.path.splitext(sys.argv[0])
    #if len(sys.argv) > 1 and script == ".py":
    if len(sys.argv) > 1:
        if sys.argv[1] == "--debug":
            debugihm = True

    # display html start file
    print("start html=", entry)
    
    # load parameteres
    load_parameters()

    # load environment runtime option
    load_environment()

    # start gui
    if platform.machine() == 'aarch64':
        detected_os = KnownOS.RPI
    if platform.system() == "Windows":
        detected_os = KnownOS.Windows
    elif platform.system() == "Linux":
        detected_os = KnownOS.Linux

    entry = "./build/index.html"
    if detected_os == KnownOS.RPI:    
        window = webview.create_window(
            "DesktopBrailleRAP", entry, js_api=api, focus=True,
        )
    else:
        window = webview.create_window(
            "DesktopBrailleRAP", entry, js_api=api, focus=True, maximized=True,
        )

    api.set_window (window)
    
    if detected_os == KnownOS.Windows:
        print ("starting Windows GUI")
        webview.start(delete_splash, window, http_server=False, debug=debugihm)
    elif (detected_os == KnownOS.Linux):
        #set QT_QPA_PLATFORM on UBUNTU
        if getattr(sys, 'frozen', False):
            
            if ('QT_QPA_PLATFORM' in os.environ):
                print ("QT_QPA_PLATFORM=", os.environ['QT_QPA_PLATFORM'])
                print ("starting Linux GUI QT with configured QT_QPA_PLATFORM")
                webview.start(delete_splash, gui="qt", http_server=False, debug=False)
            else:
                print ("QT_QPA_PLATFORM=<empty>")
                print ("try to resolve with XDG_SESSION_TYPE")
                plugin = 'xcb'

                if ('XDG_SESSION_TYPE' in os.environ):             
                    if (os.environ['XDG_SESSION_TYPE'] == 'wayland'):
                        plugin = 'wayland'
                    
                # try wayland and xcb to start QT
                print ("setting QT_QPA_PLATFORM to :", plugin)
                os.environ['QT_QPA_PLATFORM'] = plugin
                
                                
                webview.start(delete_splash, window, gui="qt", http_server=False, debug=False)
                                
                
        else :
            print ("starting  GUI GTK dev environment, debug don't work in qt")
            webview.start(delete_splash, window, gui="gtk", http_server=False, debug=debugihm)
