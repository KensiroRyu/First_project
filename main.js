const canvas = document.querySelector('#game');
const mappingFoot = document.querySelector('.header__foot');
const mappingRecord = document.querySelector('.header__record');
const mappingAttemps = document.querySelector('.header__attemps');
const gameOverMessage = document.createElement('div');

gameOverMessage.style.position = 'absolute';
gameOverMessage.style.top = '50%';
gameOverMessage.style.left = '50%';
gameOverMessage.style.transform = 'translate(-50%, -50%)';
gameOverMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
gameOverMessage.style.color = '#fff';
gameOverMessage.style.padding = '20px';
gameOverMessage.style.borderRadius = '10px';
gameOverMessage.style.display = 'none';

document.body.appendChild(gameOverMessage);

if (canvas.getContext) {
    const ctx = canvas.getContext('2d');

    let mapWidth = canvas.width;
    let mapHeight = canvas.height;
    let defaultSpeed = 8; // fps (default)
    let speed = 10; // fps (speed)
    let interval = 1000 / speed; // frame time
    let gamePaused = false; 

    function speedSnake(speed) {
        interval = 1000 / speed;
    }

    let snake = {
        x: mapWidth / 2,
        y: mapHeight / 2,
        w: 30,
        h: 30,
        step: 30,
        moveX: 0,
        moveY: 0,
        fill: '#56cefa',
        secFill: '#2092bb',
        foot: 0,
        recordFoot: 0,
        body: [],
        size: 3,
        defaultSize: 3,
        attemps: 0,
        win: 300,
        activeKey: true,
    };

    let foot = {
        x: 0,
        y: 0,
        fill: '#fa5656',
    };

    function localStor() {
        if (localStorage.getItem('record')) {
            snake.recordFoot = localStorage.getItem('record');
            mappingRecord.innerHTML = snake.recordFoot;
            console.log(snake.recordFoot);
        } else {
            localStorage.setItem('record', snake.recordFoot);
        }
    }

    document.addEventListener('keydown', function(event) {
        e = event.keyCode;

        if (e === 37 && snake.moveX !== +snake.step && snake.activeKey === true) {
            snake.moveX = -snake.step;
            snake.moveY = 0;
            snake.activeKey = false;
        }
        if (e === 39 && snake.moveX !== -snake.step && snake.activeKey === true) {
            snake.moveX = +snake.step;
            snake.moveY = 0;
            snake.activeKey = false;
        }
        if (e === 38 && snake.moveY !== +snake.step && snake.activeKey === true) {
            snake.moveY = -snake.step;
            snake.moveX = 0;
            snake.activeKey = false;
        }
        if (e === 40 && snake.moveY !== -snake.step && snake.activeKey === true) {
            snake.moveY = +snake.step;
            snake.moveX = 0;
            snake.activeKey = false;
        }

        if (e === 32 && gamePaused) restartGame();
    });

    function animate() {
        if (!gamePaused) {
            ctx.clearRect(0, 0, mapWidth, mapHeight);
            drawSnake();
            drawFoot();
            setTimeout(animate, interval);
        } else {
            setTimeout(animate, 100);
        }
    }

    animate();

    function drawSnake() {
        ambit();
        ctx.fillStyle = snake.fill;
        snake.x += snake.moveX;
        snake.y += snake.moveY;
        snake.body.unshift({ x: snake.x, y: snake.y });

        if (snake.body.length > snake.size) {
            snake.body.pop();
        }

        if (snake.body[0].x === foot.x && snake.body[0].y === foot.y) {
            snake.size++;
            snake.foot++;
            upComplexitySnake();
            refreshMeppingFoot();
            refreshRecordFoot();
            positionFoot();
        }

        snake.activeKey = true;

        snake.body.forEach(function(el, index) {
            crachedIntoTheTail(el, index);

            if (index === snake.win) youWin();

            if (index === 0) {
                ctx.fillStyle = snake.fill
            } else {
                ctx.fillStyle = snake.secFill
            }
            ctx.fillRect(el.x, el.y, snake.step, snake.step)
        });
    }

    function crachedIntoTheTail(el, index) {
        if (snake.body.length > snake.defaultSize && snake.body[0].x === el.x && snake.body[0].y === el.y && index !== 0) {
            gamePaused = true;
            showGameOverMessage();
        }
    }

    function youWin() {
        alert(`you win! ${snake.win}nice:)`)
        restartGame();
        gamePaused = true;
    }

    function ambit() {
        if (snake.x + snake.moveX >= mapWidth) snake.x = -snake.step
        if (snake.x + snake.moveX < 0) snake.x = mapWidth
        if (snake.y + snake.moveY >= mapHeight) snake.y = -snake.step
        if (snake.y + snake.moveY < 0) snake.y = mapHeight
    }

    function drawFoot() {
        ctx.fillStyle = foot.fill;
        ctx.fillRect(foot.x, foot.y, snake.w, snake.h);
    }

    function positionFoot() {
        let x = randomX();
        let y = randomY();
        let overlapping = false;

        snake.body.forEach(function(el) {
            if (el.x === x && el.y === y) {
                overlapping = true;
            }
        });

        if (overlapping) {
            positionFoot();
        } else {
            foot.x = x;
            foot.y = y;
        }
    }

    function randomX() {
        return Math.floor(Math.random() * (mapWidth / snake.step)) * snake.step;
    }

    function randomY() {
        return Math.floor(Math.random() * (mapHeight / snake.step)) * snake.step;
    }

    function upComplexitySnake() {
        speedSnake(defaultSpeed + (snake.foot / 20))
    }

    function refreshMeppingFoot() {
        mappingFoot.innerHTML = snake.foot;
    }

    function refreshRecordFoot() {
        if (snake.recordFoot < snake.foot) {
            snake.recordFoot = snake.foot;
            mappingRecord.innerHTML = snake.recordFoot;
            localStorage.setItem('record', snake.recordFoot);
        }
        mappingFoot.innerHTML = snake.foot;
    }

    function refreshAttempsFoot() {
        if (snake.attemps < 100) snake.attemps++;
        else snake.attemps = 0;
        mappingAttemps.innerHTML = snake.attemps;
    }

    function restartGame() {
        gamePaused = false; 
        snake.size = snake.defaultSize;
        snake.foot = 0;
        refreshMeppingFoot();
        speedSnake(defaultSpeed);
        refreshAttempsFoot();

        snake.body = [];
        snake.body.push({ x: mapWidth / 2, y: mapHeight / 2 });

        if (gameOverMessage.style.display === 'block') {
            gameOverMessage.style.display = 'none';
        }
    }

    function showGameOverMessage() {
        gameOverMessage.innerHTML = "Game over<br>To restart press = Space";
        gameOverMessage.style.display = 'block';
    }
}
