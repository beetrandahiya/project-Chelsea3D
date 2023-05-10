elem = document.getElementById("container");
setCanvas(elem);

//make an array of points to make a cube

var t = 0;


addMouseInteraction(elem);
x=0.01;
y=0.01;
z=0.01
a=10;
b=28;
c=8/3;
px=x;
py=y;
pz=z;
points=[];

function render() {
  clearCanvas(); //clearing the canvas
  // draw a function of wave
  /*
      new circle3D(0,0,0,50,64,"#f0f",0.1,"#f0f",3).rotate(t,t,t);
      
      var xyplane = new polygon3D([[-100,100,0],[100,100,0],[100,-100,0],[-100,-100,0]],"#66f",0.1,"#66f",1,true);

      var xzplane = new polygon3D([[-100,0,100],[100,0,100],[100,0,-100],[-100,0,-100]],"#6f6",0.1,"#6f6",1,true);

      var yzplane = new polygon3D([[0,100,100],[0,-100,100],[0,-100,-100],[0,100,-100]],"#f66",0.1,"#f66",1,true);

  */


  dt = 0.01;
  dx = (a * (y - x)) * dt;
  dy = (x * (b - z) - y) * dt;
  dz = (x * y - c * z) * dt;

  x = x + dx;
  y = y + dy;
  z = z + dz;

  points.push([x*4,y*4,z*4]);
  if(points.length>500){
    points.shift();
  }
  new polygon3D(points,"#f66",0,"#f66",3,false);
  orderElements();

  requestAnimationFrame(render); //calls the function again to update the canavs every screen refresh
};
render();








function frameRate(outputelement) {

  var fps = document.querySelector(outputelement);
  var startTime = Date.now();
  var frame = 0;

  function tick() {
    var time = Date.now();
    frame++;
    if (time - startTime > 1000) {
      fps.innerHTML = (frame / ((time - startTime) / 1000)).toFixed(1);
      startTime = time;
      frame = 0;
    }
    window.requestAnimationFrame(tick);
  }
  tick();
}

frameRate('#fps-counter');