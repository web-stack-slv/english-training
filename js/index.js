document.addEventListener('DOMContentLoaded', () => {
    new SpaceTrip({
        canvasId: 'space-canvas',
        gameContainerId: 'game-wrapper',
        data: getData(),
        imgDir: 'img',
        audioDir: 'audio',
        audioOn: true,
        callbackFinished: () => {window.location.reload();}
    });
});

function getData() {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            resolve(words);
        }, 5000);
    });
}

