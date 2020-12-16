<template>
	<view class="payMethod mainBox">
		<view class="perCon">
			<view  @click="myArrowEvent(0)">
				<view class="conLft">
					<view class="conIcon i-wx"></view>
					<text class="lftTit">微信</text>
				</view>
				<view class="conRgt">
					<text class="rgtInfo">{{fweChat ? '已激活' : '未激活'}}</text>
					<view class="conIcon i-rgtArrow"></view>
				</view>
			</view>
			<view  @click="myArrowEvent(1)">
				<view class="conLft">
					<view class="conIcon i-zfb"></view>
					<text class="lftTit">支付宝</text>
				</view>
				<view class="conRgt">
					<text class="rgtInfo">{{falipay ? '已激活' : '未激活'}}</text>
					<view class="conIcon i-rgtArrow"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				falipay: '',
				fweChat: '',
				params: {},
				data: {}
			}
		},
		onLoad() {

		},
		methods: {
			myArrowEvent(index){
				if(index == 0){
					if(this.fweChat){
						uni.navigateTo({
							url: './unBindPayMethod?data=' + encodeURIComponent(JSON.stringify(this.data)) + '&category=' + index ,
						})
					}else{
						uni.navigateTo({
							url: './bindPayMethod?category=' + index
						})
					}
				}else{
					if(this.falipay){
							uni.navigateTo({
								url: './unBindPayMethod?data=' + encodeURIComponent(JSON.stringify(this.data)) + '&category=' + index ,
							})
					}else{
						uni.navigateTo({
							url: './bindPayMethod?category=' + index
						})
					}
				}
			},
			getPayMethod(){
				this.ajaxJson({
					url: '/api/v1/findFuserAccountByfuId',
					method: 'POST',
					call: (data)=>{
						if(data.code == 200){
							this.falipay = data.data.falipay
							this.fweChat = data.data.fweChat
							this.data = data.data
						}
					}
				})
			}
		},
		created() {
			this.getPayMethod()
		}
	}
</script>

<style scoped lang="scss">
	.payMethod{
		background-color: #282828;
		.perCon{
			background-color: #303030;
			margin-top: 12rpx;
			view{
				height: 112rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 0 10rpx;
				color: #fff;
				border-top: 1px solid #383838;
				.conRgt{
					.conIcon{
						color: #676869;
					}
				}
			}
			view:first-child{
				border-top: none;
			}
		}
	}
</style>
