var backgroundcolor = "#cccccc";
var drawers = [];
var fps = 60;
var loopDuration = 5;
var step = 0;
var focusedDrawer = null;
var focusedIndex = -1;
var mouseDown = 0;

window.onload = function(){
	canvas 	= document.getElementById("canvas");
	gc 		= canvas.getContext("2d");

	checkPoints 	= document.getElementById("points");
	checkLines	 	= document.getElementById("lines");
	checkCurve 		= document.getElementById("curve");
	mc 		= document.getElementById("mainColor");
	cc 		= document.getElementById("curveColor");
	fmc 	= document.getElementById("fMainColor");
	fcc 	= document.getElementById("fCurveColor");

	document.addEventListener("mousedown", function( event ) {
		mouseDown = 1;
		var rect = canvas.getBoundingClientRect();
		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;

		focusedIndex = -1;
		focusedDrawer = null;
		drawers.forEach(function(drawer){
			for(var i = 0; i < drawer.points.length; i++){
				var dX = drawer.points[i][0] - x;
				var dY = drawer.points[i][1] - y;
				if(Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2)) < 5){
					focusedDrawer = drawer;
					focusedIndex = i;
					break;
				}
			}
		});
	}, false);

	document.addEventListener("mouseup", function( event ) {
		down = 0;
		focusedIndex = -1;
	}, false);

	document.addEventListener("mousemove", function( event ) {
		cursorPos = [event.clientX, event.clientY];

		var rect = canvas.getBoundingClientRect();
		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;
		var hover = false;
		drawers.forEach(function(drawer){
			for(var i = 0; i < drawer.points.length; i++){
				var dX = drawer.points[i][0] - x;
				var dY = drawer.points[i][1] - y;
				if(Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2)) < 5){
					hover = true;
				}
			}
		});
		if(hover){
			document.getElementById("canvas").style.cursor = "pointer";
		}else{
			document.getElementById("canvas").style.cursor = "default";
		}
		if(focusedIndex != -1){
			focusedDrawer.movePoint(focusedIndex, x, y);
		}
	}, false);

	document.addEventListener("keyup", function(event){
//		console.log(event.key + " - " + cursorPos[0] + "|" + cursorPos[1]);
		if(event.key == "+"){
			var rect = canvas.getBoundingClientRect();
			var x = cursorPos[0] - rect.left;
			var y = cursorPos[1] - rect.top;
			if(focusedDrawer != null){
				focusedDrawer.addPoint(x, y);
			}else{
				var newDrawer = new Drawer(x, y);
				drawers.push(newDrawer);
				focusedDrawer = newDrawer;
			}
			
//			document.getElementById("numberInput").value = lines.length - 1;
		}
		else if(event.key == "-"){
			if(focusedDrawer != null){
				focusedDrawer.removeLastPoint();
				if(focusedDrawer.points.length == 0){
					drawers.splice(drawers.indexOf(focusedDrawer));
				}
			}
		}
		else if(event.key == "f"){
			launchFullScreen(canvas);
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
//			gc.scale(window.innerWidth / dimensions[0], window.innerHeight / dimensions[1]);
		}else if(event.key == "Esc"){
			canvas.width = dimensions[0];
			canvas.height = dimensions[1];
//			gc.scale(1 / window.innerWidth / dimensions[0], 1 / window.innerHeight / dimensions[1]);
		}
	}, false);

	interval = setInterval(update, 1000 / fps);
}

function update(){
	var maxSteps = loopDuration * fps;
	step = (step + 1) % maxSteps;

	drawers.forEach(function(drawer){
		drawer.step(step, maxSteps);
	});

	render();
}

function render(){
	gc.fillStyle = backgroundcolor;
	gc.fillRect(0, 0, canvas.width, canvas.height);

	drawers.forEach(function(drawer){
		if(drawer == focusedDrawer){
			drawer.mainColor = fmc.value;
			drawer.curveColor = fcc.value;
		}else{
			drawer.mainColor = mc.value;
			drawer.curveColor = cc.value;
		}

		if(checkPoints.checked){
			drawer.drawPoints(gc);
		}
		if(checkLines.checked){
			drawer.drawLns(gc);
		}
		if(checkCurve.checked){
			drawer.drawCurve(gc);
		}
	});
}

function changeDuration(){
	loopDuration = document.getElementById("duration").value;
}

function changeFPS(){
	fps = document.getElementById("fps").value;
	clearInterval(interval);
	interval = setInterval(update, 1000 / fps);
}