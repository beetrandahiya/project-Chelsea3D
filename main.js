var tx = 0;
var ty = 0;
var tz = 0;

var scale = 1;
var scale_pers = 200;

var orthoproj = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 0]
];
//todo: make a perspective projection matrix

var cameraPos = [0, 0, 300];
var minDistance = 0.1;
var maxDistance = 1000;
var fov = 90;
var width = 600;
var height = 600;

var projection = "orthographic"; // "perspective" or "orthographic"
var d = 95;


// make a point element
class point3D {
    constructor(x, y, z, fill, fill_opacity, stroke, stroke_width) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.stroke = stroke || "#000";
        this.stroke_width = stroke_width * scale || 1;
        this.fill = fill || "#000";
        this.fill_opacity = fill_opacity || 1;

        var rot = rotater(tx, ty, tz, x, y, z);
        if (projection == "orthographic") {
            var proj = math.multiply(orthoproj, [rot[0], rot[1], rot[2]]);
            var proj = math.multiply(scale, proj)
        } else if (projection == "perspective") {

            //make a perspective projection matrix with camera at (300,300,300) 
            var persproj = perspectiveProjectionMatrix(cameraPos, minDistance, maxDistance, fov, width, height);
            // Apply the perspective transformation
            var proj = math.multiply(persproj, [rot[0], rot[1], rot[2], 1]);
            // Normalize the resulting point
            var normproj = math.divide(proj, proj.get([3]));

            var proj = math.multiply(scale_pers, normproj).toArray();
        }

        this.circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.circle.setAttributeNS(null, "cx", WIDTH / 2 + proj[0]);
        this.circle.setAttributeNS(null, "cy", HEIGHT / 2 + proj[1]);
        this.circle.setAttributeNS(null, "r", this.stroke_width);
        this.circle.setAttributeNS(null, "stroke", this.stroke);
        this.circle.setAttributeNS(null, "stroke-width", this.stroke_width);
        this.circle.setAttributeNS(null, "fill", this.fill);
        this.circle.setAttributeNS(null, "fill-opacity", this.fill_opacity);
        this.avg_point = rot[2];
        this.circle.setAttributeNS(null, "avg_point", this.avg_point);
        this.type = "point";
        svg.appendChild(this.circle);
        return this;
    }
}

// make a line element
class line3D {
    constructor(x1, y1, z1, x2, y2, z2, stroke, stroke_width, linecap = "butt", dasharray = "") {
        this.x1 = x1;
        this.y1 = y1;
        this.z1 = z1;
        this.x2 = x2;
        this.y2 = y2;
        this.z2 = z2;
        this.stroke = stroke;
        this.stroke_width = stroke_width * scale;
        this.linecap = linecap;
        this.dasharray = dasharray;

        this.rot1 = rotater(tx, ty, tz, x1, y1, z1);
        this.rot2 = rotater(tx, ty, tz, x2, y2, z2);

        if (projection == "orthographic") {
            var proj1 = math.multiply(orthoproj, [this.rot1[0], this.rot1[1], this.rot1[2]]);
            var proj1 = math.multiply(scale, proj1)
            var proj2 = math.multiply(orthoproj, [this.rot2[0], this.rot2[1], this.rot2[2]]);
            var proj2 = math.multiply(scale, proj2)
        } else if (projection == "perspective") {
            var persproj = perspectiveProjectionMatrix(cameraPos, minDistance, maxDistance, fov, width, height);

            var proj1 = math.multiply(persproj, [this.rot1[0], this.rot1[1], this.rot1[2], 1]);
            var normproj1 = math.divide(proj1, proj1.get([3]));
            var proj1 = math.multiply(scale_pers, normproj1).toArray();

            var proj2 = math.multiply(persproj, [this.rot2[0], this.rot2[1], this.rot2[2], 1]);
            var normproj2 = math.divide(proj2, proj2.get([3]));
            var proj2 = math.multiply(scale_pers, normproj2).toArray();
        }

        this.line = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.line.setAttributeNS(null, "d", `M ${WIDTH / 2 + proj1[0]},${HEIGHT / 2 + proj1[1]} L ${WIDTH / 2 + proj2[0]},${HEIGHT / 2 + proj2[1]}`);
        this.line.setAttributeNS(null, "stroke", this.stroke);
        this.line.setAttributeNS(null, "stroke-width", this.stroke_width);
        this.line.setAttributeNS(null, "stroke-dasharray", this.dasharray);
        this.line.setAttributeNS(null, "stroke-linecap", this.linecap);

        this.line.setAttributeNS(null, "avg_point", (this.rot1[2] + this.rot2[2]) / 2);
        this.type = "line";
        svg.appendChild(this.line);
        return this;

    }
}

