<template>
	<view class="authLoad mainBox">
		<view class="img">
			<image src="../../../static/images/authLoading.png" mode=""></image>
		</view>
		<text class="loadTip">正在审核</text>
		<text class="loadTxt">请您耐心等待...</text>
		<view class="loginBtn" @click="authBack">
			<button type="default">返回</button>
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
			authBack(){
				uni.reLaunch({
					url: '/pages/my/my'
				})
			}
		},
		created() {

		}
	}
</script>

<style scoped lang="scss">
	.authLoad{
		.img{
			width: 140rpx;
			height: 140rpx;
			margin: 170rpx auto 0;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.loadTip{
			margin-top: 60rpx;
			color: $c3;
			font-size: 32rpx;
			display: flex;
			justify-content: center;
		}
		.loadTxt{
			margin-top: 30rpx;
			color: $c3;
			font-size: 26rpx;
			display: flex;
			justify-content: center;
		}
		.loginBtn{
			margin: 500rpx auto 0;
			width: 594rpx;
			button{
				background-color: #FF6153;
				color: #fff;
			}
		}
	}
</style>
