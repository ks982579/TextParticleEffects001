/*
* creating Pixel effects with text
*/

const h4numpix = document.getElementById("numpix")
const canvas = document.getElementById("canvas01");
const imgGrowth = 3.5;

const mouseObject = {
	x:0,
	y:0,
	r:100
}
let mousetracker = document.getElementById("mouseStuff")
canvas.addEventListener("mousemove",(evnt)=>{
	mouseObject.x = evnt.offsetX-0; //e.x is like an absolute position from top of window
	mouseObject.y = evnt.offsetY-0; //e.y is also absolute position from top of window
	mousetracker.innerText = mouseObject.x +", "+mouseObject.y;
	//console.log(e)
})
canvas.addEventListener("mouseout", (evnt) => {
	mouseObject.x = 10000;
	mouseObject.y = 10000;
	mousetracker.innerText = mouseObject.x +", "+mouseObject.y;
})

canvas.width = 600;
canvas.height = 300;
const ctx = canvas.getContext("2d");
ctx.fillStyle = "rgba(255,0,0,1)";
//ctx.fillRect(10,10,10,10);
const myText = "KSullDev.Space";
ctx.font = "20px bold";
ctx.fillText(myText, 10,20)

//console.log(ctx.measureText(myText));

ctx.fillStyle = "#000";
//ctx.strokeRect(0,0,174,31)
const textMap = ctx.getImageData(0,0,174,31);
//textMap.height = 31, textMap.width = 174

class Pixel{
	constructor(coordX, coordY, radius){
		this.x = coordX;
		this.y = coordY;
		this.basex = coordX;
		this.basey = coordY;
		this.dx = 1000;
		this.dy = 1000;
		this.r = radius;
		this.dist = 500;
		this.close = false;
	}
	distance_between(mouseObj){
		this.dx = mouseObj.x - this.x;
		this.dy = mouseObj.y - this.y;
		this.dist = Math.floor(Math.sqrt(this.dx**2+this.dy**2));
	}
	update(mouseObj){
		this.distance_between(mouseObj)
		if(this.dist < mouseObj.r){
			this.close = true;
			this.x -= (this.dx/this.dist)*5*((1-this.dist/mouseObj.r)**2)
			this.y -= (this.dy/this.dist)*5*((1-this.dist/mouseObj.r)**2)
		} else {
			this.close = false
			if(this.x != this.basex || this.y != this.basey){
				let dx2 = this.basex - this.x
				let dy2 = this.basey - this.y
				let interDist = Math.sqrt((dx2**2+dy2**2))
				if(interDist < 1){
					this.x = this.basex;
					this.y = this.basey;
				} else {
					this.x += (dx2/interDist)*2
					this.y += (dy2/interDist)*2
				}
				
			}
		}
		return null;
	}
	draw(){
		ctx.beginPath();
		if(this.close){
			ctx.arc(this.x,this.y,this.r,0,Math.PI*2)
		} else {
			ctx.arc(this.x,this.y,this.r,0,Math.PI*2)
		}
		ctx.fill()
	}
}

let pixCoord = {"x":0,"y":0} //x,y coordinates

const pixShell = [];
const shift = {"x":0,"y":100}
for(let thisRow = 0; thisRow < textMap.height; thisRow++){
	const shellRow = [];
	for(let thisPix = 0; thisPix < textMap.width*4; thisPix+=4){
		let coord = thisRow*textMap.width*4+thisPix;
		let redPix = textMap.data[coord];
		let grnPix = textMap.data[coord+1];
		let bluPix = textMap.data[coord+2];
		let alphaPix = textMap.data[coord+3];
		if((redPix+grnPix+bluPix+alphaPix)>0){
			pixShell.push(new Pixel(Math.floor(pixCoord.x*imgGrowth)+shift.x,Math.floor(pixCoord.y*imgGrowth*1.5)+shift.y, 1));
		}
		pixCoord.x++
	};
	pixCoord.y++
	pixCoord.x = 0;
}

function animate(){
	ctx.clearRect(0,0,canvas.width,canvas.height)
	for(let eachPix of pixShell){
		eachPix.update(mouseObject);
		eachPix.draw();
	}
	h4numpix.innerText = pixShell.length
	//pixShell.pop() //funny effect
	requestAnimationFrame(animate)
}

animate();


/* ---------------------------------------------------- */
/* ---------------------------------------------------- */
/* ---------------------------------------------------- */