// make a circle element
class circle3D {
    constructor(x, y, z, r, n, fill, fill_opacity, stroke, stroke_width) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.n = n;
        this.fill = fill;
        this.fill_opacity = fill_opacity;
        this.stroke = stroke;
        this.stroke_width = stroke_width * scale;

        //get the 4 points of the circle
        this.points = [];
        for (var i = 0; i <= 360; i += 360 / this.n) {
            var x = r * Math.cos(i * Math.PI / 180);
            var y = r * Math.sin(i * Math.PI / 180);
            var z = this.z;
            var rot = rotater(tx, ty, tz, x, y, z);
            if (projection == "orthographic") {
                var proj = math.multiply(orthoproj, [rot[0], rot[1], rot[2]]);
                var proj = math.multiply(scale, proj)
            } else if (projection == "perspective") {
                var persproj = perspectiveProjectionMatrix(cameraPos, minDistance, maxDistance, fov, width, height);
                var proj = math.multiply(persproj, [rot[0], rot[1], rot[2], 1]);
                var normproj = math.divide(proj, proj.get([3]));
                var proj = math.multiply(scale_pers, normproj).toArray();
            }

            this.points.push([WIDTH / 2 + proj[0], HEIGHT / 2 + proj[1]]);
        }
        this.polygon = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.polygon.setAttributeNS(null, "d", this.pathd());
        this.polygon.setAttributeNS(null, "stroke", this.stroke);
        this.polygon.setAttributeNS(null, "stroke-width", this.stroke_width);
        this.polygon.setAttributeNS(null, "fill", this.fill);
        this.polygon.setAttributeNS(null, "fill-opacity", this.fill_opacity);
        this.polygon.setAttributeNS(null, "avg_point", rot[2]);
        this.type = "circle";
        svg.appendChild(this.polygon);
        return this;
    }
    pathd() {
        var dtext = " M " + this.points[0][0] + "," + this.points[0][1];
        for (var i = 0; i < this.points.length; i++) {
            dtext += "L " + this.points[i][0] + "," + this.points[i][1] + " ";

        }
        if (this.close) {
            dtext += "Z";
        }

        return dtext;
    }
    rotate(angleX, angleY, angleZ) {
        //remove the old polygon
        this.polygon.remove();
        this.points = [];
        for (var i = 0; i <= 360; i += 360 / this.n) {
            var x = this.r * Math.cos(i * Math.PI / 180);
            var y = this.r * Math.sin(i * Math.PI / 180);
            var z = this.z;
            var rot = rotater(angleX, angleY, angleZ, x, y, z);
            var rot_final = rotater(tx, ty, tz, rot[0], rot[1], rot[2]);

            if (projection == "orthographic") {
                var proj = math.multiply(orthoproj, [rot_final[0], rot_final[1], rot_final[2]]);
                var proj = math.multiply(scale, proj)
            } else if (projection == "perspective") {
                var persproj = perspectiveProjectionMatrix(cameraPos, minDistance, maxDistance, fov, width, height);
                var proj = math.multiply(persproj, [rot_final[0], rot_final[1], rot_final[2], 1]);
                var normproj = math.divide(proj, proj.get([3]));
                var proj = math.multiply(scale_pers, normproj).toArray();
            }

            this.points.push([WIDTH / 2 + proj[0], HEIGHT / 2 + proj[1]]);
        }
        this.polygon = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.polygon.setAttributeNS(null, "d", this.pathd());
        this.polygon.setAttributeNS(null, "stroke", this.stroke);
        this.polygon.setAttributeNS(null, "stroke-width", this.stroke_width);
        this.polygon.setAttributeNS(null, "fill", this.fill);
        this.polygon.setAttributeNS(null, "fill-opacity", this.fill_opacity);
        this.avg_point = [this.x, this.y, this.z];
        this.polygon.setAttributeNS(null, "avg_point", '["' + this.x + '","' + this.y + '","' + this.z + '"]');
        this.type = "circle";
        svg.appendChild(this.polygon);
        return this;
    }
}


