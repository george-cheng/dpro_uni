<template>
	<view class="payMethod mainBox">
		<view class="perCon">
			<view  @click=" isClick && myArrowEvent('1', otcBusinessType)">
				<view class="conLft">
					<view class="conIcon i-legal"></view>
					<text class="lftTit">法币商家认证</text>
				</view>
				<view class="conRgt">
					<text class="rgtInfo">{{otcBusinessType == '2'? '已认证' : '未认证'}}</text>
					<view class="conIcon i-rgtArrow"></view>
				</view>
			</view>
			<view  @click="isClick && myArrowEvent('2', treatyBusinessType)">
				<view class="conLft">
					<view class="conIcon i-contract"></view>
					<text class="lftTit">合约商家认证</text>
				</view>
				<view class="conRgt">
					<text class="rgtInfo">{{treatyBusinessType == '2' ? '已认证' : '未认证'}}</text>
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
				otcBusinessType: '',
				treatyBusinessType: '',
				isClick: false
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
			myArrowEvent(index, category){
				if(category == 1){
					uni.reLaunch({
						url: '/pages/my/applicant/applicant?type=' + index,
						success: () => {}
					})
				}else{
					uni.reLaunch({
						url: '/pages/my/applicant/unBindApplicant?type=' + index,
						success: () => {}
					})
				}
			},
			getFrontSession(){
				this.ajaxJson({
					url: '/api/v1/frontSession',
					call: (data)=>{
						if(data.code == 200){
							this.otcBusinessType = data.data.otcBusinessType
							this.treatyBusinessType = data.data.treatyBusinessType
							this.isClick = true
							uni.setStorage({
								key: 'userSession',
								data: data.data,
								success: () => {}
							})
						}
					}
				})
			}
		},
		created() {
			this.getFrontSession()
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
	.payMethod{
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
