# README (V0.3.2)

# What's New

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

4. 启动Server， 命令为 ：

		meteor

### 创建 mCotton 的账号

1. 访问 http://localhost:3000 , 用你的邮箱注册一个账号。此账号后面还需要使用。
2. 使用此账号登陆

例如，此账号可以为：

    var useremail = "iasc@163.com", pwd = "123456";

![docs/mcotton_01.png](docs/mcotton_01.png)

# Projects

## Wifi气象站

详情参见 [weather_station.md](docs/weather_station.md)

## 我的城市

详情参见 [my_city.md](docs/my_city.md)

## Smart Vulture Egg

详情参见 [egg.md](docs/egg.md)