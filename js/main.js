const staticAsset = [
                '/css/main.css/',
                '/js/main.js',
                'https://code.jquery.com/jquery-3.3.1.slim.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js',
                'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js',
                'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
            ]

const version = '0.0.1'
const cacheName = `AnangM-${version}`

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(staticAsset)
                .then(() => self.skipWaiting());
        }));
});

self.addEventListener('activate', function (event) {
    function deleteOldCache() {
        return caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames
                .filter(persistedCacheName => persistedCacheName != cacheName)
                .map(persistedCacheName => {
                    console.log(persistedCacheName)
                    return caches.delete(persistedCacheName)
                })
            )
        )
    }
    event.waitUntil(deleteOldCache())
})

self.addEventListener('fetch', function (event) {
    function getFromCache() {
        return caches.match(event.request.clone())
            .then((response) => {
                if (response) {
                    return response
                }

                return fetch(event.request.clone())
                    .then((response) => {
                        if (!response || response.status !== 200) {
                            return response
                        }

                        const clonnedResponse = response.clone()
                        caches.open(cacheName).then(cache => {
                            cache.put(event.request.clone(), clonnedResponse)
                        })
                        return response
                    })
            })
    }
    event.respondWith(getFromCache())
})