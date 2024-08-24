# 使用 puppeteer 进行网站截图 并返回

### 1.本地node环境直接使用

```bash
npm install
node app.js
```

服务启动后 访问 <YOUR_IP>:3030/screenshot?url=https://www.ssss.fun&w=2560&h=1440&w=1920&h=1080

```javascript
url: 要进行截图的网站地址
w: 截图视口的宽度
h: 截图视口的高度
m: json | file 默认json 返回的形式可以是json形式或者直接是图片
t: 等待时长（秒）
```

例如:

>json形式返回

`http://127.0.0.1:3030/screenshot?url=https://www.ssss.fun&w=2560&h=1440`

>文件形式返回

`http://127.0.0.1:3030/screenshot?url=https://www.ssss.fun&w=2560&h=1440&m=file`


### 2.docker环境使用(推荐)

使用docker构建容器（注意的是映射端口，服务启动在容器的3030端口，需要映射到本地），具体查看 **[build-container.cmd](https://github.com/womade/s-shot/blob/main/build-container.cmd)** 文件)。

docker buildx create --name multi-platform --use --platform linux/arm,linux/arm64,linux/amd64 --driver docker-container

docker buildx build -t womade/s-shot --platform linux/arm,linux/arm64,linux/amd64 . --push
