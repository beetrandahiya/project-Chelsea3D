elem = document.getElementById("container");
setCanvas(elem);

var p1=[0,0,0]
var p2=[100,0,0]
var p3=[100,100,0]
var p4=[0,100,0]

var points=[p1,p2,p3,p4]

var t = 0.1;


function rotater(angleX,angleY,angleZ,x,y,z){
    var rot = math.multiply([
        [1, 0, 0],
        [0, Math.cos(angleX), -Math.sin(angleX)],
        [0, Math.sin(angleX), Math.cos(angleX)]
    ], [
        [Math.cos(angleY), 0, Math.sin(angleY)],
        [0, 1, 0],
        [-Math.sin(angleY), 0, Math.cos(angleY)]
    ], [
        [Math.cos(angleZ), -Math.sin(angleZ), 0],
        [Math.sin(angleZ), Math.cos(angleZ), 0],
        [0, 0, 1]
    ], [x, y, z])
    console.log(rot)
    return rot;
}

function draw() {
    clearCanvas(); //clearing the canvas
    orthopoints=[];
    for(i=0;i<points.length;i++){
        orthopoints.push(rotater(0,t,t,points[i][0],points[i][1],points[i][2]))
    }
    
    for(i=0;i<orthopoints.length;i++){
        new point(orthopoints[i][0]+200,orthopoints[i][1]+200,"red",5);
        for(j=0;j<orthopoints.length;j++){
            if(i!=j){
                new line(orthopoints[i][0]+200,orthopoints[i][1]+200,orthopoints[j][0]+200,orthopoints[j][1]+200,"black",1)
            }
        }
    }

    new point(200+cos(t)*100,200+sin(t)*100,"blue",5);
    console.log(t)
    t+=0.1;
    requestAnimationFrame(draw); //calls the function again to update the canavs every screen refresh
};
draw();