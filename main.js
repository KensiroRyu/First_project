const canvas = document.querySelector('#game');
const mappingFood = document.querySelector('.header__food');
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
    let defaultSpeed = 5; // fps (default)
    let speed = 5; // fps (speed)
    let interval = 1000 / speed; // frame time
    let gamePaused = false; 

    function speedSnake(speed) {  //This function updates the snake's movement speed based on the provided speed parameter.
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
        food: 0,
        recordFood: 0,
        body: [],
        size: 3,
        defaultSize: 3,
        attemps: 0,
        win: 300,
        activeKey: true,
    };

    let food = {
        x: 0,
        y: 0,
        fill: '#fa5656',
    };
    /**Checks for the existence of a record entry in the browser's local storage. If the entry exists, it assigns it to the snake.
    recordFood variable and displays it on the page. 
    If there is no entry, it creates one with an initial value of 0.**/
    function localStor() {
        if (localStorage.getItem('record')) {
            snake.recordFood = localStorage.getItem('record');
            mappingRecord.innerHTML = snake.recordFood;
            console.log(snake.recordFood);
        } else {
            localStorage.setItem('record', snake.recordFood);
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
            drawFood();
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

        if (snake.body[0].x === food.x && snake.body[0].y === food.y) {
            snake.size++;
            snake.food++;
            upComplexitySnake();
            refreshMeppingFood();
            refreshRecordFood();
            positionFood();
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
    /* Checks for collision between the snake's head and its own tail. If a collision occurs, the game is paused and a game-over message is displayed**/
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
//Checks if the snake goes beyond the boundaries of the game canvas and, if necessary, moves it to the opposite side of the canvas.
    function ambit() {
        if (snake.x + snake.moveX >= mapWidth) snake.x = -snake.step
        if (snake.x + snake.moveX < 0) snake.x = mapWidth
        if (snake.y + snake.moveY >= mapHeight) snake.y = -snake.step
        if (snake.y + snake.moveY < 0) snake.y = mapHeight
    }

    function drawFood() {
        ctx.fillStyle = food.fill;
        ctx.fillRect(food.x, food.y, snake.w, snake.h);
    }

    function positionFood() {
        let x = randomX();
        let y = randomY();
        let overlapping = false;

        snake.body.forEach(function(el) {
            if (el.x === x && el.y === y) {
                overlapping = true;
            }
        });

        if (overlapping) {
            positionFood();
        } else {
            food.x = x;
            food.y = y;
        }
    }

    function randomX() {
        return Math.floor(Math.random() * (mapWidth / snake.step)) * snake.step;
    }

    function randomY() {
        return Math.floor(Math.random() * (mapHeight / snake.step)) * snake.step;
    }

    function upComplexitySnake() {
        speedSnake(defaultSpeed + (snake.food / 5))
    }

    function refreshMeppingFood() {
        mappingFood.innerHTML = snake.food;
    }
//Updates the record number of eaten food and saves it to local storage.
    function refreshRecordFood() {
        if (snake.recordFood < snake.food) {
            snake.recordFood = snake.food;
            mappingRecord.innerHTML = snake.recordFood;
            localStorage.setItem('record', snake.recordFood);
        }
        mappingFood.innerHTML = snake.food;
    }
//Updates the player's attempts count.
    function refreshAttempsFood() {
        if (snake.attemps < 100) snake.attemps++;
        else snake.attemps = 0;
        mappingAttemps.innerHTML = snake.attemps;
    }

    function restartGame() {
        gamePaused = false; 
        snake.size = snake.defaultSize;
        snake.food = 0;
        refreshMeppingFood();
        speedSnake(defaultSpeed);
        refreshAttempsFood();

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
