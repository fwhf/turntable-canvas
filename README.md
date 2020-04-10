# turntable-canvas
canvas绘制转盘插件（可配置）

Vue中使用方法及配置

1.npm下载
```
npm i turntable-canvas
```  
2.import
```
import 'turntable-canvas/css/turntable-canvas.css';
import turntableCanvas from 'turntable-canvas';
```  
3.使用

```
<template>
	<div ref="xxx"></div>
</template>
<script>
export default {
  data () {
  },
  mounted(){
	var TurntableCanvasConfig = {
		//canvas宽高
		width : 300,
		height : 300,
		//防止停止旋转时压住扇形边线，可适当加大
		boundary : 1,
		//指针图片的宽及地址
		zhizhen : {
			width : 50,
			src : ''
		},
		//转盘背景配置
		bg: {
			width : 20,
			color : 'rgb(255,185,74)',
			lampNum : 12,
			twinkleType : 0,
			lampColor : ['rgb(255,255,255)','rgb(255,234,119)'],
			lampRadius : 3,
			twinkleTime : 500
		},
		//转盘奖品配置
		prize: {
			bgColor : ['rgb(255,233,204)','rgb(255,247,235)'],
			textColor : 'rgb(214,155,94)',
			textStyle :  "16px Georgia",
			textTop :  14,
			imgTop : 40,
    		imgWidth : 32,
    		imgHeight : 32
		},
		//奖品列表
	    prizeList: [
	      {
	        text: '奖品一',
	        imgurl: 'http://blog.fwhf.xyz/img/turntable-canvas/koushuidou.png'
	      },
	      {
	        text: '奖品二',
	        imgurl: 'http://blog.fwhf.xyz/img/turntable-canvas/maozi.png'
	      },
	      {
	        text: '奖品一一',
	        imgurl: 'http://blog.fwhf.xyz/img/turntable-canvas/naiping.png'
	      },
	      {
	        text: '奖品',
	        imgurl: 'http://blog.fwhf.xyz/img/turntable-canvas/shuibei.png'
	      },
	      {
	        text: '奖',
	        imgurl: 'http://blog.fwhf.xyz/img/turntable-canvas/xiaohuangya.png'
	      },
	      {
	        text: '奖123',
	        imgurl: 'http://blog.fwhf.xyz/img/turntable-canvas/yingerche.png'
	      },
	    ]
	}
	var turntableCanvas = new this.$turntableCanvas(this.$refs.xxx,TurntableCanvasConfig,(cb)=>{
			//此处放异步请求返回获得了哪个奖项
			console.log('请求中...')
			setTimeout(()=>{
				console.log('请求结束...');
				//假设获得了下标为1的奖，把1传入
				cb(1);
			},1000)
		},(res)=>{
			//转盘停止时返回
			console.log('返回值:',res);
		})
	}
</script>
```  
