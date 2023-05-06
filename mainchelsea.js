var t = 0;
elem = document.getElementById("container");
setCanvas(elem);

var p1=[0,0,0]
var p2=[100,0,0]
var p3=[100,100,0]
var p4=[0,100,0]

var points=[p1,p2,p3,p4]

var t = 10;


function rotater(angle, x, y, z, speed) {
    var rot = math.multiply([
        [1, 0, 0],
        [0, Math.cos(angle * speed), -Math.sin(angle * speed)],
        [0, Math.sin(angle * speed), Math.cos(angle * speed)]
    ], [
        [Math.cos(angle * speed), 0, Math.sin(angle * speed)],
        [0, 1, 0],
        [-Math.sin(angle * speed), 0, Math.cos(angle * speed)]
    ], [
        [Math.cos(angle * speed), -Math.sin(angle * speed), 0],
        [Math.sin(angle * speed), Math.cos(angle * speed), 0],
        [0, 0, 1]
    ], [x, y, z])
    return rot;
}

function draw() {
    clearCanvas(); //clearing the canvas

    for(i=0;i<points.length;i++){
        points[i]=rotater(t,points[i][0],points[i][1],points[i][2],1)
    }
    
    for(i=0;i<points.length;i++){
        new point(points[i][0]+200,points[i][1]+200,"red",5);
        for(j=0;j<points.length;j++){
            if(i!=j){
                new line(points[i][0]+200,points[i][1]+200,points[j][0]+200,points[j][1]+200,"black",1)
            }
        }
    }
    t+=0.001;

    new point(200+cos(t)*100,200+sin(t)*100,"blue",5);
    
    requestAnimationFrame(draw); //calls the function again to update the canavs every screen refresh
};
draw();