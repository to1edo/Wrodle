if( 'serviceWorker' in navigator){

    navigator.serviceWorker.register('./sw.js')
        .then( registrado => console.log('Done SW'))
        .catch(error => console.log(error));

}