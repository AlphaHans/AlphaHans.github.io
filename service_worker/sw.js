// sw.js

// 定义缓存名称
const CACHE_NAME = 'my-request-cache-v1';

// 监听 'install' 事件，通常用于预缓存资源
self.addEventListener('install', (event) => {
    console.log('Service Worker 进入安装阶段');
    

    fetch('https://alphahans.github.io/playvideo/index.html')
                // .then(response => response.json())
                .then(data => {
                    console.log('响应数据:', data);
                })
                .catch(error => {
                    console.error('请求错误:', error);
                });
});

// 监听 'activate' 事件，清理旧缓存
self.addEventListener('activate', (event) => {
    console.log('Service Worker 进入激活阶段');

});