// make a polygon element
class polygon3D {
    constructor(points, fill, fill_opacity, stroke, stroke_width, close = false) {
        this.points = points;
        this.fill = fill;
        this.fill_opacity = fill_opacity;
        this.stroke = stroke;
        this.stroke_width = stroke_width * scale;
        this.close = close;

        this.polygon = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.polygon.setAttributeNS(null, "d", this.pathd());
        this.polygon.setAttributeNS(null, "stroke", this.stroke);
        this.polygon.setAttributeNS(null, "stroke-width", this.stroke_width);
        this.polygon.setAttributeNS(null, "fill", this.fill);
        this.polygon.setAttributeNS(null, "fill-opacity", this.fill_opacity);
        this.avg_point = [0, 0, 0];
        for (var i = 0; i < this.points.length; i++) {
            this.avg_point[0] += this.points[i][0];
            this.avg_point[1] += this.points[i][1];
            this.avg_point[2] += this.points[i][2];
        }
        this.avg_point[0] = this.avg_point[0] / this.points.length;
        this.avg_point[1] = this.avg_point[1] / this.points.length;
        this.avg_point[2] = this.avg_point[2] / this.points.length;
        var rot = rotater(tx, ty, tz, this.avg_point[0], this.avg_point[1], this.avg_point[2]);
        this.polygon.setAttributeNS(null, "avg_point", rot[2]);
        this.type = "polygon";
        svg.appendChild(this.polygon);
        return this;
    }
    pathd() {
        var rot = rotater(tx, ty, tz, this.points[0][0] * scale, this.points[0][1] * scale, this.points[0][2] * scale);

        if (projection == "orthographic") {
            var proj = math.multiply(orthoproj, [rot[0], rot[1], rot[2]]);
            var proj = math.multiply(scale, proj)
        } else if (projection == "perspective") {
            var persproj = perspectiveProjectionMatrix(cameraPos, minDistance, maxDistance, fov, width, height);
            var proj = math.multiply(persproj, [rot[0], rot[1], rot[2], 1]);
            var normproj = math.divide(proj, proj.get([3]));
            var proj = math.multiply(scale_pers, normproj).toArray();
        }

        var x1 = WIDTH / 2 + proj[0];
        var y1 = HEIGHT / 2 + proj[1];

        var dtext = " M " + x1 + "," + y1;
        for (var i = 0; i < this.points.length; i++) {
            //rotate the points

            var rot = rotater(tx, ty, tz, this.points[i][0] * scale, this.points[i][1] * scale, this.points[i][2] * scale);

            if (projection == "orthographic") {
                var proj = math.multiply(orthoproj, [rot[0], rot[1], rot[2]]);
                var proj = math.multiply(scale, proj)
            } else if (projection == "perspective") {
                var persproj = perspectiveProjectionMatrix(cameraPos, minDistance, maxDistance, fov, width, height);
                var proj = math.multiply(persproj, [rot[0], rot[1], rot[2], 1]);
                var normproj = math.divide(proj, proj.get([3]));
                var proj = math.multiply(scale_pers, normproj).toArray();
            }

            var x = WIDTH / 2 + proj[0];
            var y = HEIGHT / 2 + proj[1];
            dtext += "L " + x + "," + y + " ";
        }
        if (this.close) {
            dtext += "Z";
        }
        return dtext;
    }
}

// make a cube element

