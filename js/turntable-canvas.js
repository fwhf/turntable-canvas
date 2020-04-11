class TurntableCanvas{
	constructor(dom,config,get,cb){
		this.dom = dom;
		this.width = config.width || 300;
		this.height = config.width || 300;
		this.boundary = config.boundary || 1;
		this.zhizhen = {
			width : config.zhizhen && config.zhizhen.width || 50,
			src : config.zhizhen && config.zhizhen.src || 'http://blog.fwhf.xyz/img/turntable-canvas/zhizhen.png'
		};
		this.bg = {
			width : config.bg && config.bg.width || 20,
			color : config.bg &&  config.bg.color || 'rgb(255,185,74)',
			lampNum : config.bg &&  config.bg.lampNum || 12,
			twinkleType : config.bg &&  config.bg.twinkleType || 0,
			lampColor : config.bg &&  config.bg.lampColor || ['rgb(255,255,255)','rgb(255,234,119)'],
			lampRadius : config.bg &&  config.bg.lampRadius || 3,
			twinkleTime : config.bg &&  config.bg.twinkleTime || 500
		};
		this.prize = {
			bgColor : config.prize && config.prize.bgColor || ['rgb(255,233,204)','rgb(255,247,235)'],
			textColor : config.prize &&  config.prize.textColor || 'rgb(214,155,94)',
			textStyle : config.prize &&  config.prize.textStyle || "16px Georgia",
			textTop : config.prize &&  config.prize.textTop || 14,
			imgTop : config.prize &&  config.prize.imgTop || 40,
    		imgWidth : config.prize &&  config.prize.imgWidth || 32,
    		imgHeight : config.prize &&  config.prize.imgHeight || 32
		};
		this.prizeList = config.prizeList;
        this.deviation = 0;
        for (var i = 0; i < this.prizeList.length;) {
          if (i * 360 / this.prizeList.length > 270) {
            this.deviation = i * 360 / this.prizeList.length - 270;
            break;
          } else {
            i++;
          }
        }

        this.rotate = 180 / this.prizeList.length - this.deviation;
        this.get = get;
        this.cb = cb;
		this.init();
	}
	init(){
		this.time = new Date().getTime();
		this.dom.classList.add("turntable-canvas");
		this.dom.style['width'] = this.width + 'px';
		this.dom.style['height'] = this.height + 'px';
		this.dom.innerHTML = '<canvas class="turntable-canvas-bg ' + this.time + 'bg" width="' + this.width + '" height="' + this.height + '"></canvas><canvas class="turntable-canvas-content ' + this.time + 'content" width="' + this.width + '" height="' + this.height + '"></canvas><img class="turntable-canvas-zhizhen" width="' + this.zhizhen.width + '"src="' + this.zhizhen.src + '">';
		
		this.bgCanvas = document.getElementsByClassName(this.time+'bg')[0];
		this.bgCanvasContext = this.bgCanvas.getContext('2d');
		this.contentCanvas = document.getElementsByClassName(this.time+'content')[0];
		this.contentCanvasContext = this.contentCanvas.getContext('2d');
	    this.contentCanvas.style.transform = 'rotate(' + this.rotate + 'deg)';
	    
		document.getElementsByClassName('turntable-canvas-zhizhen')[0].onclick = ()=>{
			this.start();
		}
		
		this.t = 0;
		this.drawBg();
		this.drawContent();
	}
	drawBg(){
		//绘制背景
        this.bgCanvasContext.clearRect(0, 0, this.width, this.height);
        this.bgCanvasContext.beginPath();
        this.bgCanvasContext.fillStyle = this.bg.color;
        this.bgCanvasContext.arc(this.width / 2, this.height / 2, this.width / 2, 0, 2 * Math.PI);
        this.bgCanvasContext.fill();
        this.bgCanvasContext.closePath();
        //绘制灯
//      if(this.bg.twinkleType == 0){
        	 for (var i = 0; i < this.bg.lampNum; i++) {
		          this.bgCanvasContext.beginPath();
		          this.bgCanvasContext.fillStyle = this.bg.lampColor[(i+this.t)%2];
		          this.bgCanvasContext.arc(this.width / 2 + (this.width / 2 - this.bg.width / 2) * Math.cos(360 / this.bg.lampNum * i * Math.PI / 180), this.height / 2 + (this.height / 2 - this.bg.width / 2) * Math.sin(360 / this.bg.lampNum * i * Math.PI / 180), this.bg.lampRadius, 0, 2 * Math.PI);
		          this.bgCanvasContext.fill();
		          this.bgCanvasContext.closePath();
		    }
//      }
	}
	drawContent(){
		//奖品扇形
        for (var i = 0; i < this.prizeList.length; i++) {
          this.contentCanvasContext.beginPath();

          this.contentCanvasContext.moveTo(this.width / 2, this.height / 2);
          this.contentCanvasContext.lineTo(this.width / 2 + (this.width / 2 - this.bg.width) * Math.cos(360 / this.prizeList.length * i * Math.PI / 180), this.height / 2 + (this.height / 2 - this.bg.width) * Math.sin(360 / this.prizeList.length * i * Math.PI / 180));

          this.contentCanvasContext.arc(this.width / 2, this.height / 2, this.width / 2 - this.bg.width, 360 / this.prizeList.length * Math.PI / 180 * i, 360 / this.prizeList.length * Math.PI / 180 * (i + 1));

          this.contentCanvasContext.moveTo(this.width / 2, this.height / 2);
          this.contentCanvasContext.lineTo(this.width / 2 + (this.width / 2 - this.bg.width) * Math.cos(360 / this.prizeList.length * (i + 1) * Math.PI / 180), this.height / 2 + (this.height / 2 - this.bg.width) * Math.sin(360 / this.prizeList.length * (i + 1) * Math.PI / 180));

          this.contentCanvasContext.fillStyle = this.prize.bgColor[i%this.prize.bgColor.length];

          this.contentCanvasContext.fill();
          this.contentCanvasContext.closePath();
        }
        //绘制文字和图片
        let img = [];
        for (let i = 0; i < this.prizeList.length; i++) {
          img[i] = document.createElement("img");
          img[i].src = this.prizeList[i].imgurl;
          img[i].onload = () => {
            this.contentCanvasContext.save();
            this.contentCanvasContext.beginPath();

            this.contentCanvasContext.translate(this.width / 2, this.height / 2);
            this.contentCanvasContext.rotate((this.deviation - 360 / (this.prizeList.length * 2) * (i * 2 + 1)) * Math.PI / 180);
            this.contentCanvasContext.translate(-this.width / 2, -this.height / 2);

            this.contentCanvasContext.fillStyle = this.prize.textColor;
            this.contentCanvasContext.font = this.prize.textStyle;
            this.contentCanvasContext.textAlign = 'center';
            this.contentCanvasContext.textBaseline = 'top';
            this.contentCanvasContext.fillText(this.prizeList[i].text, this.width / 2, this.bg.width + this.prize.textTop);

            this.contentCanvasContext.drawImage(img[i], this.width / 2 - this.prize.imgWidth / 2, this.bg.width + this.prize.imgTop, this.prize.imgWidth, this.prize.imgHeight)
            this.contentCanvasContext.closePath();
            this.contentCanvasContext.restore();
          }
		}
	}
	start() {
	    this.timerApi = setInterval(() => {
	      this.rotate += 40;
	      this.contentCanvas.style.transform = 'rotate(' + this.rotate + 'deg)';
	    }, 100)
		this.timerTimeout = setInterval(() => {
		  this.t = this.t == 1 ? 0 : 1;
		  this.drawBg();
		}, this.bg.twinkleTime)
	    this.get((i)=>{
	      clearInterval(this.timerApi);
	      this.rotate = 0;
	      this.rotateEnd = 360 * 2 + this.rand(360 / this.prizeList.length * i + this.boundary, 360 / this.prizeList.length * (i + 1) - this.boundary) - this.deviation;
	      var speed = Math.ceil(((this.rotateEnd - this.rotate) / 20));
	      // console.log(this.rotateEnd, speed);
	      this.timerInterval = setInterval(() => {
	        speed = Math.ceil(((this.rotateEnd - this.rotate) / 20));
	        // console.log(this.data.rotate, speed)
	        if (this.rotate + speed >= this.rotateEnd) {
	          this.rotate = this.rotateEnd % 360;
	          this.rotateEnd = this.rotateEnd % 360;
	          var prize = (Math.floor((Math.abs(this.rotate) + this.deviation) / (360 / this.prizeList.length)));
	          if (prize == this.prizeList.length) {
	            prize = 0;
	          }
	          
	          this.cb(this.prizeList[prize]);
	
	          clearInterval(this.timerInterval);
	          clearTimeout(this.timerTimeout);
	        } else {
	          this.rotate = this.rotate + speed;
	        }
	      	this.contentCanvas.style.transform = 'rotate(' + this.rotate + 'deg)';
	      }, 100)
	    })
	}
	rand(n, m) {
	    var c = m - n + 1;
	    return Math.floor(Math.random() * c + n);
	}
}
export default TurntableCanvas