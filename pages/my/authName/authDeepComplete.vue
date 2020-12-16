<template>
	<view class="authComplete mainBox">
		<view class="img">
			<image src="../../../static/images/authcomplete.png" mode=""></image>
		</view>
		<text class="loadTip">高级身份认证通过</text>
		<view class="authInfo">
			<view class="authName">
				<text>姓名：</text>
				<text>{{userInfo.name}}</text>
			</view>
			<view class="authId">
				<text>身份证号码：</text>
				<text>{{userInfo.no.toString().replace(/^(\d{6})(\d{8})(\d{4})/g , '$1********$3')}}</text>
			</view>
		</view>
		<view class="loginBtn">
			<button @click="authBack" type="default">返回</button>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				userInfo: '',
				category: '',
			}
		},
		onLoad(options) {
			this.category = options.category
		},
		methods: {
			authBack(){
				let url = '/pages/my/my'
				if(this.category){
					url = '/pages/transac/transacMain'
				}
				uni.switchTab({
					url: url
				})
			},
			getUserInfoStroage(){
				uni.getStorage({
					key: 'userSession',
					success: (data)=>{
						this.userInfo = data.data
					}
				})
			}
		},
		created() {
			this.getUserInfoStroage()
		}
	}
</script>

<style scoped lang="scss">
	.authComplete{
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
			color: #fff;
			font-size: 32rpx;
			display: flex;
			justify-content: center;
		}
		.loadTxt{
			margin-top: 30rpx;
			color: #fff;
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
		.authInfo{
			display: inline-flex;
			justify-content: center;
			flex-direction: column;
			text-align: center;
			width: 100%;
			margin: 0 auto;
			.authName, .authId{
				display: flex;
				flex-direction: column;
				justify-content: center;

				text{
					color: #fff;
					display: flex;
					justify-content: center;
					margin-top: 10rpx;
				}
			}
		}
	}
</style>
