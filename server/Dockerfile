FROM node:latest
WORKDIR /home/WORKDIR/
EXPOSE 8888
COPY . /home/WORKDIR/
RUN npm config set registry https://npm.aliyun.com \
   && npm install 
CMD ["node","./app.js"]