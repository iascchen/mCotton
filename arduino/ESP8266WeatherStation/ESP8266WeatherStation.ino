//1,屏幕显示部分=============================
//#include "U8glib.h"

#include <Wire.h>
#include "I2Cdev.h"

#include <AM2321.h>

#include <SoftwareSerial.h>

#include "def.h"
#include "weather.h"
//#include "oled.h"
#include "wifiSerial.h"


void setup()
{
  esp8266Serial.begin(115200);//connection to ESP8266
  Serial.begin(115200); //serial debug
  
  esp8266Init();
  //esp8266SmartConfig();
}

void loop()
{

  retrievalData();

  commondFromSerial();

  if (net_time > millis()) net_time = millis();
  if (millis() - net_time > INTERVAL_NET) {
    updateWeatherData();
    net_time = millis();
  }

    //传感器采样时间间隔
  if (sensor_time > millis()) sensor_time = millis();
  if (millis() - sensor_time > INTERVAL_SENSOR) {
    updateSensorData();
    sensor_time = millis();
  }

  // if (lcd_time > millis()) lcd_time = millis();
  // if (millis() - lcd_time > INTERVAL_LCD) {
  //   volcd();                       //调用显示库
  //   lcd_time = millis();
  // }

}
