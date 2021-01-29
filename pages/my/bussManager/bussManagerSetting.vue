<template>
	<view class="bussManagerSetting mainBox">
		<view class="perCon">
			<view  @click="myArrowEvent(0)" v-if="isLegal">
				<view class="conLft">
					<view class="conIcon i-legal"></view>
					<text class="lftTit">法币商家管理</text>
				</view>
				<view class="conRgt">
					<text class="rgtInfo"></text>
					<view class="conIcon i-rgtArrow"></view>
				</view>
			</view>
			<view  @click="myArrowEvent(1)" v-if="isContract">
				<view class="conLft">
					<view class="conIcon i-contract"></view>
					<text class="lftTit">合约商家管理</text>
				</view>
				<view class="conRgt">
					<text class="rgtInfo"></text>
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
				isLegal: false,
				isContract: false,
			}
		},
		onLoad() {

		},
		onNavigationBarButtonTap(e){
			if(e.float == 'left'){
				uni.reLaunch({
					url: '/pages/my/my',
					success: () => {}
				})
			}
		},
		methods: {
			myArrowEvent(index){
				if(index == 0){
					uni.reLaunch({
						url: '/pages/my/bussManager/legalBussManager/legalBussManager',
						success: () => {}
					})
				}else{
					uni.reLaunch({
						url: '/pages/my/bussManager/treatyBussManager/treatyBussManager',
						success: () => {}
					})
				}
			},
			getBussManagerInfo(){
				uni.getStorage({
					key: 'userSession',
					success: (data) => {
						if(data.data.otcBusinessType == 2){
							this.isLegal = true
						}else{
							this.isLegal = false
						}
						
						if(data.data.treatyBusinessType == 2){
							this.isContract = true
						}else{
							this.isContract = false
						}
					}
				})
			}
		},
		created() {
			this.getBussManagerInfo()
		}
	}
</script>

<style scoped lang="scss">
	.i-legal::before{
		color: #C22E2E;
	}
	.i-contract::before{
		color: #F2994A;
	}
	.bussManagerSetting{
		.perCon>view{
			border-top: 1px solid #F2F2F2;
		}
		.perCon{
			background-color: #fff;
			margin-top: 12rpx;
			view{
				height: 112rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 0 10rpx;
				color: #fff;
				.conRgt{
					.conIcon{
						color: #999;
					}
				.rgtInfo{
					color: $c3;
				}
				}
				.conLft{
					.lftTit{
						color: $c3;
					}
				}
			}
			view:first-child{
				border-top: none;
			}
		}
		.i-zfb:before,.i-wx:before{
			color: $c3;
		}
	}
</style>
