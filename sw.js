const CACHE_NAME = "trackme-v1";

const urlsToCache = [
    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    "./manifest.json"
];

self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
    );

});

self.addEventListener("fetch", event => {

    event.respondWith(
        caches.match(event.request)
        .then(response => {

            return response || fetch(event.request);

        })
    );

});

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./sw.js")
            .then(() => {
                console.log("TrackMe ready");
            })
            .catch(err => {
                console.log(err);
            });

    });

}