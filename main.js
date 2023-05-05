





//////////////////////////////
//////////////////////////////
//////////////////////////////
// 3D ELEMENTS
//////////////////////////////
//////////////////////////////


//functions for orthographic projection

function rotateX(NODE, theta) {
    var sinTheta = Math.sin(-theta);
    var cosTheta = Math.cos(-theta);
    var y = NODE.y;
    var z = NODE.z;
    NODE.y = y * cosTheta - z * sinTheta;
    NODE.z = z * cosTheta + y * sinTheta;
}

function rotateY(NODE, theta) {
    var sinTheta = Math.sin(-theta);
    var cosTheta = Math.cos(-theta);
    var x = NODE.x;
    var z = NODE.z;
    NODE.x = x * cosTheta - z * sinTheta;
    NODE.z = z * cosTheta + x * sinTheta;
}

function rotateZ(NODE, theta) {
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);
    var x = NODE.x;
    var y = NODE.y;
    NODE.x = x * cosTheta - y * sinTheta;
    NODE.y = y * cosTheta + x * sinTheta;
}


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
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.closePath();
        if (fill) {
            ctx.fillStyle = color;
            ctx.globalAlpha = opacity;
            ctx.fill();
        }
        if (stroke) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.globalAlpha = opacity;
            ctx.stroke();
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
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        if (fill) {
            ctx.fillStyle = color;
            ctx.globalAlpha = opacity;
            ctx.fill();
        }
        if (stroke) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.globalAlpha = opacity;
            ctx.stroke();
        }
    }
}





//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////











var canvas = document.getElementById('myCanvas');

var ctx = canvas.getContext('2d');
ctx.translate(canvas.width / 2, canvas.height / 2);

//set initial rotation
var rotX = 10 * Math.PI/180; //rotation around x-axis
var rotY = 0 * Math.PI/180; //rotation around y-axis
var rotZ = 0; //rotation around z-axis

//set initial scale
var scale = 50;


//function sizeCanvas
function sizeCanvas() {
    var cs = getComputedStyle(document.getElementById('container'));
    canvas.width = parseInt(cs.getPropertyValue('width'), 10);
    canvas.height = parseInt(cs.getPropertyValue('height'), 10);
    ctx.translate(canvas.width / 2, canvas.height / 2);
}

sizeCanvas();

//set up event listeners
var mouseX = 0,
    mouseY = 0,
    pmouseX, pmouseY; // mouseX is current mouse x-coordinate, pmouseX is previous mouse x-coordinate when it was 1 pixel different.  

var mouseDown = false;

canvas.addEventListener('mousedown', handleMousedown, false);
canvas.addEventListener('touchstart', handleMousedown, false);
canvas.addEventListener('mouseup', function (e) {
    if (mouseDown) {
        mouseDown = false;
    }
}, false);
canvas.addEventListener('mousemove', handleMousemove, false);
canvas.addEventListener('touchmove', handleMousemove, false);
//canvas.addEventListener('wheel', handleMousewheel, false);


function handleMousedown(e) {
    if (!mouseDown) mouseDown = true;
    canvas.style.cursor = "grabbing";
    var x = parseInt(e.pageX) || parseInt(e.changedTouches[0].pageX);
    var y = parseInt(e.pageY) || parseInt(e.changedTouches[0].pageY);

    mouseX = x;
    mouseY = y;
    e.preventDefault();
}

function handleMousemove(e) {
    var sens = 1000;
    pmouseX = mouseX;
    pmouseY = mouseY;
    var x = parseInt(e.pageX) || parseInt(e.changedTouches[0].pageX);
    var y = parseInt(e.pageY) || parseInt(e.changedTouches[0].pageY);
    if (Math.abs(x - pmouseX) >= 0.1) {mouseX = x;} else {mouseX = pmouseX;}
    if (Math.abs(y - pmouseY) >= 0.1) {mouseY = y;} else {mouseY = pmouseY;}

    //change rotation
    if (mouseDown===true) {
        console.log(mouseX, pmouseX);
        console.log(rotX, rotY,rotZ);
        rotX = rotX - (mouseY - pmouseY) / sens;
        rotY = rotY - (mouseX - pmouseX) / sens;
        console.log(rotX, rotY,rotZ);
        render();
    }
    e.preventDefault();
}




function initialRender(){
    sizeCanvas();
    render();
}

window.addEventListener('resize', initialRender, false);




//render function
var ELEMENTS = [];

function render() {
    //start performance timer
    var t0 = performance.now();
    //clear canvas
    ctx.clearRect(-canvas.width, -canvas.height, 2 * canvas.width, 2 * canvas.height);

  
    for (var i = 0; i < ELEMENTS.length; i++) {
        //rotate the nodes
        for (var j = 0; j < ELEMENTS[i].nodes.length; j++) {
          //  console.log(rotX, rotY, rotZ);
           // console.log(ELEMENTS[i].nodes[j]);
            
            rotateX(ELEMENTS[i].nodes[j], rotX);
            rotateY(ELEMENTS[i].nodes[j], rotY);
            rotateZ(ELEMENTS[i].nodes[j], rotZ);
        }
        //draw the element
        ELEMENTS[i].draw(scale);
    }
    //end performance timer
    var t1 = performance.now();
    console.log("Render took " + (t1 - t0) + " milliseconds.")
}












