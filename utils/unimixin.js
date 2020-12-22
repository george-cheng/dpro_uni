const unimixin = {
	data(){
		return {
			url: 'https://dpro-main.oss-cn-hongkong.aliyuncs.com/',
			paddingTop: 0,
			scrollTop: 0
		}
	},
	onPageScroll(res){
		this.scrollTop = res.scrollTop
	},
	methods: {
		touchStart(){
			
		},
		touchMove(){
			if(this.paddingTop > 300){
				this.paddingTop = this.paddingTop
			}else{
				this.paddingTop += 5
			}
		},
	}
}

export { unimixin }