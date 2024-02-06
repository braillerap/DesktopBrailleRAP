import os
import threading
import webview
import json
import json
import platform
import sys
import tkinter as tk
import tkinter.filedialog
import tkinter.messagebox
import serial.tools.list_ports


from time import time

if getattr(sys, "frozen", False):
    try:  # pyi_splash only available while running in pyinstaller
        import pyi_splash
    except ImportError:
        pass

app_options = {
    "comport": "COM1",
    "nbcol": "31",
    "nbline": "24",
    "linespacing": "0",
    "brailletbl": "70",
    "lang": "",
}


class SerialStatus:
    Ready = 0
    Busy = 2


serial_port = None
serial_status = SerialStatus.Ready
filename = ""
root = None


def load_parameters():
    try:
        with open("parameters.json", "r", encoding="utf-8") as inf:
            data = json.load(inf)
            for k, v in data.items():
                if k in app_options:
                    app_options[k] = v

    except Exception as e:
        print(e)


class Api:
    def fullscreen(self):
        webview.windows[0].toggle_fullscreen()

    def save_content(self, content):
        filename = webview.windows[0].create_file_dialog(webview.SAVE_DIALOG)
        if not filename:
            return

        with open(filename, "w") as f:
            f.write(content)

    def ls(self):
        return os.listdir(".")

    def gcode_get_parameters(self):
        js = json.dumps(app_options)
        return js

    def gcode_set_parameters(self, opt):
        # print ("parameters", opt, type(opt))
        try:
            for k, v in opt.items():
                if k in app_options:
                    app_options[k] = v

        except Exception as e:
            print(e)
        self.save_parameters()

    def save_parameters(self):
        """Save parameters in local json file"""
        try:
            # print ("data", app_options)
            # print ("json", json.dumps(app_options))
            with open("parameters.json", "w", encoding="utf-8") as of:
                json.dump(app_options, of)

        except Exception as e:
            print(e)

    def saveas_file(self, data, dialogtitle, filterstring):
        global filename

        fname = window.create_file_dialog(
            webview.SAVE_DIALOG,
            allow_multiple=False,
            file_types=(filterstring[0] + " (*.txt)", filterstring[1] + " (*.*)"),
        )

        if fname == "" or fname == None:
            return
        filename = fname

        with open(filename, "w", encoding="utf8") as inf:
            inf.writelines(data)

    def save_file(self, data, dialogtitle, filterstring):
        global filename
        if filename == "":
            # init tk to give focus on common dialog
            # root = tk.Tk()
            # root.geometry("1x1+8192+8192")
            # root.focus_set ()
            # root.grab_set_global()

            # start = time.time()
            # while (time.time() - start < 1):
            #     root.update_idletasks()
            #     root.update()

            # fname = tkinter.filedialog.asksaveasfilename(master=root, title = "Select file",filetypes = (("Text files", "*.txt"),("All files", "*.*")))
            # root.destroy()
            fname = window.create_file_dialog(
                webview.SAVE_DIALOG,
                allow_multiple=False,
                file_types=(filterstring[0] + " (*.txt)", filterstring[1] + " (*.*)"),
            )
            if fname == "" or fname == None:
                return
            filename = fname

        with open(filename, "w", encoding="utf8") as inf:
            # print (data)
            inf.writelines(data)

    def load_file(self, dialogtitle, filterstring):
        global filename
        js = {"data": "", "error": ""}

        # check file filter
        if len(filterstring) < 2:
            js["error"] = "incorrect file filter"
            return json.dumps(js)

        # open common dialog
        oldfilter = (("Text files", "*.txt"), ("All files", "*.*"))
        filter = ((filterstring[0], "*.txt"), (filterstring[1], "*.*"))

        listfiles = window.create_file_dialog(
            webview.OPEN_DIALOG,
            allow_multiple=False,
            file_types=(filterstring[0] + " (*.txt)", filterstring[1] + " (*.*)"),
        )
        if len(listfiles) != 1:
            return json.dumps(js)
        fname = listfiles[0]
        if fname == "" or fname == None:
            return json.dumps(js)

        with open(fname, "rt", encoding="utf8") as inf:
            js["data"] = inf.read()
            filename = fname

        return json.dumps(js)

    
    def PrintGcode(self, gcode, comport):
        global serial_status
        print("Opening Serial Port", comport)
        try:
            if serial_status == SerialStatus.Busy:
                print("Printer busy")
                return "Print in progress :"

            serial_status = SerialStatus.Busy
            with serial.Serial(comport, 250000, timeout=2, write_timeout=2) as Printer:
                print(comport, "is open")

                # Hit enter a few times to wake up
                Printer.write(str.encode("\r\n\r\n"))
                print(comport, "cleanup")
                # eel.sleep(2)  # Wait for initialization
                time.sleep(1)
                Printer.flushInput()  # Flush startup text in serial input
                print("Sending GCode")
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
                            if time.time() - tbegin > 5:
                                raise Exception("Timeout in printer communication")

                print("End of printing")
                Printer.close()
        except Exception as e:
            print(e)
            serial_status = SerialStatus.Ready
            return "Erreur d'impression :" + str(e)

        serial_status = SerialStatus.Ready
        return " "

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

    if exists("../gui/index.html"):  # unfrozen development
        return "../gui/index.html"

    if exists("./build/index.html"):  # unfrozen development
        return "./build/index.html"

    if exists("../Resources/gui/index.html"):  # frozen py2app
        return "../Resources/gui/index.html"

    if exists("./gui/index.html"):
        return "./gui/index.html"

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


@set_interval(1)
def update_ticker():
    if len(webview.windows) > 0:
        webview.windows[0].evaluate_js(
            'window.pywebview.state.setTicker("%d")' % time()
        )


def delete_splash():
    try:
        pyi_splash.close()
    except:
        pass
    # print ("started", time())


entry = get_entrypoint()

if __name__ == "__main__":
    api = Api()
    print("start html=", entry)
    load_parameters()
    # print (app_options)

    # print ("start", time())
    window = webview.create_window("DesktopBrailleRAP", entry, js_api=api, maximized=True)
    # print ("created", time())

    webview.start(delete_splash, http_server=False, debug=True)
