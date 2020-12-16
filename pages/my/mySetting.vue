<template>
	<view class="setting mainBox">
		<view class="perCon">
			<view  @click="myArrowEvent(0)">
				<view class="conLft">
					<view class="conIcon"></view>
					<text class="lftTit">收款方式</text>
				</view>
				<view class="conRgt">
					<text class="rgtInfo"></text>
					<view class="conIcon i-rgtArrow"></view>
				</view>
			</view>
		</view>
		<view class="settingBtm">
			<button type="default" @click="layoutEvent">退出登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				
			}
		},
		onLoad() {

		},
		methods: {
			myArrowEvent(index){
				if(index == 0){
					uni.navigateTo({
						url: './mySetting/payMethod'
					})
				}
			},
			layoutEvent(){
				this.ajaxJson({
					url: '/api/v1/logout',
					call: (data)=>{
						if(data.code == 200){
							uni.showToast({
								title: data.msg,
								success: () => {
									uni.removeStorage({
										key: 'userSession'
									})
									uni.removeStorage({
										key: 'userInfo'
									})
									
									setTimeout(()=>{
										uni.reLaunch({
											url: '../index/index'
										})
									},500)	
										
									
								}
							})
						}else{
							uni.showToast({
								image: '../../static/images/wrong.png',
								title: data.msg
							})
						}
					}
				})
			}
		},
		created() {

		}
	}
</script>

<style scoped lang="scss">
	.setting{
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
				.conLft{
					
				}
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
		.settingBtm{
			margin: 0 78rpx;
			position: absolute;
			bottom: 50rpx;
			left: 0;
			width: 80%;
			button{
				background-color: #BD3A3B;
				font-size: 28rpx;
				color: #fff;
			}
		}
	}
</style>
