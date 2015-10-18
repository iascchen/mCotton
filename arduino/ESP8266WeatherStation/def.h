
 SoftwareSerial mySerial(2, 3); // RX, TX

//#define esp8266Serial mySerial
#define esp8266Serial Serial1

#define INTERVAL_NET             3000 
#define INTERVAL_LCD             3000             //定义OLED刷新时间间隔  
#define INTERVAL_SENSOR          1000  

#define WEBSITE "mcotton.microduino.cn"

const int websitePort=8080;

#define WEBPAGE "/api/v1.0/d"

AM2321 am2321;

String device_id="qwaBFu7se48GNAD3q";

char serialbuffer[1000];//serial buffer for request url
char inChar;

unsigned long net_time = millis();  
unsigned long lcd_time = millis();                 //OLED刷新时间计时器  
unsigned long sensor_time = millis();  

String dataToSend;
String startcommand;
String sendcommand;
String dataToRead="";

bool isRecord=false;

int start=0;
int end=0;

char buf[10];

float sensor_tem, sensor_hum,sensor_light,Sensor_etoh; //温度、湿度,光照,PM2.5,甲烷
