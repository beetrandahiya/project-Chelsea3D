elem = document.getElementById("container");
setCanvas(elem);

//make an array of points to make a cube

var t = -1;


addMouseInteraction(elem);
function draw() {
    clearCanvas(); //clearing the canvas
    

    new line3D(0,0,0,200,200,0,"#222",3);
    new point3D(100,100,0,"#fa2",5);
    //draw axes
    new line3D(0,0,0,100,0,0,"#f00",3);
    new line3D(0,0,0,0,100,0,"#0f0",3);
    new line3D(0,0,0,0,0,100,"#00f",3);
    //DRAW GRID
    for(var i=-10;i<10;i++){
        new line3D(i*10,-100,0,i*10,100,0,"#2224",1);
        new line3D(-100,i*10,0,100,i*10,0,"#2224",1);
    }
    //make a circle
    var c1=new circle3D(0,0,0,50,64,"#f0f",3,"#f0f3");
    c1.rotate(0,t,0);

    t+=0.01;
    requestAnimationFrame(draw); //calls the function again to update the canavs every screen refresh
};
draw();