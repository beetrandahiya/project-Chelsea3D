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
    constructor(x1, y1, z1, x2, y2, z2, stroke, stroke_width, linecap = "rounded", dasharray = "") {
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
    constructor(points, fill, fill_opacity, stroke, stroke_width, close = false, linecap = "rounded", linejoin = "round") {
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
        this.polygon.setAttributeNS(null, "stroke-linecap", linecap);
        this.polygon.setAttributeNS(null, "stroke-linejoin", linejoin);
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
    constructor(x, y, z, l, b, h, fill, fill_opacity, stroke, stroke_width) {
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
            [this.x, this.y, this.z],
            [this.x + this.l, this.y, this.z],
            [this.x + this.l, this.y + this.b, this.z],
            [this.x, this.y + this.b, this.z],
            [this.x, this.y, this.z + this.h],
            [this.x + this.l, this.y, this.z + this.h],
            [this.x + this.l, this.y + this.b, this.z + this.h],
            [this.x, this.y + this.b, this.z + this.h]
        ];

        //make the lines
        this.lines = [
            [this.points[0], this.points[1]],
            [this.points[1], this.points[2]],
            [this.points[2], this.points[3]],
            [this.points[3], this.points[0]],
            [this.points[4], this.points[5]],
            [this.points[5], this.points[6]],
            [this.points[6], this.points[7]],
            [this.points[7], this.points[4]],
            [this.points[0], this.points[4]],
            [this.points[1], this.points[5]],
            [this.points[2], this.points[6]],
            [this.points[3], this.points[7]]
        ];

        //make the faces
        this.faces = [
            [this.points[0], this.points[1], this.points[2], this.points[3]],
            [this.points[4], this.points[5], this.points[6], this.points[7]],
            [this.points[0], this.points[1], this.points[5], this.points[4]],
            [this.points[1], this.points[2], this.points[6], this.points[5]],
            [this.points[2], this.points[3], this.points[7], this.points[6]],
            [this.points[3], this.points[0], this.points[4], this.points[7]]
        ];

        //make the polygons
        this.polygons = [];
        for (var i = 0; i < this.faces.length; i++) {
            this.polygons.push(new polygon3D(this.faces[i], this.fill, this.fill_opacity, this.stroke, this.stroke_width, true));
        }

        //make the lines
         for(var i=0;i<this.lines.length;i++){
            new line3D(this.lines[i][0][0],this.lines[i][0][1],this.lines[i][0][2],this.lines[i][1][0],this.lines[i][1][1],this.lines[i][1][2],this.stroke,this.stroke_width,"round");
        }

        this.type = "cube";
    }
}



