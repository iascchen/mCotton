# 鸟蛋的使用

## mCotton 云端配置

1. 到 mcotton.microduino.cn 注册一个账号。
2. 通过菜单 Projects 显示 Projects 列表。在列表中分别选择 “Vulture Egg” 、 “Vulture Egg  Station” 的 “Made It” 按钮，创建两个新的设备。
3. 通过菜单 My Devices 显示 Devices 列表，能够看到这两个设备。记录下这两个设备的 Device ID。

## mCotton Android 中继端设置

1. 在Android 4.4上安装 Vulture Egg 中继程序。
2. 选择右上角菜单，通过“Setting”，选择要连接的服务器是： mcotton.microduino.cn(In China) or mcotton.microduino.cc(Out of China)。
3. 选择右上角菜单，通过“Add Device”，选择对应的 BLE Address，分别增加 Egg，以及 Station。 因为都是蓝牙设备，建议分别加电，这样不会错。增加设备之后,可以在App上选择此设备的名字、类型, App 自动从 mCotton 或缺的 Device ID（这个Device ID 是表明 APP向那个设备上传数据的Key）。
4. 设置正确后，返回 Vulture Egg 中继程序 主页面，点击右上角菜单的 Start 按钮，此时所添加设备收集到的数据开始收集并向Server上传（最多不要添加超过4个设备）。

## mCotton 云端数据观察

1. 在云端通过菜单 My Devices 进入相应的设备详情后，应该能够看到最新收集的数据不断变化。
2. 点按数据区域的蓝色图标，可以进入数据可视化显示部分。
3. 可以 Dump 该设备当日 0 时之前的所有数据. 目前此数据格式为 json .

* 进入气象站的数据可视化，会显示时序数据图表，可以通过鼠标选择需要显示的时间范围，以及通过图例的小圆点显示或隐藏线条。
* 进入鸟蛋的数据可视化，能够看到鸟蛋的姿态变化。能够通过左侧的交互区切换鸟蛋外部蛋壳、内部温度热力图渲染；设置热力图的色彩区间和显示的数据范围。鼠标放到左侧温度数据上时，能够在鸟蛋上闪烁示意传感器位置。右侧鸟蛋区域也可以通过鼠标拖拽、放大缩小鸟蛋。

