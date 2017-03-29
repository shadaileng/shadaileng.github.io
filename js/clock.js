var canvas;

function Clock(){
	canvas = document.createElement('canvas');
	canvas.width = 256;
	canvas.height = 256;
//	document.getElementById('canvas-frame').appendChild(canvas);
	var cxt = canvas.getContext('2d');
	if(cxt){
/*		cxt.beginPath();
		cxt.moveTo(10, 10);
		cxt.lineTo(190, 10);
		cxt.lineTo(190, 190);
		cxt.lineTo(10, 190);
		cxt.closePath();
		cxt.stroke();
*/		
		
		var l = new Line(100, 100, cxt);
		l.rotation = 0;
		var c = new Circle(100, 100, 80, cxt);
		setInterval(function(){
			cxt.clearRect(0, 0, 200, 200);
			l.update();
			c.update();
			l.rotation += 15;
			if(l.rotation == 360) l.rotation = 0;
			console.log( l.rotation + '\n' );
		}, 1000);

	}else{
		alert('您的浏览器不支持Canvas无法预览.\n跟我一起说："Fuck Internet Exploer!"');
	}
}

function CanvasObject(x, y, cxt){
	this.x = x;
	this.y = y;
	this.cxt = cxt;
	this.borderWidth = 2;
	this.borderColor = "#FFFFFF";
	this.rotation = 0;
	this.fill = false;
	this.fillColor = "#FF00FF";
	this.update = function(){
		if(!this.cxt) throw new Error('你没有指定ctx对象。');
		var cxt = this.cxt;
		cxt.save();
		cxt.lineWidth = this.borderWidth;
		cxt.strokeStyle = this.borderColor;
		cxt.fillStyle = this.fillColor;
		cxt.translate(this.x, this.y);
		if(this.fill) cxt.fill();
		if(this.rotation) cxt.rotate(this.rotation * Math.PI / 180);
		if(this.draw) this.draw(cxt);
		cxt.stroke();
		cxt.restore();
	};
};
function Line(x, y, cxt){
	this.line = CanvasObject;
	this.line(x, y, cxt);
	this.borderColor = "#00FF00";
	this.start = [0, 0];
	this.end = [0, -50];
	this.draw = function(cxt){
		cxt.beginPath();
		cxt.moveTo.apply(cxt, this.start);
		cxt.lineTo.apply(cxt, this.end);
		cxt.closePath();
	};
};
function Circle(x, y, radius, cxt){
	this.circle = CanvasObject;
	this.circle(x, y, cxt);
	this.radius = radius;
	this.draw = function(){
		cxt.beginPath();
		cxt.arc(0, 0, this.radius, 0, 2 * Math.PI, true);
		cxt.closePath();
	};
	
}