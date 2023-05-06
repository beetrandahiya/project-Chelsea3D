"use strict";



//////////////////////////////

var ELEMENTS = [];

// make a class for the nodes
class Node {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}



// make a point element
class Point {
    constructor(props, x, y, z) {
        //set default properties
        this.props = {
            color: 'black',
            size: 1,
            fill: true,
            stroke: true,
            strokeColor: 'black',
            strokeWidth: 1,
            opacity: 1
        };
        //set properties from props
        for (var p in props) {
            this.props[p] = props[p];
        }
        this.nodes = [];
        this.nodes.push(new Node(x, y, z));
        ELEMENTS.push(this);
    }
    draw(scale) {
        var node = this.nodes[0];
        var x = node.x * scale;
        var y = node.y * scale;
        var z = node.z;
        var size = this.props.size;
        var color = this.props.color;
        var fill = this.props.fill;
        var stroke = this.props.stroke;
        var strokeColor = this.props.strokeColor;
        var strokeWidth = this.props.strokeWidth;
        var opacity = this.props.opacity;
        cxt.beginPath();
        cxt.arc(x, y, size, 0, 2 * Math.PI);
        cxt.closePath();
        if (fill) {
            cxt.fillStyle = color;
            cxt.globalAlpha = opacity;
            cxt.fill();
        }
        if (stroke) {
            cxt.strokeStyle = strokeColor;
            cxt.lineWidth = strokeWidth;
            cxt.globalAlpha = opacity;
            cxt.stroke();
        }
    }
}

// make a line element
class Line {
    constructor(props, x1, y1, z1, x2, y2, z2) {
        //set default properties
        this.props = {
            color: 'black',
            size: 1,
            fill: true,
            stroke: true,
            strokeColor: 'black',
            strokeWidth: 1,
            opacity: 1
        };
        //set properties from props
        for (var p in props) {
            this.props[p] = props[p];
        }
        this.nodes = [];
        this.nodes.push(new Node(x1, y1, z1));
        this.nodes.push(new Node(x2, y2, z2));
        ELEMENTS.push(this);
    }
    draw(scale) {
        var node1 = this.nodes[0];
        var node2 = this.nodes[1];
        var x1 = node1.x * scale;
        var y1 = node1.y * scale;
        var z1 = node1.z;
        var x2 = node2.x * scale;
        var y2 = node2.y * scale;
        var z2 = node2.z;
        var color = this.props.color;
        var fill = this.props.fill;
        var stroke = this.props.stroke;
        var strokeColor = this.props.strokeColor;
        var strokeWidth = this.props.strokeWidth;
        var opacity = this.props.opacity;
        cxt.beginPath();
        cxt.moveTo(x1, y1);
        cxt.lineTo(x2, y2);
        cxt.closePath();
        if (fill) {
            cxt.fillStyle = color;
            cxt.globalAlpha = opacity;
            cxt.fill();
        }
        if (stroke) {
            cxt.strokeStyle = strokeColor;
            cxt.lineWidth = strokeWidth;
            cxt.globalAlpha = opacity;
            cxt.stroke();
        }
    }
}
/////////////////////////////
// "pixel" dimensions 
var pixelWidth = 2;
var scale = 50; // a scale factor
// nodes settings
var xMin = -5;
var xMax = 5;
var yMin = -5;
var yMax = 5;

// rotation angles [rad]
var rotx = 300 * Math.PI/180;
var roty = 25 * Math.PI/180;
var rotz = 0 * Math.PI/180;

var nodes =[];
var nodesAxes =[];

var cont = document.getElementById('container');
// Obtain a reference to the canvas element.
var canvas  = document.getElementById("myCanvas");
// Obtain a 2D context from the canvas element.
var cxt = canvas.getContext("2d");


cxt.lineCap = "round";
cxt.lineJoin = "round";
cxt.font = 'normal 16px Inter';

sizeCanvas();	
	
// *** Mouse rotate. ***	
var mouseX = 0, mouseY = 0, pmouseX, pmouseY; // mouseX is current mouse x-coordinate, pmouseX is previous mouse x-coordinate when it was 1 pixel different.  
// Figure must rotate iff mousemove AND mousedown (for mouse devices):
var mouseDown = false;
cont.addEventListener("mousedown", handleMousedown, false);	
cont.addEventListener("touchstart", handleMousedown, false);	
document.addEventListener("mouseup", function (e) { if(mouseDown) mouseDown = false; canvas.style.cursor = "grab"; }, false);	
cont.addEventListener("mousemove", handleMove, false);
cont.addEventListener("touchmove", handleMove, false);

