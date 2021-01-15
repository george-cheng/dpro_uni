<template>
	<view class="tranAssetsDetail mainBox">
		<view class="tranAssetsCon">
			<text>合约名称：{{tranAssetsFailList.treaty_name}}</text>
			<text>抢购标准：{{tranAssetsFailList.ded_amount}}</text>
			<text>纯收益：{{tranAssetsFailList.reward_amount}}</text>
			<text>进入虫洞：{{tranAssetsFailList.destroy_amount}}</text>
			<text>抢购时间：{{tranAssetsFailList.purch_time}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				id: '',
				tranAssetsFailList: [],
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		methods: {
			getTranAssetsFailDetail(){
				this.ajaxJson({
					url: '/api/v1/purchTreatyFailLog/findById',
					data: { purchId: this.id},
					call: (data)=>{
						if(data.code == 200){
							this.tranAssetsFailList = data.data
						}else{
							uni.showToast({
								image: '../../../static/images/wrong.png',
								title: data.msg
							})
						}
					}
				})
			}
		},
		created() {
			this.getTranAssetsFailDetail()
		}
	}
</script>

<style scoped lang="scss">
	.tranAssetsDetail{
		.tranAssetsTit{
			margin-top: 20rpx;
			display: flex;
			justify-content: center;
			color: #999;
			font-size: 36rpx;
			font-weight: bold;
		}
		.tranAssetsCon{
			margin-top: 10rpx;
			display: flex;
			flex-direction: column;
			text-align: center;
			font-size: 26rpx;
			color: #999;
			text{
				margin-top: 10rpx;
			}
		}
	}
</style>
