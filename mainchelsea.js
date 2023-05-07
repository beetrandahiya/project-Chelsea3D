elem = document.getElementById("container");
setCanvas(elem);

//make an array of points to make a cube

var t = 0;


addMouseInteraction(elem);
function render() {
    clearCanvas(); //clearing the canvas
    

  //  new line3D(0,0,0,200,200,0,"#222",3);
   // new point3D(100,100,0,"#fa2",5);
    //render axes
  //  new line3D(0,0,0,100,0,0,"#f00",3);
   // new line3D(0,0,0,0,100,0,"#0f0",3);
   // new line3D(0,0,0,0,0,100,"#00f",3);
    

   // make 8 points for a cube
    var p1 = new point3D(-100,-100,-100,"#000",5);
    var p2 = new point3D(100,-100,-100,"#000",5);
    var p3 = new point3D(100,100,-100,"#000",5);
    var p4 = new point3D(-100,100,-100,"#000",5);
    var p5 = new point3D(-100,-100,100,"#000",5);
    var p6 = new point3D(100,-100,100,"#000",5);
    var p7 = new point3D(100,100,100,"#000",5);
    var p8 = new point3D(-100,100,100,"#000",5);


    //make 12 lines for a cube
    new line3D(-100,-100,-100,100,-100,-100,"#000",3);
    new line3D(100,-100,-100,100,100,-100,"#000",3);
    new line3D(100,100,-100,-100,100,-100,"#000",3);
    new line3D(-100,100,-100,-100,-100,-100,"#000",3);
    new line3D(-100,-100,100,100,-100,100,"#000",3);
    new line3D(100,-100,100,100,100,100,"#000",3);
    new line3D(100,100,100,-100,100,100,"#000",3);
    new line3D(-100,100,100,-100,-100,100,"#000",3);
    new line3D(-100,-100,-100,-100,-100,100,"#000",3);
    new line3D(100,-100,-100,100,-100,100,"#000",3);
    new line3D(100,100,-100,100,100,100,"#000",3);
    new line3D(-100,100,-100,-100,100,100,"#000",3);

    new circle3D(0,0,0,50,64,"#f0f",0.1,"#f0f",3).rotate(t,t,t);
    
    var xyplane = new polygon3D([[-100,100,0],[100,100,0],[100,-100,0],[-100,-100,0]],"#66f",0.1,"#66f",1,true);

    var xzplane = new polygon3D([[-100,0,100],[100,0,100],[100,0,-100],[-100,0,-100]],"#6f6",0.1,"#6f6",1,true);

    var yzplane = new polygon3D([[0,100,100],[0,-100,100],[0,-100,-100],[0,100,-100]],"#f66",0.1,"#f66",1,true);

    //make a circle
  //  var c1=new circle3D(0,0,0,50,64,"#f0f",0.1,"#f0f",3);
   // c1.rotate(0,t,0);

    t+=0.01;
    //order the elements in the array by their distance from the camera
    orderElements();
    requestAnimationFrame(render); //calls the function again to update the canavs every screen refresh
};
render();