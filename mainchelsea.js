elem = document.getElementById("container");
setCanvas(elem);

//make an array of points to make a cube

var points=[]
for(i=0;i<2;i++){
    for(j=0;j<2;j++){
        for(k=0;k<2;k++){
            points.push([i*200,j*200,k*200])
        }
    }
}

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


	
// *** Mouse rotate. ***	
var mouseX = 0, mouseY = 0, pmouseX, pmouseY; // mouseX is current mouse x-coordinate, pmouseX is previous mouse x-coordinate when it was 1 pixel different.  
// Figure must rotate iff mousemove AND mousedown (for mouse devices):
var mouseDown = false;
elem.addEventListener("mousedown", handleMousedown, false);	
elem.addEventListener("touchstart", handleMousedown, false);	
document.addEventListener("mouseup", function (e) { if(mouseDown) mouseDown = false; canvas.style.cursor = "grab"; }, false);	
elem.addEventListener("mousemove", handleMove, false);
elem.addEventListener("touchmove", handleMove, false);


tx=0;
ty=0;
tz=0;
function handleMousedown(e) {
	if(!mouseDown) mouseDown = true;
	canvas.style.cursor = "grabbing";
	var x = parseInt(e.pageX) || parseInt(e.changedTouches[0].pageX);
	var y = parseInt(e.pageY) || parseInt(e.changedTouches[0].pageY);
	mouseX = x;
	mouseY = y;
	e.preventDefault(); 
};
  
function handleMove(e) {
	var sensetivity = 100; // how sensitive the mouse should be

	// getting mouseX, mouseY, pmouseX and pmouseY.	
	pmouseX = mouseX;
	pmouseY = mouseY;
	var x = parseInt(e.pageX) || parseInt(e.changedTouches[0].pageX);
	var y = parseInt(e.pageY) || parseInt(e.changedTouches[0].pageY);	
	if (Math.abs(x - pmouseX) >= 1) {mouseX = x;} else { mouseX = pmouseX }
	if (Math.abs(y - pmouseY) >= 1) {mouseY = y;} else { mouseY = pmouseY }	

	// change rotation
	//if(e.which==1 || e.buttons==1) {
	if(mouseDown === true) {
		ty = ty + (mouseX - pmouseX)/sensetivity;
        tx = tx - (mouseY - pmouseY)/sensetivity;
	}
	e.preventDefault();
};
// *** END Mouse rotate. ***




function draw() {
    clearCanvas(); //clearing the canvas
    orthopoints=[];
    for(i=0;i<points.length;i++){
        orthopoints.push(rotater(tx,ty,tz,points[i][0],points[i][1],points[i][2]))
    }
    
    for(i=0;i<orthopoints.length;i++){
        new point(orthopoints[i][0]+200,orthopoints[i][1]+200,"red",5);
        for(j=0;j<orthopoints.length;j++){
            if(i!=j){
                new line(orthopoints[i][0]+200,orthopoints[i][1]+200,orthopoints[j][0]+200,orthopoints[j][1]+200,"black",2)
            }
        }
    }

   // new point(200+cos(t)*100,200+sin(t)*100,"blue",5);
    //console.log(t)
    requestAnimationFrame(draw); //calls the function again to update the canavs every screen refresh
};
draw();