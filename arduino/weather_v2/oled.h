U8GLIB_SSD1306_128X64 u8g(U8G_I2C_OPT_NONE);     //设置OLED型号  
//-------字体设置，大、中、小   
#define setFont_L u8g.setFont(u8g_font_7x13)   
#define setFont_M u8g.setFont(u8g_font_fixed_v0r)   
#define setFont_S u8g.setFont(u8g_font_chikitar)   

const unsigned char bmp_tem[] U8G_PROGMEM = 
{
  0xE0,0x81,0x30,0x83,0x10,0x82,0x10,0x82,0x10,0xFA,0x10,0x82,
  0x10,0x82,0x10,0xFA,0x10,0x82,0xD0,0x82,0xD0,0xFA,0xD0,0x82,
  0xD0,0x82,0xD0,0xFA,0xD0,0x82,0xD0,0x82,0xD0,0xFA,0xD0,0x82,
  0xD0,0x82,0xD8,0x86,0xC4,0x88,0xF2,0x93,0xFB,0xB7,0xF9,0xA7,
  0xFD,0xAF,0xFD,0xAF,0xF9,0xA7,0xFA,0x97,0xF2,0x93,0xC4,0x88,
  0x18,0x86,0xF0,0x83
};

const unsigned char bmp_hum[] U8G_PROGMEM = 
{
  0x00,0x00,0x01,0x00,0x00,0x01,0x00,0x80,0x03,0x08,0x80,0x03,0x18,0x80,0x07,0x1C,
  0xC0,0x07,0x3C,0xC0,0x07,0x3E,0xE0,0x0F,0x3E,0xE0,0x0F,0x7A,0xF0,0x1F,0x7B,0xF8,
  0x1F,0x72,0xF8,0x1F,0x3E,0xF8,0x3F,0x1C,0xFC,0x3F,0x00,0xFC,0x7F,0x00,0xFE,0x7F,
  0x00,0xFE,0x7F,0x00,0xFE,0x7F,0x00,0xFF,0xFF,0x00,0xFF,0xFF,0x00,0xFF,0xFF,0x00,
  0xF3,0xFF,0x00,0xF2,0x7F,0x00,0xE6,0x7F,0x00,0xC6,0x7F,0x00,0x0E,0x3F,0x00,0x3C,
  0x1E,0x00,0xF8,0x1F,0x00,0xE0,0x07,0x00,0x80,0x01
};

const unsigned char led_on[] U8G_PROGMEM = 
{
  0x00,0x0E,0x00,0x08,0x00,0x02,0x18,0x1F,0x03,0x90,0x3F,0x01,0xC0,0x60,0x00,0x60,
  0xC0,0x00,0x30,0x80,0x01,0x37,0x80,0x1D,0x30,0x80,0x01,0x30,0x80,0x01,0x30,0x91,
  0x01,0x37,0x8E,0x1D,0x30,0x80,0x01,0x30,0x80,0x01,0x30,0x80,0x01,0x36,0x80,0x0D,
  0xF3,0xFF,0x19,0xE0,0xFF,0x00,0x80,0x31,0x00,0x80,0x31,0x00,0x80,0x31,0x00,0x80,
  0x31,0x00,0x80,0x31,0x00,0x80,0x31,0x00,0x80,0x31,0x00,0x80,0x01,0x00,0x80,0x01,
  0x00,0x80,0x01,0x00,0x80,0x01,0x00,0x80,0x01,0x00,0x80,0x01,0x00,0x00,0x00,0x00,
};

