#include <Wire.h>
#include <Servo.h>

#define SLAVE_ADDRESS 0x04
int number = 0;
int state = 0;
Servo myservo;  // create servo object to control a servo
// twelve servo objects can be created on most boards

int pos = 0;    // variable to store the servo position


void setup() {
  pinMode(13, OUTPUT);
  Serial.begin(9600); // start serial for output
  // initialize i2c as slave
  Wire.begin(SLAVE_ADDRESS);

  // define callbacks for i2c communication
  Wire.onReceive(receiveData);
  Wire.onRequest(sendData);

  //init servo
  myservo.attach(9);  // attaches the servo on pin 9 to the servo object

  Serial.println("Ready!");
}

void loop() {
  delay(100);
}

// callback for received data
void receiveData(int byteCount) {

  while (Wire.available()) {
    number = Wire.read();
    Serial.print("data received: ");
    Serial.println(number);
    //a number of 2 means you want to turn the blinds ON
    //AKA collapse the blinds
    if (number == 1) {
        myservo.write(-180);
    }
    //a number of 2 means you want to turn the blinds OFF
    if(number ==2){
        myservo.write(180);              // tell servo to go to position in variable 'pos'
    }
  }
}

// callback for sending data
void sendData() {
  Wire.write(number);
}
