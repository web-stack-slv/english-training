const words = [
    { 
        word: 'Кошка', 
        variants: [
            {word: 'Cat', isRight: true},
            {word: 'Dog', isRight: false},
            {word: 'Monkey', isRight: false},
            {word: 'Goat', isRight: false},
        ]
    },{ 
        word: 'Собака', 
        variants: [
            {word: 'Cat', isRight: false},
            {word: 'Dog', isRight: true},
            {word: 'Monkey', isRight: false},
            {word: 'Goat', isRight: false},
        ]
    },{ 
        word: 'Обезьяна', 
        variants: [
            {word: 'Cat', isRight: false},
            {word: 'Dog', isRight: false},
            {word: 'Monkey', isRight: true},
            {word: 'Goat', isRight: false},
        ]
    },{ 
        word: 'Козел', 
        variants: [
            {word: 'Cat', isRight: false},
            {word: 'Dog', isRight: false},
            {word: 'Monkey', isRight: false},
            {word: 'Goat', isRight: true},
        ]
    },{ 
        word: 'Машина', 
        variants: [
            {word: 'Cat', isRight: false},
            {word: 'Dog', isRight: false},
            {word: 'Car', isRight: true},
            {word: 'Goat', isRight: false},
        ]
    }
]

const cvs = document.getElementById('space-canvas');
const ctx = cvs.getContext('2d');
const lifes = 3;
const imgDir = 'img';

const spaceship = getImage('spaceship.png'),
assistant = getImage('assistant.png'),
fg = getImage('fg.png'),
pg = getImage('pg.png'),
startBtn = getImage('start.png'),
leftBtn = getImage('left.png'),
rightBtn = getImage('right.png'),
bg = getImage('bg.png'),
bg1 = getImage('bg.png');

let xPos, bgPos, life, scores, message, stop, walls, lifeImgs;

initState();

cvs.addEventListener('click', (e) => {    
    if (intersects(e.layerX, e.layerY, 200, 580, 20)) {
        initState();
        stop = false;
        draw();
    } else if(e.layerX > 30 && e.layerX < 130 && e.layerY > 555 && e.layerY < 600) {        
        moveLeft();
    } else if(e.layerX > 270 && e.layerX < 370 && e.layerY > 555 && e.layerY < 600) {
        moveRight();
    }
});

function intersects(x, y, cx, cy, r) {
    let dx = x-cx;
    let dy = y-cy;
    return dx*dx+dy*dy <= r*r
}

function initState() {
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    xPos = 170;
    bgPos = 0;
    life = lifes;
    scores = 0;
    message = words[0].word;
    stop = true;
    walls = words.map((word, idx) => {
        return {
            y: 0 - idx * 300,
            data: word,
            isActivated: false
        }
    });

    lifeImgs = [];
    for (let i = 0; i < lifes; i++) {
        lifeImgs.push(getImage('heart_full.png'));    
    }
}

function moveLeft() {
    xPos-=4;
    if(xPos < 0) {
        xPos = 0;
    }
}

function moveRight() {
    xPos+=4;
    if(xPos > 360) {
        xPos = 360;
    }
}

document.addEventListener('keydown', (e) =>{
    console.log(e.code);
    switch (e.code) {
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        case 'Enter':
            initState();
            stop = false;
            draw();
            break;
    }
});

function getImage(src) {
    const img = new Image();
    img.src = `${imgDir}/${src}`;
    return img;
}

function drawGalaxy(data, x, y, activated = false) {
    ctx.fillStyle = activated ? (data.isRight ? '#00FA9A' : '#DC143C') : '#FFFFFF';
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 20;      
    ctx.fillText(data.word, x, y, 100);  
}

function say(message) {
    ctx.shadowBlur=0;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '25px Verdana';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(message, 230, 60); 
}

function draw() {
    ctx.drawImage(bg, 0, bgPos);
    ctx.drawImage(bg1, 0, bgPos-864);
    
    ctx.drawImage(spaceship, xPos, 450);   
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '25px Cooper Black';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    for (let i = 0; i < walls.length; i++) {               
        walls[i].data.variants.map((word, idx) => {
            drawGalaxy(word, 50 + idx*100, walls[i].y+25, walls[i].isActivated);           
        });
        
        walls[i].y++;

        if(walls[i].y === 470) {
            walls[i].isActivated = true;
            let isFail = false;
            if(xPos < 60) {
                if(!words[i].variants[0].isRight) {
                    isFail = true;
                }
            } else if(xPos > 100 && xPos < 160) {
                if(!words[i].variants[1].isRight) {
                    isFail = true;
                }
            } else if(xPos > 200 && xPos < 260) {
                if(!words[i].variants[2].isRight) {
                    isFail = true;
                }
            } else if(xPos > 300) {
                if(!words[i].variants[3].isRight) {
                    isFail = true;
                }
            } else {
                isFail = true;
            }
                              
            if(isFail) {
                life--;

                message = 'Oh, no!';               
            } else {
                message = 'Great!';
            }

            scores++;            

            setTimeout(() => {
                message = words[scores] ? words[scores].word : '';
            }, 1500);
        }
    }

    ctx.shadowBlur=0; 

    ctx.drawImage(fg, 0, 0);
    ctx.drawImage(pg, 0, 550);
    ctx.drawImage(startBtn, 180, 555);
    ctx.drawImage(leftBtn, 30, 555);
    ctx.drawImage(rightBtn, 270, 555);
    ctx.drawImage(assistant, 5, 5);   

    lifeImgs.map((img, idx) => {
        if(lifes - idx > life) {
            img.src = `${imgDir}/heart_empty.png`;
        }
        ctx.drawImage(img, 260+25*idx, 20);
    });   
    
    bgPos++;

    if(bgPos > 864) {
        bgPos = 0;
    }

    if(scores === words.length || !life) {
        ctx.shadowBlur=0; 
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '30px Cooper Black';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';        

        if(!life) {
            message = 'Your spaceship destroyed...';      
            ctx.fillText('GAME OVER!', 200, 250);                                  
        } else if(scores === words.length) {
            message = 'Great job, captain!';
            ctx.fillText('YOU ARE WIN!', 200, 250);                
        }

        setTimeout(() => {
            stop = true;
        }, 3000);
    }

    if(!stop) {
        say(message);
        requestAnimationFrame(draw);  
    }      
}

bg1.onload = draw;
