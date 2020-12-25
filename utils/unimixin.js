import { accMul, accAdd } from './common.js'

const unimixin = {
	data(){
		return {
			url: 'https://dpro-main.oss-cn-hongkong.aliyuncs.com/',

			page: 1,
			pageSize: 10,
			pageNum: 0,
			pageTotal: 0,
			
			startY: 0,
			endyY: 0,
			changeY: 0,
			paddingTop: 0,
			scrollTop: 0,
			isUpRefresh: true
		}
	},
	onReachBottom(){
		this.pageNum = Math.ceil( this.pageTotal / this.pageSize)
	},
	onPageScroll(res){
		this.scrollTop = res.scrollTop
	},
	methods: {
		touchStart(e){
			this.startY = e.touches[0].pageY
			this.changeY = 0
		},
		touchMove(e){
			this.endyY = e.changedTouches[0].pageY
			this.changeY = accAdd(this.endyY, accMul(this.startY, -1))
			if(this.paddingTop < 200){
				if(this.changeY > 50){
					this.paddingTop += 5
				}
			}
		},
		
	}
}

export { unimixin }