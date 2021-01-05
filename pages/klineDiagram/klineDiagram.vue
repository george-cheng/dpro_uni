<template>
	<view class="">
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				symbol: '',
				url: "",
				cnyRate: '',
			}
		},
		onLoad(options) {
			this.symbol = options.symbol
			this.category = options.category
			this.url = '/hybrid/html/kline.html?symbol=' + this.symbol
		},
		onNavigationBarButtonTap(e) {
			if(e.float == 'left') {
				let url = ''
				if(this.category == 0){
					url = '/pages/quotation/quotation'
				}else{
					url = '/pages/transac/transacMain?choiceOn=0'
				}
				uni.reLaunch({
					url: url,
					success() {}
				})
			}
		},
		methods: {
			handleMessage(evt) {  
					console.log('接收到的消息：' + JSON.stringify(evt.detail.data));  
			},
			
			getKlineData(){
				return
				this.ajaxJson({
					url: '/api/v2/market/period',
					data: {symbol: this.symbol, step: '300'},
					call: (data)=>{
					}
				})
			},
			getExRate(){
				uni.getStorage({
					key: 'rate',
					success: (data) => {
						this.cnyRate = data.data.rate
					}
				})
			}
		},
		created() {
			this.getKlineData()
			this.getExRate()
		}
	}
</script>

<style scoped lang="scss">

</style>