class cube3D {
    constructor(x,y,z,l,b,h,fill,fill_opacity,stroke,stroke_width){
        // x, y, z are the top left corner of the cube\
        this.x = x;
        this.y = y;
        this.z = z;
        this.l = l;
        this.b = b;
        this.h = h;
        this.fill = fill;
        this.fill_opacity = fill_opacity;
        this.stroke = stroke;
        this.stroke_width = stroke_width * scale;

        this.points = [
            [this.x,this.y,this.z],
            [this.x+this.l,this.y,this.z],
            [this.x+this.l,this.y+this.b,this.z],
            [this.x,this.y+this.b,this.z],
            [this.x,this.y,this.z+this.h],
            [this.x+this.l,this.y,this.z+this.h],
            [this.x+this.l,this.y+this.b,this.z+this.h],
            [this.x,this.y+this.b,this.z+this.h]
        ];

        //make the lines
        this.lines = [
            [this.points[0],this.points[1]],
            [this.points[1],this.points[2]],
            [this.points[2],this.points[3]],
            [this.points[3],this.points[0]],
            [this.points[4],this.points[5]],
            [this.points[5],this.points[6]],
            [this.points[6],this.points[7]],
            [this.points[7],this.points[4]],
            [this.points[0],this.points[4]],
            [this.points[1],this.points[5]],
            [this.points[2],this.points[6]],
            [this.points[3],this.points[7]]
        ];

        //make the faces
        this.faces = [
            [this.points[0],this.points[1],this.points[2],this.points[3]],
            [this.points[4],this.points[5],this.points[6],this.points[7]],
            [this.points[0],this.points[1],this.points[5],this.points[4]],
            [this.points[1],this.points[2],this.points[6],this.points[5]],
            [this.points[2],this.points[3],this.points[7],this.points[6]],
            [this.points[3],this.points[0],this.points[4],this.points[7]]
        ];

        //make the polygons
        this.polygons = [];
        for(var i=0;i<this.faces.length;i++){
            this.polygons.push(new polygon3D(this.faces[i],this.fill,this.fill_opacity,'#0000',this.stroke_width,true));
        }

        //make the lines
        for(var i=0;i<this.lines.length;i++){
            new line3D(this.lines[i][0][0],this.lines[i][0][1],this.lines[i][0][2],this.lines[i][1][0],this.lines[i][1][1],this.lines[i][1][2],this.stroke,this.stroke_width,'butt','');
        }

        this.type = "cube";
    }
}










//////////////////////////
// MOUSE INTERACTION
//////////////////////////

function addMouseInteraction(elem) {

    // *** Mouse rotate. ***	
    var mouseX = 0,
        mouseY = 0,
        pmouseX, pmouseY; // mouseX is current mouse x-coordinate, pmouseX is previous mouse x-coordinate when it was 1 pixel different.  
    // Figure must rotate iff mousemove AND mousedown (for mouse devices):
    var mouseDown = false;
    elem.addEventListener("mousedown", handleMousedown, false);
    elem.addEventListener("touchstart", handleMousedown, false);
    document.addEventListener("mouseup", function (e) {
        if (mouseDown) mouseDown = false;
        elem.style.cursor = "grab";
    }, false);
    elem.addEventListener("mousemove", handleMove, false);
    elem.addEventListener("touchmove", handleMove, false);


    function handleMousedown(e) {
        if (!mouseDown) mouseDown = true;
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
        if (Math.abs(x - pmouseX) >= 1) {
            mouseX = x;
        } else {
            mouseX = pmouseX
        }
        if (Math.abs(y - pmouseY) >= 1) {
            mouseY = y;
        } else {
            mouseY = pmouseY
        }

        // change rotation
        //if(e.which==1 || e.buttons==1) {
        if (mouseDown === true) {
            ty = ty + (mouseX - pmouseX) / sensetivity;
            tx = tx - (mouseY - pmouseY) / sensetivity;
        }
        e.preventDefault();
    };
    // *** END Mouse rotate. ***

    // *** Mouse zoom. ***
    var zoomSpeed = 0.1;
    var zoomSpeed_pers = 2.5;
    elem.addEventListener("wheel", handleWheel, false);

    function handleWheel(e) {
        var delta = e.deltaY || e.detail || e.wheelDelta;
        if (projection == "orthographic") {
            if (delta > 0) {
                if (scale > 0.1) {
                    scale = scale - zoomSpeed;
                } else {
                    scale = 0.1;
                }
            } else {
                scale = scale + zoomSpeed;
            }
        } else if (projection == "perspective") {
            if (delta > 0) {
                if (scale_pers > 10) {
                    scale_pers = scale_pers - zoomSpeed_pers;
                } else {
                    scale_pers = 10;
                }

            } else {
                scale_pers = scale_pers + zoomSpeed_pers;
            }
        }

        e.preventDefault();
    };
    // *** END Mouse zoom. ***


    //ctrl + mousemove to change to pan the view
    /*
        document.addEventListener("keydown", function (e) {
            if (e.ctrlKey) {
                elem.addEventListener("mousedown", handleMousedownPan, false);
                elem.addEventListener("touchstart", handleMousedownPan, false);
                document.addEventListener("mouseup", function (e) {
                    if (mouseDown) mouseDown = false;
                    elem.style.cursor = "grab";
                }, false);
                elem.addEventListener("mousemove", handleMovePan, false);
                elem.addEventListener("touchmove", handleMovePan, false);



            function handleMousedownPan(e) {
                if (!mouseDown) mouseDown = true;
                elem.style.cursor = "grabbing";
                var x = parseInt(e.pageX) || parseInt(e.changedTouches[0].pageX);
                var y = parseInt(e.pageY) || parseInt(e.changedTouches[0].pageY);
                mouseX = x;
                mouseY = y;
                e.preventDefault();
            };

            function handleMovePan(e) { 
                var sensetivity = 100; // how sensitive the mouse should be
                // getting mouseX, mouseY, pmouseX and pmouseY.
                pmouseX = mouseX;
                pmouseY = mouseY;

                var x = parseInt(e.pageX) || parseInt(e.changedTouches[0].pageX);
                var y = parseInt(e.pageY) || parseInt(e.changedTouches[0].pageY);
                if (Math.abs(x - pmouseX) >= 1) {
                    mouseX = x;
                } else {
                    mouseX = pmouseX
                }
                if (Math.abs(y - pmouseY) >= 1) {
                    mouseY = y;
                } else {
                    mouseY = pmouseY
                }

                console.log("panning")
                //change position of the camera
                if (mouseDown === true) {
                    cameraPos[0] = cameraPos[0] + (mouseX - pmouseX) / sensetivity;
                    cameraPos[1] = cameraPos[1] - (mouseY - pmouseY) / sensetivity;
                }
                e.preventDefault();
                    }
                }
            }, false);
            */

}




