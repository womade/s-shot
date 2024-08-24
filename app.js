const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const util = require('util');

const app = express();
const port = 3030;

// 将 fs.mkdir() 转换为返回 Promise 的函数
const mkdir = util.promisify(fs.mkdir);

// 定义一个延迟函数，返回一个Promise
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 清理过期截图的函数
async function cleanUpScreenshots() {
  const directoryPath = path.join(__dirname, 'screenshot');

  if (!fs.existsSync(directoryPath)) {
    return; // 如果目录不存在，则直接返回
  }

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Unable to scan the directory: ' + err);
      return;
    }

    // 遍历所有文件
    files.forEach(file => {
      const filePath = path.join(directoryPath, file);
      const fileStat = fs.statSync(filePath);

      // 获取文件的最后修改时间
      const lastModified = fileStat.mtime;
      const now = new Date();
      const timeDiffInSeconds = Math.floor((now - lastModified) / 1000);

      // 检查文件是否超过24小时
      if (timeDiffInSeconds > 24 * 60 * 60) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file: ' + err);
          } else {
            console.log(`Deleted old file: ${filePath}`);
          }
        });
      }
    });
  });

app.get('/screenshot', async (req, res) => {
  try {
    // 获取UA
    const userAgent = req.headers['user-agent'];

    // 启动浏览器
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox'],
    });

    // m 支持 = file 直接返回截图文件
    const { url = 'https://i.ssss.fun', w: width = 1920, h: height = 1080, m = 'json', t: delaySec = 10 } = req.query;

    // 创建一个新页面
    const page = await browser.newPage();

    // 导航到指定网址
    await page.goto(url);

    // 等待页面加载完成
    await page.waitForSelector('body');

    // 将秒数转换为毫秒数
    const delayMs = delaySec * 1000;

    // 添加可配置的延迟时间
    await delay(delayMs); // 使用请求参数中的延迟时间，单位已转换为毫秒

    // 设置视口大小为全屏
    await page.setViewport({ width: +width, height: +height });

    // 生成不重复的文件名
    const filename = `screenshot_${Date.now()}.png`;

    const baseDir = 'screenshot';

    // 不存在则新建
    if(!(fs.existsSync(baseDir) && fs.statSync(baseDir).isDirectory())) {
      await mkdir(baseDir);
    }

    // 截图文件的路径
    const imagePath = path.join(__dirname, 'screenshot', filename);

    // 进行页面截图 放到根目录 screenshot 文件夹下
    const screenshotBuffer = await page.screenshot();

    // 指定保存路径并将截图保存为文件
    fs.writeFileSync(imagePath, screenshotBuffer);

    // 关闭浏览器
    await browser.close();

    // 直接返回文件
    if (m === 'file') {
      res.sendFile(imagePath);
      return;
    }
    // 默认返回json
    res.json({ screenshot_path: imagePath, userAgent, resolution: `${width}x${height}`, screenshot: screenshotBuffer.toString('base64') });
  } catch (error) {
    console.debug(error);
    res.status(500).send(`Error capturing screenshot, ${error.toString()}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});