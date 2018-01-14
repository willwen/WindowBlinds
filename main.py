#For Python 2.7
import smbus
import time

#flask web server modules
from flask import Flask
from flask import request

# for RPI version 1, use "bus = smbus.SMBus(0)"
bus = smbus.SMBus(1)

# This is the address we setup in the Arduino Program
address = 0x04

#put function declerations first
def writeNumber(value):
    bus.write_byte(address, value)
    # bus.write_byte_data(address, 0, value)
    return -1

def readNumber():
    number = bus.read_byte(address)
    # number = bus.read_byte_data(address, 1)
    return number

app = Flask(__name__)
@app.route('/servo')
def index():
    queryParam = "blinds"
    setState = request.args.get(queryParam)
    if(setState == "on"):
        writeNumber(1); #1 denotes to turn on
        print "RPI: Hi Arduino, I sent you 1"
        # sleep one second
        time.sleep(1)

        number = readNumber()
        print "Arduino: Hey RPI, I received a digit ", number
        return "Going to turn the blinds ON"
    elif (setState == "off"):
        writeNumber(2);
        print "RPI: Hi Arduino, I sent you 2 , Meaning OFF"
        # sleep one second
        time.sleep(1)

        number = readNumber()
        print "Arduino: Hey RPI, I received a digit ", number
        return "Going to turn the blinds OFF"
    else:
        return "<h2>"+"Please set the query parameter: " + queryParam + "</h2>"
if __name__ == '__main__':
    app.run(debug=True)


