//This goes in service-worker.js
const APP_PREFIX = "budgetTracker-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
  //files to be cashed by service worker
  "/",
  "./index.html",
  "./js/index.js",
  "./css/styles.css"
];

self.addEventListener("install", function (e) {//self refers to service worker object
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("installing cache : " + CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

//This goes in service-worker.js
//activate service worker
self.addEventListener('activate', function(e) {
    e.waitUntil(
      caches.keys().then(function(keyList) { //.keys() returns an array of all cache names which we're calling keyList
        let cacheKeepList = keyList.filter(function(key) {
          return key.indexOf(APP_PREFIX);
        });
        cacheKeepList.push(CACHE_NAME);
  
        return Promise.all(
          keyList.map(function(key, i) {
            if (cacheKeepList.indexOf(key) === -1) {
              console.log('deleting cache : ' + keyList[i]);
              return caches.delete(keyList[i]);
            }
          })
        );
      })
    );
  });

  //this code goes in service-worker.js
  //offline functionality
  self.addEventListener('fetch', function (e) {
      console.log('fetch request : ' + e.request.url)
      e.respondWith(
          caches.match(e.request).then(function (request) {
              if (request) {
                  console.log('responding with cache : ' + e.request.url)
                  return request
              } else {
                  console.log('No file matching request found in cache.  Fetching : ' + e.request.url)
                  return fetch(e.request)
              }
          })
      )
  })