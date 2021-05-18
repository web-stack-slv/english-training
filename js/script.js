function SpaceTrip(options) {
    /*
    {
        canvasId: string,
        data: [],
        callbackSuccess: func (){}
        callbackFailure: func (){}
        callbackFinished: func (){}
        lifes
        speed
        imgDir
        audioDir
    }
    */

    let audioOn = options.audioOn ? options.audioOn : false;

    const canvasId = options.canvasId && typeof options.canvasId === 'string' ? options.canvasId : null;
    if(!canvasId) {
        console.error('No defined/invalid canvas id.');
        return;
    }

    const data = options.data && Array.isArray(options.data) && options.data.length > 0 ? options.data : null;    

    if(!data) {
        console.error('No defined/invalid list of tasks.');
        return;
    }

    const imgDir = options.imgDir && typeof options.imgDir === 'string' ? options.imgDir : null;
    if(!imgDir) {
        console.error('No defined/invalid image resources path.');
        return;
    }

    const audioDir = options.audioDir && typeof options.audioDir === 'string' ? options.audioDir : null;
    if(!audioDir) {
        audioOn = false;
    }    

    const callbackSuccess = options.callbackSuccess && typeof options.callbackSuccess === 'function' ? options.callbackSuccess : function(){};
    const callbackFailure = options.callbackFailure && typeof options.callbackFailure === 'function' ? options.callbackFailure : function(){};
    const callbackFinished = options.callbackFinished && typeof options.callbackFinished === 'function' ? options.callbackFinished : function(){};

    const cvs = document.getElementById(canvasId);
    const ctx = cvs.getContext('2d');
    
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    const lifes = options.lifes && typeof options.lifes === 'number' && options.lifes > 0 ? options.lifes : 3;
    const speed = options.speed && typeof options.speed === 'number' && options.speed > 0 ? options.speed : 1;

    const spaceWidth = cvs.width;
    const spaceHeight = cvs.height;
    const shipWidth = 40;

    const spaceship = getImage('spaceship.png'),
    assistant = getImage('assistant.png'),
    fg = getImage('fg.png'),
    bg = getImage('bg.png'),
    bg1 = getImage('bg.png'),
    spaceAudio = getAudio('space.mp3'),
    shipAudio = getAudio('ship.mp3'),
    destroyAudio = getAudio('destroy.mp3'),
    greatJobAudio = getAudio('great_job.mp3'),
    ohNoAudio = getAudio('oh-no.mp3'),
    failAudio = getAudio('fail.mp3'),
    greatAudio = getAudio('great.mp3');

    let shipX = Math.floor((spaceWidth - shipWidth)/2),
    centerX = Math.floor(spaceWidth / 2),
    centerY = Math.floor(spaceHeight / 2),
    pipeWidth = Math.floor(spaceWidth / data[0].variants.length),
    progress = 0,
    bgY = 0,
    message = data[0].word,
    stop = true,
    life = lifes,
    hearts = getHearts(),
    pipes = getPipes(),
    isStarted = false,
    holding = false,
    gameFinished = false;;

    document.addEventListener('keydown', (e) =>{
        e.preventDefault();	
        e.stopPropagation();
        switch (e.code) {
            case 'ArrowLeft':
                moveLeft();
                break;
            case 'ArrowRight':
                moveRight();
                break;
            case 'Enter':
                if(!isStarted) {
                    isStarted = true;
                    stop = false;
                    draw();
                } else if(isStarted && stop) {
                    callbackFinished();
                    document.location.reload();
                }                
                break;
        }
    });

    cvs.addEventListener('mouseup', (e) => {
        holding = false;
    });
    
    cvs.addEventListener('touchend', (e) => {
        holding = false;
    });

    cvs.addEventListener('mousedown', (e) => {
        e.preventDefault();	
        e.stopPropagation();

        const coord = mouseXY(e);

        const x = coord.x,
        y = coord.y;

        if(!isStarted && intersects(x, y, centerX, centerY, 60)) {
            isStarted = true;
            stop = false;
            draw();
            if(audioOn) {
                spaceAudio.addEventListener('ended', () => spaceAudio.play()); 
                spaceAudio.play();
            }           
        } else if(isStarted && stop && intersects(x, y, centerX, centerY+50, 60)) {
            callbackFinished();
            document.location.reload();
        } else if(!stop && isStarted && y > spaceHeight - 120) {
            e.preventDefault();	
            e.stopPropagation();
            moveShip(x);
        }
    });
    
    cvs.addEventListener('touchstart', (e) => {        
        e.preventDefault();	
        e.stopPropagation();        
        if(!e.changedTouches[0]) return;
        const coord = touchXY(e);

        const x = coord.x,
        y = coord.y;

        if(!isStarted && intersects(x, y, centerX, centerY, 60)) {
            isStarted = true;
            stop = false;
            draw();
            if(audioOn) {
                spaceAudio.addEventListener('ended', () => spaceAudio.play()); 
                spaceAudio.play();
            } 
        } else if(isStarted && stop && intersects(x, y, centerX, centerY+50, 60)) {
            callbackFinished();
            document.location.reload();
        } else if(!stop && isStarted && y > spaceHeight-120) {            
            moveShip(x);
        }
    });

    function moveShip(x) {        
        holding = true;
        const setIntervalId = setInterval(() => {
            if (!holding) clearInterval(setIntervalId);
            if(x < centerX) {                
                moveLeft();
            } else {
                moveRight();
            }
        }, 50);
    }

    function touchXY(e) {
        x = e.targetTouches[0].pageX - cvs.offsetLeft;
        y = e.targetTouches[0].pageY - cvs.offsetTop;
        return {x,y}
    }

    function mouseXY(e) {
        x = e.pageX - cvs.offsetLeft;
        y = e.pageY - cvs.offsetTop;
        return {x,y}
    }


    function intersects(x, y, cx, cy, r) {
        let dx = x-cx;
        let dy = y-cy;
        return dx*dx+dy*dy <= r*r
    }

    function moveLeft() {
        shipX -= speed*4;
        if(shipX < 0) {
            shipX = 0;
        }
        if(audioOn) shipAudio.play();        
    }
    
    function moveRight() {
        shipX += speed*4;
        if(shipX > spaceWidth - shipWidth) {
            shipX = spaceWidth - shipWidth;
        }
        if(audioOn) shipAudio.play();
    }

    function getImage(src) {
        const img = new Image();
        img.src = `${imgDir}/${src}`;
        return img;
    }

    function getAudio(src) {
        const audio = new Audio(`${audioDir}/${src}`);
        return audio;
    }

    function drawGalaxy(cfg, x, y, activated = false) {
        ctx.fillStyle = activated ? (cfg.isRight ? '#00FA9A' : '#DC143C') : '#FFFFFF';
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 20;
        ctx.font = '25px Cooper Black';   
        ctx.fillText(cfg.word, x, y, pipeWidth);
    }

    function getPipes() {
        return data.map((word, idx) => {
            return {
                y: 0 - idx * centerY,
                data: word,
                isActivated: false,
                result: null
            }
        });
    }

    function getHearts() {
        return Array(lifes).fill(0)
            .map(_ => getImage('spaceship_life.png'))
    }

    
    function say(message) {
        ctx.shadowBlur=0;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '20px Verdana';
        ctx.fillText(message, centerX, 60);
    }

    function checkGalaxy(shipX, data) {
        let pipeNumber;        
        if(shipX < pipeWidth - shipWidth) {
            pipeNumber = 1;
        } else if(shipX > pipeWidth && shipX < 2*pipeWidth-shipWidth) {
            pipeNumber = 2;
        } else if(shipX > 2*pipeWidth && shipX < 3*pipeWidth-shipWidth) {
            pipeNumber = 3;
        } else if(shipX > 3*pipeWidth) {
            pipeNumber = 4;
        }

        return pipeNumber ? !data.variants[pipeNumber-1].isRight : true;
    }

    function drawStartButton() {
        ctx.shadowBlur=0;
        ctx.fillStyle = '#FFA500';
        ctx.font = '30px Cooper Black';
        ctx.fillText('START', centerX, centerY);
        ctx.beginPath();            
        ctx.arc(centerX, centerY, 60, 0, 2 * Math.PI, false);
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 5;
        ctx.stroke();
    }

    function drawFinishButton() {
        ctx.shadowBlur=0;
        ctx.fillStyle = '#FFA500';
        ctx.font = '30px Cooper Black';
        ctx.fillText('EXIT', centerX, centerY+50);
        ctx.beginPath();            
        ctx.arc(centerX, centerY+50, 60, 0, 2 * Math.PI, false);
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 5;
        ctx.stroke();
    }

    function drawControlButton(x,y) {
        ctx.shadowBlur=0;
        ctx.beginPath();            
        ctx.arc(x, y, 40, 0, 2 * Math.PI, false);            
        ctx.strokeStyle = '#2F4F4F';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    function drawStar(cx,cy,spikes,outerRadius,innerRadius, type){
        let rot=Math.PI/2*3,
            x=cx,
            y=cy,
            step=Math.PI/spikes;
  
        ctx.beginPath();
        ctx.moveTo(cx,cy-outerRadius)
        for(i=0;i<spikes;i++){
          x=cx+Math.cos(rot)*outerRadius;
          y=cy+Math.sin(rot)*outerRadius;
          ctx.lineTo(x,y)
          rot+=step
  
          x=cx+Math.cos(rot)*innerRadius;
          y=cy+Math.sin(rot)*innerRadius;
          ctx.lineTo(x,y)
          rot+=step
        }
        ctx.lineTo(cx,cy-outerRadius);
        ctx.closePath();
        ctx.lineWidth=1.5;        
        if(type) {
            ctx.strokeStyle = type === 'success' ? '#DAA520' : '#DCDCDC';
            ctx.stroke();
            ctx.fillStyle = type === 'success' ?  '#FFFF00' : '#D3D3D3';
            ctx.fill();
        } else {
            ctx.strokeStyle='#DCDCDC';
            ctx.stroke();
        }     
      }

    function draw() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);  
        ctx.drawImage(bg, 0, bgY,  cvs.width, bg.height);
        ctx.drawImage(bg1, 0, bgY-bg.height,  cvs.width, bg.height);        
        ctx.drawImage(spaceship, shipX, spaceHeight - 120);
        const startGapX = Math.floor(spaceWidth/(pipes.length + 1));
        const galaxyGapX = Math.floor(spaceWidth/(words[0].variants.length + 1));

        pipes.map((pipe, idx) => {
            drawStar(startGapX + idx*startGapX,100,5,10,5, pipe.result);
        });        
    
        if(!gameFinished) {
            for (let i = 0; i < pipes.length; i++) {               
                pipes[i].data.variants.map((word, idx) => {
                    const galaxyGapY = 15*(idx%2 === 0 ? 1:-1);
                    drawGalaxy(word, galaxyGapX + idx*galaxyGapX, pipes[i].y+galaxyGapY, pipes[i].isActivated);           
                });
                
                pipes[i].y++;
        
                if(pipes[i].y === spaceHeight - 110) {
                    pipes[i].isActivated = true;
                    const isFail = checkGalaxy(shipX, words[i]);           
                                      
                    if(isFail) {
                        life--;
                        pipes[i].result = 'fail';
                        hearts.splice(0,1);
                        message = 'Oh, no!';
                        if(audioOn) {
                            failAudio.play();
                            ohNoAudio.play();
                        }                        
                        callbackFailure();
                    } else {
                        message = 'Great!';
                        if(audioOn) greatAudio.play();
                        pipes[i].result = 'success';
                        callbackSuccess();
                    }
        
                    progress++;            
        
                    setTimeout(() => {
                        message = words[progress] ? words[progress].word : '';
                    }, 1500);
                }
            } 
        }          
        
        ctx.shadowBlur=0;
        ctx.drawImage(fg, 0, 0, cvs.width, 90);
        ctx.drawImage(assistant, 5, 5);
    
        hearts.map((img, idx) => {
            ctx.drawImage(img, spaceWidth - 25 - 25*idx, 15);            
        });   
        
        bgY++;
    
        if(bgY > 864) {
            bgY = 0;
        }
    
        if(!gameFinished && (progress === words.length || !life)) {
            gameFinished = true;
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '30px Cooper Black';       
            
            if(!life) {
                message = 'Spaceship destroyed...';
                if(audioOn) destroyAudio.play();
                ctx.fillText('GAME OVER!', centerX, centerY - 50);                                  
            } else if(progress === words.length) {
                message = 'Great job, captain!';
                if(audioOn) greatJobAudio.play();
                ctx.fillText('YOU ARE WIN!', centerX, centerY - 50);                
            }        
    
            setTimeout(() => {                
                stop = true;                             
            }, 3000);
        }

        if(!isStarted) {
            drawStartButton();
        } else if(isStarted && !stop) {
            drawControlButton(60, spaceHeight-60);
            drawControlButton(spaceWidth - 60, spaceHeight-60);         
        } else {
            drawFinishButton();
        }

        if(!stop) {            
            say(message);
            requestAnimationFrame(draw);  
        }
    }
    
    bg1.onload = draw;
}