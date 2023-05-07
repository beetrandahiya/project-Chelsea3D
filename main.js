var tx = 0;
var ty = 0;
var tz = 0;

var scale = 1;
var scale_pers = 100;

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

var projection = "perspective";
var d = 95;

// make a point element
class point3D {
    constructor(x, y, z, stroke, stroke_width) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.stroke = stroke;
        this.stroke_width = stroke_width;

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
        new point(WIDTH / 2 + proj[0], WIDTH / 2 + proj[1], stroke, stroke_width);
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
        this.stroke_width = stroke_width;
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

            var proj1 = math.multiply(persproj, [this.rot1[0], this.rot1[1], this.rot1[2],1]);
            var normproj1 = math.divide(proj1, proj1.get([3]));
            var proj1 = math.multiply(scale_pers, normproj1).toArray();

            var proj2 = math.multiply(persproj, [this.rot2[0], this.rot2[1], this.rot2[2],1]);
            var normproj2 = math.divide(proj2, proj2.get([3]));
            var proj2 = math.multiply(scale_pers, normproj2).toArray();

            
        }

        this.line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        this.line.setAttributeNS(null, "x1", WIDTH / 2 + proj1[0]);
        this.line.setAttributeNS(null, "y1", HEIGHT / 2 + proj1[1]);
        this.line.setAttributeNS(null, "x2", WIDTH / 2 + proj2[0]);
        this.line.setAttributeNS(null, "y2", HEIGHT / 2 + proj2[1]);
        this.line.setAttributeNS(null, "stroke", this.stroke);
        this.line.setAttributeNS(null, "stroke-width", this.stroke_width);
        this.line.setAttributeNS(null, "stroke-dasharray", this.dasharray);
        this.line.setAttributeNS(null, "stroke-linecap", this.linecap);
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
        this.stroke_width = stroke_width;

        //get the 4 points of the circle
        this.points = [];
        for (var i = 0; i <= 360; i += 360 / this.n) {
            var x = r * Math.cos(i * Math.PI / 180);
            var y = r * Math.sin(i * Math.PI / 180);
            var z = this.z;
            var rot = rotater(tx, ty, tz, x * scale, y * scale, z * scale);
            this.points.push([WIDTH / 2 + rot[0], HEIGHT / 2 + rot[1]]);
        }
        this.polygon = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.polygon.setAttributeNS(null, "d", this.pathd());
        this.polygon.setAttributeNS(null, "stroke", this.stroke);
        this.polygon.setAttributeNS(null, "stroke-width", this.stroke_width);
        this.polygon.setAttributeNS(null, "fill", this.fill);
        this.polygon.setAttributeNS(null, "fill-opacity", this.fill_opacity);
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
            var rot = rotater(angleX, angleY, angleZ, x * scale, y * scale, z * scale);
            var rot_final = rotater(tx, ty, tz, rot[0], rot[1], rot[2]);
            this.points.push([WIDTH / 2 + rot_final[0], HEIGHT / 2 + rot_final[1]]);
        }
        this.polygon = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.polygon.setAttributeNS(null, "d", this.pathd());
        this.polygon.setAttributeNS(null, "stroke", this.stroke);
        this.polygon.setAttributeNS(null, "stroke-width", this.stroke_width);
        this.polygon.setAttributeNS(null, "fill", this.fill);
        this.polygon.setAttributeNS(null, "fill-opacity", this.fill_opacity);
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
        this.stroke_width = stroke_width;
        this.close = close;

        this.polygon = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.polygon.setAttributeNS(null, "d", this.pathd());
        this.polygon.setAttributeNS(null, "stroke", this.stroke);
        this.polygon.setAttributeNS(null, "stroke-width", this.stroke_width);
        this.polygon.setAttributeNS(null, "fill", this.fill);
        this.polygon.setAttributeNS(null, "fill-opacity", this.fill_opacity);
        svg.appendChild(this.polygon);
        return this;
    }
    pathd() {
        var rot = rotater(tx, ty, tz, this.points[0][0] * scale, this.points[0][1] * scale, this.points[0][2] * scale);
        var x1 = WIDTH / 2 + rot[0];
        var y1 = HEIGHT / 2 + rot[1];
        var dtext = " M " + x1 + "," + y1;
        for (var i = 0; i < this.points.length; i++) {
            //rotate the points

            var rot = rotater(tx, ty, tz, this.points[i][0] * scale, this.points[i][1] * scale, this.points[i][2] * scale);

            var x = WIDTH / 2 + rot[0];
            var y = HEIGHT / 2 + rot[1];
            dtext += "L " + x + "," + y + " ";
        }
        if (this.close) {
            dtext += "Z";
        }
        return dtext;
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
    var zoomSpeed_pers = 1;
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
                if(scale_pers>10) {
                    scale_pers = scale_pers - zoomSpeed_pers;
                }
                else{
                    scale_pers = 10;
                }

            } else {
                scale_pers = scale_pers + zoomSpeed_pers;
            }
        }

        e.preventDefault();
    };


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


