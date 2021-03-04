var wheelDraw = function(){
	this.myTime = ''
	this.w2 = ''
	this.h2 = ''
	this.lamp = 0
	this.itemsNum = 8
}

/* canvas初始化 */
wheelDraw.prototype.init = function(ctx, lightSpeed = 500){
	this.ctx = ctx;
	this.wh = 240
	this.getCanvasII(this.wh)
}

/* 获取圆心尺寸 */
wheelDraw.prototype.getCanvasII = function(wh){
	
	let widthII = wh + 30
	let heightII = wh + 30
	this.w2 = parseInt(widthII / 2)
	this.h2 = parseInt( heightII / 2)
	this.light()
	this.myTime = setInterval(this.light.bind(this), 800)
}

wheelDraw.prototype.light = function(){
	var that = this
	var itemsNum = that.itemsNum
	that.lamp++
	if(that.lamp >= 3){
		that.lamp = 0
	}
	
	that.ctx.beginPath()
	that.ctx.arc(that.w2, that.h2, that.w2, 0, 2 * Math.PI)
	that.ctx.fillStyle = '#36A1A9'
	that.ctx.fill()
	for(let i = 0; i < that.itemsNum * 2.5; i++){
		that.ctx.save()
		that.ctx.beginPath()
		that.ctx.translate(that.w2, that.h2)
		that.ctx.rotate(20 * i * Math.PI / 180)
		that.ctx.arc(0, that.h2 - 8, 3, 0 ,2 * Math.PI)
		
		if(that.lamp == 0){
			if(i % 3 == 0){
				that.ctx.fillStyle = "#f00"
			}else if(i % 3 == 1) {
				that.ctx.fillStyle = "#fff"
			}else{
				that.ctx.fillStyle = "#f7f304"
			}
		}else if (that.lamp == 1){
			if(i % 3 == 0){
				that.ctx.fillStyle = "#fff"
			}else if(i % 3 == 1){
				that.ctx.fillStyle = "#f7f304"
			}else{
				that.ctx.fillStyle = "#f00"
			}
		}else{
			if(i % 3 == 0){
				that.ctx.fillStyle = "#f7f304"
			}else if(i % 3 == 1){
				that.ctx.fillStyle = "#f00"
			}else{
				that.ctx.fillStyle = "#fff"
			}
		}
		that.ctx.fill()
		that.ctx.restore()
	}
	that.ctx.draw()
}

export default wheelDraw