import os
import json
import time
import serial.tools.list_ports

class SerialStatus:
    Ready = 0
    Busy = 2

class PrintStatus:
    def __init__(self):
        self.status = {
            "message":"",
            "status": 0
        }

    def setMessage (self, message):
        self.status['message'] = message

    def setStatus (self, status):
        self.status['status'] = status

    def getjson (self):
        return json.dumps (self.status)
    

class SerialPrint:
    def __init__(self):
        self.serial_status = SerialStatus.Ready
        self.cancel_print = False
        
    def PrintGcode(self, gcode, comport):
        
        status = PrintStatus()

        print("Opening Serial Port", comport)
        try:
            self.cancel_print = False
            if self.serial_status == SerialStatus.Busy:
                print("Printer busy")
                status.setMessage ("Print in progress :")
                status.setStatus (1)
                return status.getjson ()

            self.serial_status = SerialStatus.Busy
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

                    if self.cancel_print:
                        Printer.write(
                            str.encode("M84;\n") # disable motor
                        )  
                        Printer.readline()
                        break
                print("End of printing")
                Printer.close()
        except Exception as e:
            print(e)
            self.serial_status = SerialStatus.Ready
            status.setMessage ("Printing error :" + str(e))
            status.setStatus (1)
            print (status.getjson())
            return status.getjson ()
            
            

        self.serial_status = SerialStatus.Ready
        return status.getjson ()

    def CancelPrint(self):
        self.cancel_print = True
        print ("Printing cenceled")
        
