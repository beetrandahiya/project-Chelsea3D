

var tx=0;
var ty=0;
var tz=0;

var scale = 1;

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




// make a point element
class point3D {
    constructor(x, y, z, stroke, stroke_width) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.stroke = stroke;
        this.stroke_width = stroke_width;

        var rot = rotater(tx,ty,tz,x*scale,y*scale,z*scale);
        new point(WIDTH/2+rot[0],WIDTH/2+rot[1],stroke,stroke_width);
    }
}

// make a line element
class line3D {
    constructor(x1, y1, z1, x2, y2, z2, stroke, stroke_width, linecap="butt",dasharray="") {
        this.x1 = x1;
        this.y1 = y1;
        this.z1 = z1;
        this.x2 = x2;
        this.y2 = y2;
        this.z2 = z2;
        this.stroke = stroke;
        this.stroke_width = stroke_width;
        this.linecap = linecap;
        this.dasharray = dasharray;

        var rot1 = rotater(tx,ty,tz,x1*scale,y1*scale,z1*scale);
        var rot2 = rotater(tx,ty,tz,x2*scale,y2*scale,z2*scale);

        new line(WIDTH/2+rot1[0],HEIGHT/2+rot1[1],WIDTH/2+rot2[0],HEIGHT/2+rot2[1],stroke,stroke_width,linecap,dasharray);
    }
}




//////////////////////////
// MOUSE INTERACTION
//////////////////////////

function addMouseInteraction(elem){
    
// *** Mouse rotate. ***	
var mouseX = 0, mouseY = 0, pmouseX, pmouseY; // mouseX is current mouse x-coordinate, pmouseX is previous mouse x-coordinate when it was 1 pixel different.  
// Figure must rotate iff mousemove AND mousedown (for mouse devices):
var mouseDown = false;
elem.addEventListener("mousedown", handleMousedown, false);	
elem.addEventListener("touchstart", handleMousedown, false);	
document.addEventListener("mouseup", function (e) { if(mouseDown) mouseDown = false; elem.style.cursor = "grab"; }, false);	
elem.addEventListener("mousemove", handleMove, false);
elem.addEventListener("touchmove", handleMove, false);


function handleMousedown(e) {
	if(!mouseDown) mouseDown = true;
	elem.style.cursor = "grabbing";
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

// *** Mouse zoom. ***
var zoomSpeed = 0.1;
elem.addEventListener("wheel", handleWheel, false);
function handleWheel(e) {
    var delta = e.deltaY || e.detail || e.wheelDelta;
    if (delta > 0) {
        scale = scale - zoomSpeed;
    } else {
        scale = scale + zoomSpeed;    }
    e.preventDefault();
};


}










