var backgroundcolor = "#cccccc";
var drawers = [];
var fps = 20;
var loopDuration = 2000;
var step = 0;


window.onload = function(){
	canvas 	= document.getElementById("canvas");
	gc 		= canvas.getContext("2d");

	var d = new Drawer(0, 0);
	d.addPoint(10, 10);
	d.addPoint(20, 143);
	d.addPoint(30, 23);
	d.addPoint(14, 400);

	console.log(d.points);
	d.step(10, 100);
	console.log(d.lines);

	drawers.push(d);

	setInterval(update, 1000 / fps);
}

function update(){
	var maxSteps = loopDuration / fps;
	step = (step + 1) % maxSteps;

	drawers.forEach(function(drawer){
		drawer.step(step, maxSteps);
	});

	render();
}

function render(){
	gc.fillStyle = backgroundcolor;
	gc.fillRect(0, 0, canvas.width, canvas.height);

	drawLines(drawers[0].points, "#222222", 1);

	drawCircles(drawers[0].points, "#222222", 2.5, 1);
	drawCircles(drawers[0].points, "#222222", 4.5, 1);

	for(var i = 0; i < drawers[0].lines.length; i++){
		drawLines(drawers[0].lines[i], "#222222", 1);
		drawCircles(drawers[0].lines[i], "#222222", 1.5, 1);
	}

	if(drawers[0].points.length > 0){
		gc.beginPath();
		gc.arc(drawers[0].lines[drawers[0].lines.length - 1][0][0], drawers[0].lines[drawers[0].lines.length - 1][0][1], 1.5, 0, 2 * Math.PI, false);
		gc.stroke();
	}

	drawLines(drawers[0].curve, "#777777", 3);
}

function drawLine(pos1, pos2, color, width){
	gc.strokeStyle = color;
	gc.lineWidth = width;
	gc.beginPath();
	gc.moveTo(pos1[0], pos1[1]);
	gc.lineTo(pos2[0], pos2[1]);
	gc.stroke();
}

function drawLines(list, color, width){
	for(var i = 0; i < list.length - 1; i++){
		drawLine(list[i], list[i + 1], color, width);
	}
}

function drawCircles(list, color, radius, width){ //void ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise); 2.5 4.5
	gc.strokeStyle = color;
	gc.lineWidth = width;
	for(var i = 0; i < list.length; i++){
		gc.beginPath();
		gc.arc(list[i][0], list[i][1], radius, 0, 2 * Math.PI, false);
		gc.stroke();
	}
}