const SHAPE_TYPE=['L','J','O','I','S','Z','T']

function getBaseShape(shapeType){
    let baseShape={}
    baseShape['L']=[{row:0, col:-1},{row:0,col:0},{row:0,col:1},{row:0,col:2}]
    baseShape['J']=[{row:-1, col:-1},{row:0,col:-1},{row:0,col:0},{row:0,col:1}]
    baseShape['O']=[{row:0, col:0},{row:1,col:0},{row:0,col:1},{row:1,col:1}]
    baseShape['I']=[{row:0, col:-1},{row:0,col:0},{row:0,col:1},{row:0,col:2}]
    baseShape['S']=[{row:1, col:-1},{row:1,col:0},{row:0,col:0},{row:0,col:1}]
    baseShape['Z']=[{row:0, col:-1},{row:0,col:0},{row:1,col:0},{row:1,col:1}]
    baseShape['T']=[{row:1, col:-1},{row:1,col:0},{row:0,col:0},{row:1,col:1}]

    return baseShape[shapeType]
}

function RotateShape(baseShape,orientation){
    rotatedShape=baseShape
    for(let i =0; i< orientation; i++)
        rotatedShape=rotatedShape.map(sq => { return{ col: -sq.row , row: sq.col} } )
    return rotatedShape
}


function getShape(shapeType,top,left,shape_orient){
    baseShape=getBaseShape(shapeType)
    rotatedShape=RotateShape(baseShape,shape_orient)
    shapeWithOffest= rotatedShape.map(square=>{
        return {row:square.row+top, col:square.col+left}
    })
    return shapeWithOffest
}