//rotater

function rotater(angleX, angleY, angleZ, x, y, z) {
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
    return rot;
}






//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
///// Perspective projection
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

function perspectiveProjectionMatrix(cameraPos, minDistance, maxDistance, fov, width, height) {


    // Define the near and far planes
    const nearPlane = minDistance;
    const farPlane = maxDistance;

    // Calculate the aspect ratio
    const aspectRatio = width / height;

    // Calculate the tangent of half the field of view angle
    const tanHalfFov = Math.tan((fov / 2) * (Math.PI / 180));

    // Calculate the projection matrix
    const projectionMatrix = math.matrix([
        [1 / (aspectRatio * tanHalfFov), 0, 0, 0],
        [0, 1 / tanHalfFov, 0, 0],
        [0, 0, -(farPlane + nearPlane) / (farPlane - nearPlane), -(2 * farPlane * nearPlane) / (farPlane - nearPlane)],
        [0, 0, -1, 0]
    ]);

    // Calculate the translation matrix
    const translationMatrix = math.matrix([
        [1, 0, 0, -cameraPos[0]],
        [0, 1, 0, -cameraPos[1]],
        [0, 0, 1, -cameraPos[2]],
        [0, 0, 0, 1]
    ]);

    // Combine the projection and translation matrices
    const perspectiveMatrix = math.multiply(projectionMatrix, translationMatrix);

    return perspectiveMatrix;

}


// order the elements in the array by their distance from the camera
function orderElements() {
    //get the svg elements
    var elements = svg.children;
    //sort the elements by their distance from the camera
    var elements_sorted = [];
    for (var i = 0; i < elements.length; i++) {
        elements_sorted.push(elements[i]);
    }
    elements_sorted.sort(function (a, b) {
        //sort according to the z value of the average point
        var a_avg_point = parseInt(a.getAttribute("avg_point"));
        var b_avg_point = parseInt(b.getAttribute("avg_point"));
        return -b_avg_point + a_avg_point;
    });
    //remove the elements from the svg
    for (var i = 0; i < elements.length; i++) {
        elements[i].remove();
    }
    //add the elements back to the svg in the correct order
    for (var i = 0; i < elements_sorted.length; i++) {
        svg.appendChild(elements_sorted[i]);
    }
}


// clear the canvas
function setCanvas(elem) {
    WIDTH = elem.clientWidth;
    HEIGHT = elem.clientHeight;
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttributeNS(null, "width", WIDTH);
    svg.setAttributeNS(null, "height", HEIGHT);
    elem.appendChild(svg);
}

function clearCanvas() {
    while (svg.firstChild) {
        svg.removeChild(svg.lastChild);
    }
}