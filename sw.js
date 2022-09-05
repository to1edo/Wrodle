const nameCache = 'wordle-v1';
const files = [
    '/',
    './index.html',
    './error.html',
    './styles.css',
    './dictionary.json',
    './app.js',
    './appSW.js'
];


//se ejecuta cuando se intala el service worker
self.addEventListener('install', e=>{
    
    e.waitUntil( 
        caches.open(nameCache)  //crear el cache
            .then( cache =>{
                cache.addAll(files);
            })
    )

});

//se ejecuta cuando se activa el service worker
self.addEventListener('activate',e=>{

    e.waitUntil(
        caches.keys() //diferentes versiones del cache
            .then( keys => {
                
                return Promise.all(
                    keys.filter( key => key !== nameCache )
                        .map( key => caches.delete(key)) //borra las versiones antiguas del cache
                )
            })
    )
});


//evento fetch para descargar archivos estaticos

self.addEventListener('fetch', e => {

    e.respondWith(
        caches.match(e.request)//accesar a los archivos en cache
        .then(cacheResponse => (cacheResponse ? cacheResponse : caches.match('error.html'))) // si no mostrar pagina de error

    )
})