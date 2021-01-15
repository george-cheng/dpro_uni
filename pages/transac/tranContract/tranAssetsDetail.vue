<template>
	<view class="tranAssetsDetail mainBox">
		<view class="tranAssetsCon">
			<text>释放数量：{{tranAssetsDetail.return_amount}}</text>
			<text>进入虫洞数量：{{tranAssetsDetail.destroy_amount }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				id: '',
				tranAssetsDetail: []
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		methods: {
			getTranAssetsDetail(){
				this.ajaxJson({
					url: '/api/v1/treatyReturnLog/count',
					data: { purchId: this.id },
					call: (data)=>{
						if(data.code == 200){
							this.tranAssetsDetail = data.data
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
			this.getTranAssetsDetail()
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
