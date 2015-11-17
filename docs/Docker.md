# 生成Docker Image
Docker容器基于[meteorhacks/meteord:onbuild](https://hub.docker.com/r/meteorhacks/meteord/)，相关说明请登录其[介绍页面](https://hub.docker.com/r/meteorhacks/meteord/)查看。

1. 下载最新mCotton源代码

        git clone https://github.com/iascchen/mCotton.git
        
2. 进入mCotton目录
3. 生成Docker Image

        docker build -t mcotton .



# 通过Docker运行Docker Image

## 启动MongoDB数据库

MongoDB数据库可使用第三方提供的数据库，或者通过Docker容器本地部署，这里为了演示方便使用[tutum/mongodb](https://hub.docker.com/r/tutum/mongodb/)部署。

    docker run -d --name mongodb -v /data/db:/data/mongodb -e AUTH=no tutum/mongodb

其中`-v /data/db:/data:mongodb`用于MongoDB数据库本地存储，`-e AUTH=no`为演示方便关闭验证。

## 启动mCotton服务

    docker  run -d --name mcotton -e ROOT_URL=http://example.com:3000 --link mongodb:mongo -e MONGO_URL=mongodb://mongo -p 3000:80 mcotton

容器运行相关指令可查看[meteorhacks/meteord介绍页面](https://hub.docker.com/r/meteorhacks/meteord/)，这里`ROOT_URL`用于指定访问该项目的最终网址；`--link mongodb:mongo -e MONGO_URL=mongodb://mongo`用于指定MongoDB数据库服务器，根据具体需要指定；`-p 3000:80`用于将容器内部服务映射到外部主机端口。

如果最终我们希望通过http://example.com访问该服务，通过apache/ngnix代理，以下以apache配置为例。

1. 启动mCotton服务

        docker  run -d --name mcotton -e ROOT_URL=http://example.com --link mongodb:mongo -e MONGO_URL=mongodb://mongo -p 127.0.0.1:10080:80 mcotton

2. apache服务器开启模块proxy

        a2enmod proxy proxy_http

3. 添加apache虚拟主机配置文件

        <VirtualHost *:80>
           ServerName example.com
    
           ProxyPreserveHost On
           AllowEncodedSlashes NoDecode
    
           ProxyPass / http://127.0.0.1:10080/
           ProxyPassReverse / http://127.0.0.1:10080/
    
           <Proxy *>
                   Order deny,allow
                   Allow from all
           </Proxy>
           
           # Custom log file locations
           ErrorLog  /var/log/apache2/mcotton_error.log
           CustomLog /var/log/apache2/mcotton_access.log combined
        </VirtualHost>

4. 重启apache服务器

        service apache2 restart

