# 使用指定的 Node.js 版本 16.19.1 镜像作为基础镜像
FROM node:20.17.0

# 设置容器内的工作目录
WORKDIR /usr/src/app/s-shot

# 复制 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装 Node.js 依赖
RUN npm install

# 复制应用程序源代码到工作目录
COPY . .

# Expose 命令用于声明容器将监听的网络端口
EXPOSE 3030

# 更新 && 安装浏览器套件
RUN apt-get update && apt-get install -y chromium
RUN apt-get update && apt-get install -y fonts-noto fonts-wqy-zenhei
RUN export LANG=zh_CN.UTF-8 && export LC_ALL=zh_CN.UTF-8

# 启动 Node.js 应用
CMD [ "node", "app.js" ]
