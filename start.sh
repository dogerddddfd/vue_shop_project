#!/bin/sh
# 启动网页开发环境
# 进入到docker-compose.yaml文件所在的目录


# 使用docker-compose命令启动服务
docker-compose up -d

cd ./vue_shop_project

npm run serve