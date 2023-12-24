function GenerateNewShape(){
    newShape={
        shapeType: SHAPE_TYPE[Math.floor(Math.random()* SHAPE_TYPE.length)],
        top:0,
        left:BoardSize.cols/2-1,
        shapeOrient:0   
    }
    newShape.squareArr=getShape(newShape.shapeType,newShape.top,newShape.left,newShape.shapeOrient)
    return newShape
}

function DrawFallingShape(){
    curShape.squareArr.forEach(square => { fillSquare(square) })
}

function Init_occupied_squares(){
    retval=[]
    for (let i = 0; i < BoardSize.rows; i++) {
        boardRow=Array(BoardSize.cols).fill(false)
        retval.push(boardRow)
    }
    return retval
}

function DrawFrame(){
    clearBoard()
    drawBoard()
    drawGrid()
    DrawFallingShape()
    drawOccupiedSquares()
}

function IsSquareOccupied(square){
    if(square.row >= BoardSize.rows || square.col >= BoardSize.cols || square.col <0){
        return true
    }
    if(square.row < 0)
        return false
    //לא הבנתי את זה
    return occupiedSquares[square.row][square.col]
}

function IsShapeOccupied(shape){
    return shape.some(square => IsSquareOccupied(square))
}

function drawOccupiedSquares(){
    for(i = 0; i < occupiedSquares.length; i++) {
        for(j=0; j< occupiedSquares[i].length; j++){
            if(occupiedSquares[i][j])
                fillSquare({row: i, col: j})
        }      
    }
}

function AddFallingShapeToOccupiedSquares(){
    curShape.squareArr.forEach(square => {
        if(square.row < 0){
            clearInterval(IntervalId)
            audio.pause()
            audio.currentTime = 0;
            audioGameOver.play()
            const gameOver=document.getElementById("gameOver")
            gameOver.innerHTML="GAME OVER"
            const gameScore=document.getElementById("score")
            gameScore.innerHTML="YOUR SCORE IS "+score*10
            document.getElementById("startGame").disabled = false
            return
        }
        else
            occupiedSquares[square.row][square.col] = true})
}

function RemoveFullLines(){
    fullLines=[]
    for(i=0; i<occupiedSquares.length; i++)
        if(occupiedSquares[i].every(square=> square))
        {
            fullLines.push(i)
            var audioRemoveLine = document.getElementById('tetrisRemoveLineSound');
            audioRemoveLine.play()
            score++;
        }
            
    while(fullLines.length>0){
        for(i=fullLines[0]; i>0; i--){
            occupiedSquares[i]=occupiedSquares[i-1]
        }
        occupiedSquares[0]=Array(BoardSize.cols).fill(false)
        fullLines.shift()
    }
 
}

function MainLoop(){
    DrawFrame()
    moveDownShape=getShape(curShape.shapeType,curShape.top+1,curShape.left,curShape.shapeOrient)
    if(IsShapeOccupied(moveDownShape)){
        AddFallingShapeToOccupiedSquares()
        RemoveFullLines()
        curShape=GenerateNewShape()
    }
    else{
        curShape.squareArr=moveDownShape
        curShape.top++
    }

}

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            audioMove.currentTime = 0;
            audioMove.play()
            e.preventDefault()
            moveLeftShape=getShape(curShape.shapeType,curShape.top,curShape.left-1,curShape.shapeOrient)
            if(!IsShapeOccupied(moveLeftShape)){
                curShape.squareArr=moveLeftShape
                curShape.left--
            }
            break;
        case 'ArrowRight':
            audioMove.currentTime = 0;
            audioMove.play()
            e.preventDefault()
            moveRightShape=getShape(curShape.shapeType,curShape.top,curShape.left+1,curShape.shapeOrient)
            if(!IsShapeOccupied(moveRightShape)){
                curShape.squareArr=moveRightShape
                curShape.left++
            }
            break;
        case 'ArrowUp':
            audioMove.currentTime = 0;
            audioMove.play()
            e.preventDefault()
            rotatedShape=getShape(curShape.shapeType,curShape.top,curShape.left,(curShape.shapeOrient+1) %4)
            if(!IsShapeOccupied(rotatedShape)){
                curShape.squareArr=rotatedShape
                curShape.shapeOrient=(curShape.shapeOrient+1) %4
            }
            break;
    }
})


const BoardSize={cols:  10, rows: 20}


document.getElementById("startGame").addEventListener("click", StartGame);
var audio = document.getElementById('tetrisSound');
audio.addEventListener('ended', function() {
    restartGameAudio();
});

function restartGameAudio() {
    audio.load();
    audio.play();
}

var audioGameOver = document.getElementById('tetrisGameOverSound');
var audioMove = document.getElementById('tetrisMoveSound');

function StartGame() {
    audio.play();
    document.getElementById("startGame").disabled = true
    const gameOver=document.getElementById("gameOver")
    gameOver.innerHTML=""
    const gameScore=document.getElementById("score")
    gameScore.innerHTML=""
    score = 0;
    curShape = GenerateNewShape();
    occupiedSquares = Init_occupied_squares();
    IntervalId = setInterval(MainLoop, 220);
}


