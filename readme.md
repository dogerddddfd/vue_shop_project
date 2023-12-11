# 电商项目--豪华升级版 v2

* 优化前端页面，生成的dist可以用服务器访问打开啦！再也不用`npm run serve`啦！
* 使用docker运行mysql和node服务器，再也不用就一个前端工程文件啦！
* 用docker-compose一键运行，再也不用复制黏贴一长条`ducker run`啦！

# 用法
### 依赖安装
* node,npm
* [docker](https://www.docker.com/)，[docker compose](https://docs.docker.com/compose/)
* node_modules安装
```sh
# vue_shop
   cd server
   npm i
   cd ../vue_shop_project
   npm i
```
推荐使用镜像
```sh
   npm config set registry https://npm.aliyun.com
   npm config set registry https://registry.npmmirror.com
```

### 启动
```sh
# vue_shop
   docker-compose up -d
```

* 或不用docker-compose：
```sh
# vue_shop
# 创建docker网络
   docker networks create d bridge  vue-shop-net
# 创建卷
   docker volume create vue-shop_shop-db-volume
# 创建镜像
   cd mysql
   docker build -t shop-mysql
   cd ../server
   docker build -t shop-server
# 启动容器
   docker run -itd  --name shop-mysql -p 3306:3306 -v vue-shop_shop-db-volume:/var/lib/mysql --network vue-shop-net shop-mysql
   docker run -itd --name shop-server -p 8888:8888 --network vue-shop-net shop-server
```

### 访问
* 127.0.0.1:8888/home

# [项目来源：黑马程序员](https://www.bilibili.com/video/BV1x64y1S7S7/)
