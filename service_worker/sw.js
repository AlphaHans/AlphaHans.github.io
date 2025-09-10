// sw.js

// 定义缓存名称
const CACHE_NAME = 'my-request-cache-v1';

// 监听 'install' 事件，通常用于预缓存资源
self.addEventListener('install', (event) => {
    console.log('Service Worker 进入安装阶段');
});

// 监听 'activate' 事件，清理旧缓存
self.addEventListener('activate', (event) => {
    console.log('Service Worker 进入激活阶段');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('删除旧缓存:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});


// 监听 'fetch' 事件
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    if (url.pathname === '/') {
        event.respondWith(
        // 直接发起网络请求
        fetch(event.request)
            .then((networkResponse) => {
            // 网络请求成功，检查响应是否有效
            if (networkResponse && networkResponse.status === 200) {
                // 由于Response对象是流，只能使用一次，必须克隆一份用于缓存
                const responseToCache = networkResponse.clone();
                // 将最新响应存入缓存，以便后续使用
                caches.open(CACHE_NAME)
                .then((cache) => {
                    cache.put(event.request, responseToCache);
                });
            }
            // 无论是否缓存，都将最新的网络响应返回给页面
            return networkResponse;
            })
        );
    }
});