class Sphere3D {
    constructor(x, y, z, r, n, fill, fill_opacity, stroke, stroke_width) {
        //generate an icosphere 
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.n = n;
        this.fill = fill;
        this.fill_opacity = fill_opacity;
        this.stroke = stroke;
        this.stroke_width = stroke_width * scale;

        this.points = [];
        this.faces = [];

        //make the 12 vertices of the icosahedron
        var phi = (1 + Math.sqrt(5)) / 2;
        const t = (1.0 + Math.sqrt(5.0)) / 2.0;


        this.vertices = [
            [-1, t, 0],
            [1, t, 0],
            [-1, -t, 0],
            [1, -t, 0],
            [0, -1, t],
            [0, 1, t],
            [0, -1, -t],
            [0, 1, -t],
            [t, 0, -1],
            [t, 0, 1],
            [-t, 0, -1],
            [-t, 0, 1],
        ];

        //make the 20 faces of the icosahedron
        this.faces = [
            [0, 11, 5],
            [0, 5, 1],
            [0, 1, 7],
            [0, 7, 10],
            [0, 10, 11],
            [1, 5, 9],
            [5, 11, 4],
            [11, 10, 2],
            [10, 7, 6],
            [7, 1, 8],
            [3, 9, 4],
            [3, 4, 2],
            [3, 2, 6],
            [3, 6, 8],
            [3, 8, 9],
            [4, 9, 5],
            [2, 4, 11],
            [6, 2, 10],
            [8, 6, 7],
            [9, 8, 1],
        ]


        //make the icosahedron

        //subdivide the faces
        for (var i = 0; i < this.n; i++) {
            var faces2 = [];
            for (var j = 0; j < this.faces.length; j++) {
                var p1 = this.vertices[this.faces[j][0]];
                var p2 = this.vertices[this.faces[j][1]];
                var p3 = this.vertices[this.faces[j][2]];

                //find the midpoints
                var p12 = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2];
                var p23 = [(p2[0] + p3[0]) / 2, (p2[1] + p3[1]) / 2, (p2[2] + p3[2]) / 2];
                var p31 = [(p3[0] + p1[0]) / 2, (p3[1] + p1[1]) / 2, (p3[2] + p1[2]) / 2];

                //normalize the midpoints
                var p12 = normalize(p12);
                var p23 = normalize(p23);
                var p31 = normalize(p31);
                
                //add the new points to the vertices
                this.vertices.push(p12);
                this.vertices.push(p23);
                this.vertices.push(p31);

                //add the new faces
                var ind1 = this.vertices.length - 3;
                var ind2 = this.vertices.length - 2;
                var ind3 = this.vertices.length - 1;

                faces2.push([this.faces[j][0], ind1, ind3]);
                faces2.push([this.faces[j][1], ind2, ind1]);
                faces2.push([this.faces[j][2], ind3, ind2]);
                faces2.push([ind1, ind2, ind3]);
            }
        this.faces = faces2;
    }
        //normalize the vertices
        for (var i = 0; i < this.vertices.length; i++) {
            this.vertices[i] = normalize(this.vertices[i]);
        }

        for (var i = 0; i < this.faces.length; i++) {
            var p1 = this.vertices[this.faces[i][0]];
            var p2 = this.vertices[this.faces[i][1]];
            var p3 = this.vertices[this.faces[i][2]];

            var p1 = [p1[0] * this.r + this.x, p1[1] * this.r + this.y, p1[2] * this.r + this.z];
            var p2 = [p2[0] * this.r + this.x, p2[1] * this.r + this.y, p2[2] * this.r + this.z];
            var p3 = [p3[0] * this.r + this.x, p3[1] * this.r + this.y, p3[2] * this.r + this.z];

            this.points.push(p1);
            this.points.push(p2);
            this.points.push(p3);

            //make the icosahedron
            new polygon3D([p1, p2, p3], this.fill, this.fill_opacity, this.stroke, this.stroke_width, true);
        }
    }
};

function normalize(v) {
    var mag = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return [v[0] / mag, v[1] / mag, v[2] / mag];
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
    var zoomSpeed_pers = 10;
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



// create gradient element for stroke

function createGradient(id, colors) {
    var grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    grad.setAttributeNS(null, "id", id);
    for (var i = 0; i < colors.length; i++) {
        var stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop.setAttributeNS(null, "offset", colors[i][0]);
        stop.setAttributeNS(null, "stop-color", colors[i][1]);
        grad.appendChild(stop);
    }
    svg.appendChild(grad);
    return grad;
}


function interpolateColor(color1, color2, steps) {
    // Parse the color strings and extract the RGB components
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    // Calculate the step size for each color component
    const stepSize = {
        r: (rgb2.r - rgb1.r) / steps,
        g: (rgb2.g - rgb1.g) / steps,
        b: (rgb2.b - rgb1.b) / steps
    };

    // Initialize an array to store the interpolated colors
    const interpolatedColors = [];

    // Generate the interpolated colors
    for (let i = 0; i <= steps; i++) {
        const r = Math.round(rgb1.r + stepSize.r * i);
        const g = Math.round(rgb1.g + stepSize.g * i);
        const b = Math.round(rgb1.b + stepSize.b * i);

        interpolatedColors.push(rgbToHex(r, g, b));
    }

    return interpolatedColors;
}

function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return {
        r,
        g,
        b
    };
}

function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

const color1 = "#FF0000"; // Red
const color2 = "#0000FF"; // Blue
const steps = 5; // Number of colors in between

const interpolatedColors = interpolateColor(color1, color2, steps);

console.log(interpolatedColors);