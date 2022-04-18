let main =document.querySelector(".main");
const  scroelElement=document.getElementById("score");
const  levelElement=document.getElementById("level");
let figures ={
    O:[
    [1,1],
    [1,1]
    ],
    I:[
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]
    ],
    S:[
        [0,1,1],
        [1,1,0],
        [0,0,0],
    ],
    Z:[
        [1,1,0],
        [0,1,1],
        [0,0,0],
    ],
    L:[
        [1,0,0],
        [1,1,1],
        [0,0,0],
    ],
    J:[
        [0,0,1],
        [1,1,1],
        [0,0,0],
    ],
    T:[
        [1,1,1],
        [0,1,0],
        [0,0,0],
    ],
    }
// /playifield - свободна или занята данная ячейка (квадратик)/

let playfield = [
    //ряды
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
];
//для вращения

// Значение для нашего таймера,затем мы будем его редактировать

let score =0;
let level =0;
let gameSpeed=500-score;
let activeTetro={
    //создаем фигуры
    x:0,
    y:0,
    shape:[
        [1,1,1],
        [0,1,0],
        [0,0,0],
    ],
}
function draw(){
    // Пробегаемся по каждой ячейки и присваеваем ей значение 0 или 1
    let mainInterHtml ="";
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x]===1){
                mainInterHtml+= '<div class="cell movingSell"></div>';
            }else if(playfield[y][x]===2){
                mainInterHtml+= '<div class="cell fixed"></div>';
            }
            else {
                mainInterHtml += '<div class="cell"></div>';
            }
        }
    }
// Присваеваем нашу разметку main
    main.innerHTML=mainInterHtml;
}

function removePrevActiveTetro() {
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x]===1){
                playfield[y][x]=0;
            }
        }
        }
}

function updateActiveTetro(){
    removePrevActiveTetro();
    //выставляем фигуры в поле игры
    for (let y = 0; y < activeTetro.shape.length; y++) {
        for (let x = 0; x < activeTetro.shape[y].length; x++) {
            if(activeTetro.shape[y][x]){
                playfield[activeTetro.y+y][activeTetro.x+x]=activeTetro.shape[y][x];
            }
        }
        }
}

function moveTetroDown() {
    activeTetro.y+=1;
    if (hasCollisions()){
        activeTetro.y-=1;
        fixTetro();
    checkFullLines();
        activeTetro.shape = getNewTetro();
        activeTetro.y=0;
        activeTetro.x=Math.floor((10-activeTetro.shape[0].length)/2);
    }
}

function checkFullLines() {
    //Удаление заполненой строки
    let canRemove =true;
    for (let y = 0; y <playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x]!==2){
                canRemove=false;
                break;
            }
        }
        if (canRemove){
            playfield.splice(y,1);
            playfield.splice(0,0,[0,0,0,0,0,0,0,0,0,0]);
            score+=100;
            scroelElement.innerHTML=score;
            level++;
            levelElement.innerHTML=level;
        }
        canRemove=true;
    }
}

function getNewTetro() {
    const possibleFigures= "IOLTJSZ";
    const rand = Math.floor(Math.random()*7);
    return figures[possibleFigures[rand]];
}
function fixTetro(){
    for (let y = 0; y <playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x]===1){
                playfield[y][x]=2;
            }
        }
    }
}

function hasCollisions() {
    for (let y = 0; y < activeTetro.shape.length; y++) {
        for (let x = 0; x < activeTetro.shape[y].length; x++) {
            if (activeTetro.shape[y][x] && (playfield[activeTetro.y+y] ===undefined ||
                playfield[activeTetro.y+y][activeTetro.x+x]===undefined ||
                playfield[activeTetro.y+y][activeTetro.x+x]===2)){
                return true;
            }
        }
        }
    return  false;
}

function rotateTetro() {
    const prevTetroState=activeTetro.shape;
    activeTetro.shape=activeTetro.shape[0].map((val,index)=>
        activeTetro.shape.map((row)=>row[index]).reverse());
    if (hasCollisions()){
        activeTetro.shape=prevTetroState;
    }
}

document.onkeydown=function (e) {
    // Движение фигурок
    if (e.keyCode===37){
        activeTetro.x-=1;
        if (hasCollisions()){
            activeTetro.x+=1;
        }
// Влево
    }else if(e.keyCode===39){
        activeTetro.x += 1;
        if (hasCollisions()){
            activeTetro.x-=1;
        }
        // Вправо
    }
    else if(e.keyCode===40){
        moveTetroDown();
        // Вниз
    }
    else if(e.keyCode===38){
        //кручение
        rotateTetro();
    }
    // для плавности
    updateActiveTetro();
    draw();
}
updateActiveTetro();
draw();

function thisIsTheEnd() {
    for (let i in playfield[0]) {
        if (playfield[0][i]===2) return true;
    }
    return  false;
}
let timerId=setInterval(startGame,gameSpeed);
function startGame(){
    // Запуск таймера для движения фигуры
    moveTetroDown();
    updateActiveTetro();
    draw();
    if (thisIsTheEnd()){
        alert("Конец");
        clearInterval(timerId);
    }else {
        clearInterval(timerId);
        timerId=setInterval(startGame,gameSpeed-score)
    }
}


