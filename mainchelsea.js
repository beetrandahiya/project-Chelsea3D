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
    //make a helix
    for(var i=-10;i<t;i+=0.1){
        new line3D(i*10,Math.sin(i)*50,Math.cos(i)*50,(i+0.1)*10,Math.sin(i+0.1)*50,Math.cos(i+0.1)*50,"#f3f",5,"round");
    }

    //t+=0.1;
    requestAnimationFrame(draw); //calls the function again to update the canavs every screen refresh
};
draw();