#include <ArduinoJson.h>
#include <WebUSB.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>
#include <DHT.h>

WebUSB WebUSBSerial(0 /* https:// */, "localhost:8080");

/*-----( Declare objects )-----*/
// set the LCD address to 0x20 for a 20 chars 4 line display
// Set the pins on the I2C chip used for LCD connections:
//                    addr, en,rw,rs,d4,d5,d6,d7,bl,blpol
LiquidCrystal_I2C lcd(0x27, 2, 1, 0, 4, 5, 6, 7, 3, POSITIVE);  // Set the LCD I2C address

#define DHTPIN 0     // what pin we're connected to
#define DHTTYPE DHT22   // DHT 22  (AM2302)
DHT dht(DHTPIN, DHTTYPE);

#define USBSerial WebUSBSerial

uint16_t incomingByte = 0;   // for incoming serial data
int column = 0;
int row = 0;

void setup(void) {
  while (!USBSerial) {
    ;
  }
  USBSerial.begin(9600);
  USBSerial.flush();
  Serial.begin(9600);      // open the serial port at 9600 bps:    

  lcd.begin(16,2);   // initialize the lcd for 16 chars 2 lines, turn on backlight
  delay(500);
  lcd.setCursor(0,0);
}

JsonObject& measureTH(void) {
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& data = jsonBuffer.createObject();
  
  // Reading temperature or humidity takes about 250 milliseconds!
  data["t"] = dht.readTemperature(); // in Celsius
  data["h"] = dht.readHumidity();
  
  // Check if any reads failed and exit early (to try again).
  if (isnan(data["temperature"]) || isnan(data["humidity"])) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  return data;
}

void loop(void) {
   // read the incoming byte:
  incomingByte = USBSerial.read();
  if (incomingByte > 0 && incomingByte < 127) { // Only ASCII charaers 
    lcd.setCursor(column,row);
    lcd.print((char*)&incomingByte);
    column++;
    if (column > 15) {
      column = 0;
      row++;
      if (row > 1) {
        row = 0;
      }
    }
  } else if (incomingByte == 127) { // delete screen
    lcd.clear();
    column = 0;
    row = 0;
  } else if (incomingByte == 128) { // measure temperature and humidity
    JsonObject& data = measureTH();
    // Send Data
    data.printTo(USBSerial);
    USBSerial.println();
  }
}



