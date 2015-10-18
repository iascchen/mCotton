#define INTERVAL_LCD             100              //定义OLED刷新时间间隔  
#define INTERVAL_SENSOR          3000             //定义传感器采样时间间隔  
#define INTERVAL_NET             30000            //向云端上传数据时间间隔, 
#define IDLE_TIMEOUT_MS          1000 
#define INTERVAL_BUTTON          1000

//#define WLAN_SSID       "YourSSID"        // Please change it. cannot be longer than 32 characters!
//#define WLAN_PASS       "YourPassword"    // Please change it. 
//
//String device_id="YourDeviceID";      // Please change it.

#define WLAN_SSID       "Makermodule"        // Please change it. cannot be longer than 32 characters!
#define WLAN_PASS       "microduino"    // Please change it.  

String device_id="sctepumxLP7i6mh5g";      // Please change it.

//#define WEBSITE "mcotton-01.chinacloudapp.cn"
//#define WEBSITEPORT 80

#define WEBSITE "192.168.190.140"
#define WEBSITEPORT 3000

uint32_t ip;

Adafruit_CC3000_Client www;


#define WEBPAGE "/api/v1.0/d"
#define WEBUTTONPAGE "/api/v1.0/ce"

bool NET_WEBSITE_sta;
bool stopFlag=false;

int lastButtonState = 1;         // variable for reading the pushbutton status

const int buttonPin = 6;     // the number of the pushbutton pin
const int ledPin =  5;      // the number of the LED pin

bool buttonState = false;         // variable for reading the pushbutton status

bool statusChange=false;

bool led_sta=false;
char s_data;
char buf[10];
char c;

int start=0;
int end=0;

String returnStateData;
String stateValue;
//char returnCharArray[200];

//3,传感器值的设置  
float sensor_tem, sensor_hum, sensor_alt, sensor_pre, sensor_lux; //温度、湿度、海拔、气压、光照  

unsigned long lcd_time = millis();                 //OLED刷新时间计时器  
unsigned long sensor_time = millis();             //传感器采样时间计时器  
unsigned long net_time = millis();             //计时器  
unsigned long button_time = millis();             //计时器  

String dataToSend;
