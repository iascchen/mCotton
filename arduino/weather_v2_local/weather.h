#include"AirQuality.h"
#include"Arduino.h"
AirQuality airqualitysensor;

#include <SoftwareSerial.h>
SoftwareSerial mySerial(4, 5); //RX,TX

#define my_Serial mySerial
// #define my_Serial Serial1  //Core+

int cal[7];

int sum;

int num;

int change[2];

int cal_data;

float sensor_tem, sensor_hum,sensor_light,sensor_cal,sensor_etoh,sensor_pm_tmp; //温度、湿度,光照,PM2.5
int current_quality =-1;

char s_data;

//void Serial_cal()
//{
//  if (my_Serial.available() > 0) {
//
//    int c = my_Serial.read();
//    if (c == 170)
//    {
//      num = 0;
//      cal[0] = c;
//    }
//    else
//    {
//      num = num + 1;
//      cal[num] = c;
//      if (num == 6)
//      {
//        sum = cal[1] + cal[2] + cal[3] + cal[4];
//        if (sum == cal[5] && cal[6] == 255)
//        {
//          if (abs(change[1] - cal[1]) > 1 || abs(change[2] - cal[2]) > 4)
//          {
//            change[1] = cal[1];
//            change[2] = cal[2];
//            Sensor_cal = 550 * (cal[1] * 256 + cal[2]) / 1024 * 5;
//          }
//          Serial.print(cal[1]);
//          Serial.print(",");
//          Serial.println(cal[2]);
//
//          Serial.print(Sensor_cal);
//          Serial.println("ug/m3");
//          delay(100);
//          /*
//          for (int i = 0; i < 6; i++)
//           {
//           Serial.print(cal[i]);
//           Serial.print(",");
//           if (i == 5)
//           Serial.println("");
//           delay(100);
//           }
//           */
//        }
//      }
//    }
//  }
//}

void Serial_cal()
{
  cal_data = my_Serial.read();
  if ( cal_data == 170)
  {
    num = 0;
    cal[0] = cal_data;

    for ( num=1 ; num < 7; num++){
      delay(10);
      cal_data = my_Serial.read();
      cal[num] = cal_data;
    }

    //    for (int i = 0; i < 7; i++)
    //    {
    //      Serial.print(cal[i]);
    //      Serial.print(",");
    //      if (i == 6)
    //        Serial.println("");
    //    }

    if ((cal[0] == 170) && (cal[1] >= 0) && (cal[2] >= 0))
    {
      sum = cal[1] + cal[2] + cal[3] + cal[4];
      if (sum == cal[5] && cal[6] == 255)
      {
        sensor_pm_tmp = 550.0 * (256.0 * cal[1] + cal[2]) / 1024.0 * 5.0 ;

        if(sensor_pm_tmp > 0)
          sensor_cal = sensor_pm_tmp;

        Serial.print(sensor_cal);
        Serial.println("ug/m3");
      }
    }
  }
}

void updateWeatherData() {
  if (s_data == '0') {
    digitalWrite(ledPin, LOW);
  }
  else if (s_data == '1') {
    digitalWrite(ledPin, HIGH);
  }
}

void updateSensorData() {
  //获取温湿度==============================================
  am2321.read();
  sensor_tem = am2321.temperature / 10.0;
  sensor_hum = am2321.humidity / 10.0;
  sensor_light = map(analogRead(A0), 0, 1023, 0, 255);
  sensor_etoh= map(analogRead(A2), 0, 1023, 0, 30);
  Serial_cal();
}

