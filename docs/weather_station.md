# mCotton

Here are the step by step tutorial.

## On Azure Action

http://mcotton-01.chinacloudapp.cn 

1. You should create a new account with a email to login the site.
2. Please Click the menu if “AppKits”, and look for “Weather Station” , then click the Button “Assemble to My Devices”. Git your new device a name.
3. Refresh the page of “My Devices”,  You will find a new device had been added.
4. Record the device ID.

## On Microduino IDE,

5. Download the attachment program.

6, Open Arduino IDE( Please use Micrduino Version, more details info https://www.microduino.cc/wiki/index.php?title=Microduino_Getting_started/zh  ), 
7. change the def.h. 

      #define WLAN_SSID       "YourSSID"        // Please change it. cannot be longer than 32 characters!
      #define WLAN_PASS       "YourPassword"    // Please change it. 

      String device_id="YourDeviceID";      // Please change it. 

8. Connect your PC and weather station by USB line, in this step you need USBTTL/R232 module.
9. Build and upload program to Microduino.
10. Wait and find the device can show weather info in LED.
11. Look your weather info on mCotton, and look the data chart.  