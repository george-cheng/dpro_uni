<template>
	<view class="payMethod mainBox">
		<view class="payMethodCon">
			<view>
				<view class="payMethodName">姓名</view>
				<input type="text" v-model="payName" placeholder="请输入您的姓名">
			</view>
			<view>
				<view class="payMethodAcc">账号</view>
				<input type="text" v-model="payAcc" placeholder="请输入您的账号">
			</view>
			<view>
				<view class="payMethodRemark">收款备注</view>
				<input type="text" v-model="payRemark" placeholder="请输入备注信息">
			</view>
			<view>
				<view class="payMethodRemark">收款二维码</view>
				<image :src="url + payQrCode" mode="aspectFit" v-if="isPayQrCode"></image>
			</view>
		</view>
		<view class="payMethodBtn" @click="payMethodBtnEvent">
			<button type="default">{{btnTxt}}</button>
		</view>
	</view>
</template>
<script>
	export default {
		data(){
			return{
				data: {},
				payName: '',
				payAcc: '',
				payRemark: '',
				isPayQrCode: true,
				payAddQrCode: '',
				btnTxt: '',
				category: '',
				previewImgUrl: '',
				upLoadImgFile: {},
				url: 'https://dpro-main.oss-cn-hongkong.aliyuncs.com/', 
			}
		},
		onLoad(options) {
			this.data = JSON.parse(decodeURIComponent(options.data))
			this.category = options.category
			if(this.category == 0){
				uni.setNavigationBarTitle({
					title: '微信',
					success: () => {
						this.btnTxt = '解绑'
						this.payName = this.data.fuName
						this.payAcc = this.data.fweChat
						this.payRemark = this.data.fwxpayRemarks
						this.payQrCode = this.data.fwxpayReCode
					}
				});
			}else{
				uni.setNavigationBarTitle({
					title: '支付宝',
					success: () => {
						this.btnTxt = '解绑'
						this.payName = this.data.fuName
						this.payAcc = this.data.falipay
						this.payRemark = this.data.falipayRemarks
						this.payQrCode = this.data.falipayReCode
					}
				});
			}
		},
		methods: {
			payMethodBtnEvent(){
				let bindParams = {}
				if(this.category == 0){
					bindParams = {
						fuName: this.data.fuName,
						fweChat: 'null'
					}
				}else{
					bindParams = {
						fuName: this.data.fuName,
						falipay: 'null'
					}
				}
				this.ajaxJson({
					url: '/api/v1/updateFuserAccount',
					method: 'POST',
					data: bindParams,
					call: (data)=>{
						if(data.code == 200){
							uni.showToast({
								title: data.msg
							})
							setTimeout(()=>{
								uni.redirectTo({
									url: './payMethod'
								})
							}, 1000)
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

		}
	}
</script>

<style scoped lang="scss">
	.payMethod{
		.payMethodCon{
			margin: 0 35rpx;
		}
		.payMethodCon>view:nth-of-type(4){
			border-bottom: none;
		}
		.payMethodCon>view{
			height: 144rpx;
			border-bottom: 1px solid #f2f2f2;
			view{
				font-size: 26rpx;
				color: #999;
				margin-top: 24rpx;
			}
			input{
				margin-top: 50rpx;
			}
			image{
				margin-top: 30rpx;
			}
		}
		.payMethodBtn{
			width: 78%;
			margin: 0 78rpx;
			position: absolute;
			bottom: 40rpx;
			button{
				background-color: #BD3A3B;
				color: #fff;
			}
		}
	}
	.previewImg{
		width: 112rpx;
		height: 112rpx;
	}
</style>
