if('serviceWorker' in navigator){
    console.log('SW OK!');
//install SW
    navigator.serviceWorker.register('/js/main.js')
    .then(() => console.log('SW Registered!'))
    .catch((error) => console.log('SW Registration Error',error));

}else{
    console.log('SW Does Not Exist!');
}