//Zoom with mouse wheel
canvas.addEventListener("wheel", function(e) {
    if (e.deltaY < 0) {
        scale *= 1.1;
    }
    else {
        scale /= 1.1;
    }
    drawFunction();
    e.preventDefault();
});



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
		rotx = rotx + (mouseY - pmouseY)/sensetivity;
		roty = roty + (mouseX - pmouseX)/sensetivity;
		drawFunction();
	}
	e.preventDefault();
};
// *** END Mouse rotate. ***



drawFunction();

window.addEventListener("resize", initial);

function initial() {
	sizeCanvas();
	drawFunction();
};

function sizeCanvas() {	
	/// Make size of canvas equal to size container and move canvas to center
	var cs = getComputedStyle(cont);
	/// these will return dimensions in *pixel* regardless of what
	/// you originally specified for container:
	canvas.width = parseInt(cs.getPropertyValue('width'), 10);
	canvas.height = parseInt(cs.getPropertyValue('height'), 10);
	cxt.translate(canvas.width/2, canvas.height/2);	
};	






function drawFunction() {

    //start performance timer
    var t0 = performance.now();

	cxt.clearRect(-canvas.width, -canvas.height, 2*canvas.width, 2*canvas.height);
/*
    function fx(t){
        return 2*Math.sin(t)
    }
    function fy(t){
        return 2*Math.cos(t)
    }
    function fz(t){
        return t/5
    }

    var i=0;
    var dt=0.01;
    var z_d = 1;   // move the center of the graph along z-axis
    for (var t = -Math.PI; t <= 6*Math.PI; t += dt) {
        nodes[i] = {x:fx(t), y:fy(t), z:fz(t)-z_d};
        ++i;
    }
    
	*/
	// rotate nodes
    var p1 = new Point({color: 'red', size: 5}, 1, 0, 0);
    var p2 = new Point({color: 'blue', size: 5}, 0, 1, 0);
    var p3 = new Point({color: 'green', size: 5}, 0, 0, 1);

    var ax_x = new Line({strokeColor: 'red', size: 5}, 0, 0, 0, 5, 0, 0);
    var ax_y = new Line({strokeColor: 'blue', size: 5}, 0, 0, 0, 0, 5, 0);
    var ax_z = new Line({strokeColor: 'green', size: 5}, 0, 0, 0, 0, 0, 5);

    for (var i = 0; i < ELEMENTS.length; i++) {
        for (var j = 0; j < ELEMENTS[i].nodes.length; j++) {
            rotateX3D(ELEMENTS[i].nodes[j], rotx);
            rotateY3D(ELEMENTS[i].nodes[j], roty);
            rotateZ3D(ELEMENTS[i].nodes[j], rotz);
        }
        ELEMENTS[i].draw(scale);
    }
	
    //zoom3D(scale);
	




    //end performance timer
    var t1 = performance.now();
    console.log("Call to draw took " + (t1 - t0) + " milliseconds.")

};

// Rotate shape around the z-axis, i.e. the non-rotated axis, perpendicular to the screen.
function rotateZ3D(node,theta) {
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);
        var x = node.x;
        var y = node.y;
        node.x = x * cosTheta - y * sinTheta;
        node.y = y * cosTheta + x * sinTheta;
    
};

// Rotate shape around the y-axis, i.e. the non-rotated axis, vertical to the screen.
function rotateY3D(node,theta) {
    var sinTheta = Math.sin(-theta);
    var cosTheta = Math.cos(-theta);
    
        var x = node.x;
        var z = node.z;
        node.x = x * cosTheta - z * sinTheta;
        node.z = z * cosTheta + x * sinTheta;
  
};

// Rotate shape around the x-axis, i.e. the non-rotated axis, horizontal to the screen.
function rotateX3D(node,theta) {
    var sinTheta = Math.sin(-theta);
    var cosTheta = Math.cos(-theta);
    
        var y = node.y;
        var z = node.z;
        node.y = y * cosTheta - z * sinTheta;
        node.z = z * cosTheta + y * sinTheta;
    
};





function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
};

