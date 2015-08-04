//1,屏幕显示部分=============================
#include "U8glib.h"
//2,传感器部分================================
#include <Wire.h>
#include "I2Cdev.h"
//温湿度
#include <AM2321.h>
AM2321 am2321;

//#include"AirQuality.h"
#include"Arduino.h"

#include <SoftwareSerial.h>

const int ledPin =  5;

#include "weather.h"
#include "oled.h"

void setup(void) {
  //初始化串口波特率
  Serial.begin(115200);
  my_Serial.begin(2400);

  // initialize the LED pin as an output:
  pinMode(ledPin, OUTPUT);
  //pinMode(buttonPin, INPUT);
  //initWeatherSensor();
}

void loop(void) {
  updateSensorData();
  volcd(); //调用显示库
}

