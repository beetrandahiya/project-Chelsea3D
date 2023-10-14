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
r=10;


var b_p=[0,0,0];
var b_v=[0.1,0.3,0.2];

function render() {
  clearCanvas(); //clearing the canvas
 

  new cube3D(-50,-50,-50,100,100,100,"#0002",0.5,"#f0f",3)

 //make a ball

  new Sphere3D(b_p[0],b_p[1],b_p[2],r,1,'#000', 0.4, '#ffabff', 0.3, true);
 //bounce the ball inside the cube

  b_p[0]+=b_v[0];
  b_p[1]+=b_v[1];
  b_p[2]+=b_v[2];

  if(b_p[0]-r<-50){
    b_v[0]=-b_v[0];
  }
  if(b_p[0]+r>50){
    b_v[0]=-b_v[0];
  }
  if(b_p[1]-r<-50){
    b_v[1]=-b_v[1];
  }
  if(b_p[1]+r>50){
    b_v[1]=-b_v[1];
  }
  if(b_p[2]-r<-50){
    b_v[2]=-b_v[2];
  }
  if(b_p[2]+r>50){
    b_v[2]=-b_v[2];
  }





 
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






 // draw a function of wave
  /*
      new circle3D(0,0,0,50,64,"#f0f",0.1,"#f0f",3).rotate(t,t,t);
      
      var xyplane = new polygon3D([[-100,100,0],[100,100,0],[100,-100,0],[-100,-100,0]],"#66f",0.1,"#66f",1,true);

      var xzplane = new polygon3D([[-100,0,100],[100,0,100],[100,0,-100],[-100,0,-100]],"#6f6",0.1,"#6f6",1,true);

      var yzplane = new polygon3D([[0,100,100],[0,-100,100],[0,-100,-100],[0,100,-100]],"#f66",0.1,"#f66",1,true);

  */

/*
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
  //gradient 
  var g1= createGradient("g1",[[0,"#f7fc00"],[0.5,"#eaa24d"],[1,"#db38a3"]]);

  var colors_grad = interpolateColor("#f7fc00","#eaa24d",points.length);
  //new polygon3D(points,"#f66",0,"url(#g1)",3,false);
  px=points[0][0];
  py=points[0][1];
  pz=points[0][2];

  for(var i=1;i<points.length;i+=2){
    new line3D(px,py,pz,points[i][0],points[i][1],points[i][2],colors_grad[i],3,"round");
    px=points[i][0];
    py=points[i][1];
    pz=points[i][2];

  }

   // new cube3D(-25,-25,-25,50,50,50,"#0002",0.5,"#f0f",3)

  //new line3D(0,0,0,100,0,0,"#0ff",3);
  //new circle3D(0,0,40,50,32,"#0004",1,"#0004",1);
*/

