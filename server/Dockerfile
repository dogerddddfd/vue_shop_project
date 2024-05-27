FROM node:latest
WORKDIR /home/WORKDIR/
EXPOSE 8888
COPY package.json /home/WORKDIR/
# RUN npm config set registry https://npm.aliyun.com \
#    && npm install 
RUN npm install
COPY . /home/WORKDIR/
CMD ["node","./app.js"]