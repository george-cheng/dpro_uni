<template>
	<view class="setting mainBox">
		<view class="perCon">
			<view @click="myArrowEvent(0)">
				<view class="conLft">
					<view class="conIcon"></view>
					<text class="lftTit">语言设置</text>
				</view>
				<view class="conRgt">
					<text class="rgtInfo">简体中文</text>
					<view class="conIcon"></view>
				</view>
			</view>
			<view @click="myArrowEvent(1)">
				<view class="conLft">
					<view class="conIcon"></view>
					<text class="lftTit">重置登录密码</text>
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
	import { unimixin } from '../../utils/unimixin.js'
	export default {
		mixins: [ unimixin ],
		data(){
			return{
				stateModel: '日间模式'
			}
		},
		onLoad() {

		},
		onNavigationBarButtonTap(e) {
			if(e.float == 'left') {
				uni.reLaunch({
					url: '/pages/my/my',
					success() {}
				})
			}
		},
		methods: {
			myArrowEvent(index){
				if(index == '1'){
					uni.reLaunch({
						url: '/pages/my/resetPwd/resetPwd',
						success: () => {}
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
		.perCon{
			background-color: #fff;
			margin-top: 12rpx;
			view{
				height: 112rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 0 10rpx;
				color: #999;
				border-top: 1px solid #f2f2f2;
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
