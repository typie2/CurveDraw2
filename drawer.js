class Drawer{
	constructor(x, y){
		this.points 	= [[x, y]];
		this.lines		= [];
		this.curve 		= [];
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

	addPoint(x, y){
		this.points.push([x, y]);
		this.lines.push([]);
		for(var i = 0; i < this.lines.length; i++){
			this.lines[i].push([]);
		}
	}

	removeLastPoint(){
		points.pop();
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
}