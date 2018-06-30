class Drawer{
	constructor(x, y){
		this.points 	= [[x, y]];
		this.lines		= [];
		this.curve 		= [];

		this.mainColor = "#222222";
		this.curveColor = "#777777";
	}

	static get points(){
		return this.points;
	}

	static get curve(){
		return this.curve;
	}

	static get lines(){
		return this.lines;
	}

	static set mainColor(color){
		this.mainColor = color;
	}

	addPoint(x, y){
		this.points.push([x, y]);
		this.lines.push([]);
		for(var i = 0; i < this.lines.length; i++){
			this.lines[i].push([]);
		}
	}

	removeLastPoint(){
		this.points.pop();
		this.lines.pop();
		for(var i = 0; i < this.lines.length; i++){
			this.lines[i].pop();
		}
	}

	movePoint(index, x, y){
		this.points[index] = [x, y];
	}

	step(number, maxNumber){
		if(this.points.length >= 2){
			if(number == 0){
				this.curve = [];
			}
			var p = number / maxNumber;

			//first loop for "anchorpoints"
			for(var i = 0; i < this.points.length - 1; i++){
				var x = this.points[i][0] + p * (this.points[i + 1][0] - this.points[i][0]);
				var y = this.points[i][1] + p * (this.points[i + 1][1] - this.points[i][1]);
				this.lines[0][i] = [x, y];
			}
			//second loop for complete calculation
			for(var i = 1; i < this.lines.length; i++){
				for(var j = 0; j < this.lines[i].length; j++){
					var x = this.lines[i - 1][j][0] + p * (this.lines[i - 1][j + 1][0] - this.lines[i - 1][j][0]);
					var y = this.lines[i - 1][j][1] + p * (this.lines[i - 1][j + 1][1] - this.lines[i - 1][j][1]);
					this.lines[i][j] = [x, y];
				}
			}
			//add last point as curvepoint
			this.curve.push(this.lines[this.lines.length - 1][0]);
		}
	}

	drawLine(pos1, pos2, color, width, gc){
		gc.strokeStyle = color;
		gc.lineWidth = width;
		gc.beginPath();
		gc.moveTo(pos1[0], pos1[1]);
		gc.lineTo(pos2[0], pos2[1]);
		gc.stroke();
	}

	drawLines(list, color, width, gc){
		for(var i = 0; i < list.length - 1; i++){
			this.drawLine(list[i], list[i + 1], color, width, gc);
		}
	}

	drawCircles(list, color, radius, width, gc){ //void ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise); 2.5 4.5
		gc.strokeStyle = color;
		gc.lineWidth = width;
		for(var i = 0; i < list.length; i++){
			gc.beginPath();
			gc.arc(list[i][0], list[i][1], radius, 0, 2 * Math.PI, false);
			gc.stroke();
		}
	}

	drawPoints(gc){
		this.drawCircles(this.points, this.mainColor, 2.5, 1, gc);
		this.drawCircles(this.points, this.mainColor, 4.5, 1, gc);
	}

	drawLns(gc){
		if(this.points.length > 1){
			this.drawLines(this.points, this.mainColor, 1, gc);

			for(var i = 0; i < this.lines.length; i++){
				this.drawLines(this.lines[i], this.mainColor, 1, gc);
				this.drawCircles(this.lines[i], this.mainColor, 1.5, 1, gc);
			}

			if(this.points.length > 0){
				gc.beginPath();
				gc.arc(this.lines[this.lines.length - 1][0][0], this.lines[this.lines.length - 1][0][1], 1.5, 0, 2 * Math.PI, false);
				gc.stroke();
			}
		}
	}

	drawCurve(gc){
		this.drawLines(this.curve, this.curveColor, 3, gc);
	}
}