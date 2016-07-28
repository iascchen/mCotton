# README (V0.3.3)

This project is deprecated.

According Meteor is hard to support the pressure from
 IoT devices, I will rewrite it with Express and React, and add more awesome features.

The new project will be stored on mCottonExp.

因为 meteor 在大数据压力下表现不太好,所以计划重写 mCotton , 新的服务器会放在 mCottonExp 中.

# What's New

v 0.3.3, 20160728

This project is deprecated.

Tested on meteor 1.4.

Account admin has bug. If you want to set your admin, you can change the file : /app/server/fixtures.js

v 0.3.2, 20160415

1. Better UI
2. Update to meteor 1.3.1
3. Update Vulture Egg to latest Webgl
4. Better Performance
5. Device data dump.

v 0.3.1, 20151117

1. Share device to public
2. Integration Map for all public device, and for project
3. WebGL smart Egg
4. Update UX of devices and projects

v 0.3

1. Support MQTT
2. Admin can edit Modules, Projects, and Devices.
3. Add mCotton introduce in Home page.

# To DO

[todo.md](todo.md)

# How to Start

## mCotton 安装使用方法

mCotton 是 server ， httpclient*.js 是访问他的Node.js客户端

### 快速安装 mCotton Server（Develop Mode）

1. 安装 meteor， 命令为： 

		curl https://install.meteor.com | sh

2. 展开 mCotton.zip ，并 进入 mCotton 目录

3. 更新meteor， 执行:

		meteor update

4. 安装所需的 NPM 包在安装过程中, mosca 会出现安装 zmq 相关的问题, 这个不必理会.

		meteor npm install

5. 修改 /app/lib/collections/0_fsstore.js, 修改 SYS_BASE 为您本地可以访问的一个目录,用于存储上传的图片文件.

        // SYS_BASE = "/data";     // all upload images and files will be stored in this folder, please make sure you have access rights.
        SYS_BASE = "/Users/yourhome/folder";

6. 启动Server， 命令为 ：

		meteor

7. Reset MongoDB

        meteor reset

### 创建 mCotton 的账号

1. 访问 http://localhost:3000 , 用你的邮箱注册一个账号。此账号后面还需要使用。
2. 使用此账号登陆

例如，此账号可以为：

    var useremail = "iasc@163.com", pwd = "123456";

![docs/mcotton_01.png](docs/mcotton_01.png)

** On meteor 1.4, Account admin has bug and can't used.
If you want to set your admin, you can change the file : /app/server/fixtures.js

# Projects

## Wifi气象站

详情参见 [weather_station.md](docs/weather_station.md)

## 我的城市

详情参见 [my_city.md](docs/my_city.md)

## Smart Vulture Egg

详情参见 [egg.md](docs/egg.md)