const unsigned char led_off[] U8G_PROGMEM = 
{
  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x1F,0x00,0x80,0x3F,0x00,0xC0,0x60,0x00,0x60,
  0xC0,0x00,0x30,0x80,0x01,0x30,0x80,0x01,0x30,0x80,0x01,0x30,0x80,0x01,0x30,0x91,
  0x01,0x30,0x8E,0x01,0x30,0x80,0x01,0x30,0x80,0x01,0x30,0x80,0x01,0x30,0x80,0x01,
  0xF0,0xFF,0x01,0xE0,0xFF,0x00,0x80,0x31,0x00,0x80,0x31,0x00,0x80,0x31,0x00,0x80,
  0x31,0x00,0x80,0x31,0x00,0x80,0x31,0x00,0x80,0x31,0x00,0x80,0x01,0x00,0x80,0x01,
  0x00,0x80,0x01,0x00,0x80,0x01,0x00,0x80,0x01,0x00,0x80,0x01,0x00,0x00,0x00,0x00,
};

//显示函数  
void osd_setup(int _osd_setup,char* _osd_text) {
  u8g.firstPage();  
  do {
    setFont_L;
    u8g.setPrintPos(4, 30); 
    u8g.print(_osd_text);
    u8g.drawFrame(0,48,128,14);
    if(_osd_setup)
      u8g.drawBox(0+2,48+2,map(_osd_setup,0,5,0,128-4),14-4);
  } 
  while( u8g.nextPage() );
}


//显示函数 
void volcd() {
  u8g.firstPage();
  do {
    u8g.setDefaultForegroundColor();

    u8g.drawXBMP( 4, 1, 15, 32, bmp_tem);
    u8g.drawXBMP( 70, 2, 24, 30, bmp_hum);

    setFont_M;                             //设置字体为大  
    u8g.setPrintPos(20, 16);         //设置文字开始坐标  
    u8g.print("`C ");   
    setFont_L;                             //设置字体为大  
    u8g.setPrintPos(20, 32);         //设置文字开始坐标  
    u8g.print(sensor_tem , 1);             //温度  

    setFont_M;                             //设置字体为大  
    u8g.setPrintPos(100, 16);         //设置文字开始坐标  
    u8g.print("%");   
    setFont_L;                             //设置字体为大  
    u8g.setPrintPos(100, 32);         //设置文字开始坐标  
    u8g.print(sensor_hum , 0);             //湿度  

    setFont_L;                       //设置字体
    u8g.setPrintPos(4, 49);          //设置文字开始坐标  
    u8g.print(sensor_light , 0);       //光照强度  
    setFont_M;                       //设置字体
    u8g.print(" Lux");   

    setFont_L;                       //设置字体
    u8g.setPrintPos(4, 63);          //设置文字开始坐标
    //Serial.print("pm2.5");
    //Serial.println(Sensor_cal);
    u8g.print(sensor_cal , 0);       //光照强度
    setFont_M;                       //设置字体
    u8g.print(" ug/m3");


    setFont_L;                       //设置字体
    u8g.setPrintPos(80, 49);          //设置文字开始坐标
    u8g.print(sensor_etoh , 0);       //光照强度
    setFont_M;                       //设置字体
    u8g.print(" ppm");


    setFont_M;                             //设置字体为大
    u8g.setPrintPos(80, 63);         //设置文字开始坐标
    u8g.print(" LED:");
    if (s_data == '1')
      u8g.print(" ON");
    else
      u8g.print("OFF");


    // setFont_M;                             //设置字体为大  
    // u8g.setPrintPos(98, 63);         //设置文字开始坐标  
    // if(s_data== '1')
    // {
    //   u8g.drawXBMP( 76, 38, 24, 32, led_on);
    //   u8g.print(" ON"); 
    // }
    // else
    // {
    //   u8g.drawXBMP( 76, 38, 24, 32, led_off);
    //   u8g.print("OFF"); 
    // }

  }
  while( u8g.nextPage() );
} 


void volcdsetup(char* zi,unsigned int x,unsigned int y) {
  //#ifdef OLED
  u8g.firstPage();  
  do {
    setFont_L;    
    u8g.setPrintPos(x, y); 
    u8g.print(zi);
  } 
  while( u8g.nextPage() );
  //#endif
}









