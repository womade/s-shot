:: 将容器的3000端口 映射到宿主机的8088端口 后续通过127.0.0.1:8088即可访问服务
docker run -d -p 8088:3000 --name s-shot womade/s-shot

pause
