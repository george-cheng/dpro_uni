<template>
	<view class="rechAdd mainBox">
		<view class="rechTit">
				<view>{{name}}</view>
				<view>
				</view>
		</view>
		<view class="qrcode">
			<canvas @click="downloadQrcode" canvas-id="qrcode" style="width: 225px; height: 225px;"></canvas>
		</view>
		<view class="saveQrcode">长按保存相册</view>
		<view class="addresTxt">BTC充值地址</view>
		<view class="addIpt">
			<input type="text" v-model="address" disabled>
			<span class="copy" @click="copyEvent(address)">复制</span>
		</view>
		<view class="addTip">
			<view> · 禁止向地址充值当前之外的资产，任何冲入当前币种地址的非当 前币种资产将不可找回</view>
			<view> · 充值完成后，你可以进入历史页面跟踪进度。历史记录</view>
			<view> · 您的充值地址不会经常改变，可以重复充值；如有更改，我们会 尽量通过网站公告或邮件通知您</view>
			<view> · 请务必确认电脑以及浏览器的安全，防止信息被篡改或泄露</view>
		</view>
	</view>
</template>

<script>
	import uQRCode from '../../js_sdk/Sansnn-uQRCode/uqrcode.js'
	export default {
		data(){
			return{
				addressId: '',
				name: '',
				qrcodeUrl: '',
				address: ''
			}
		},
		onLoad(options) {
			this.addressId = options.id
		},
		methods: {
			copyEvent(item){
				uni.setClipboardData({
					data: item
				})
			},
			downloadQrcode(){
				uni.downloadFile({
					url: this.qrcodeUrl,
					success: (res)=>{
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: ()=>{
								
							}
						})
					}
				})
			},
			getInfoAddress(){
				let params = {
					symbol: this.addressId,
					create: false
				}
				this.ajaxJson({
					url: '/api/v1/account/getCoinAddress',
					data: params,
					call: (data)=>{
						this.name = data.data.name
						this.address = data.data.address
						this.make()
					}
				})
			},
			/* 生成二维码 */
			async make(){
				 var res = await uQRCode.make({
						canvasId: 'qrcode',
						text: this.address,
						size: 225,
						margin: 10,
						backgroundColor: '#ffffff',
						foregroundColor: '#000000',
						fileType: 'jpg',
						errorCorrectLevel: uQRCode.errorCorrectLevel.H
				})
				this.qrcodeUrl = res
			},
		},
		created() {
			this.getInfoAddress()
		}
	}
</script>

<style scoped lang="scss">
	.rechAdd{
		.rechTit{
			margin: 10rpx 35rpx 0;
			padding: 0 30rpx;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border: 1px solid #AAADB1;
			border-radius: 6rpx;
			view{
				color: #fff;
				font-size: 26rpx;
			}
		}
		.qrcode{
			/* margin: 100rpx auto 0;
			width: 225rpx;
			height: 225rpx; */
			canvas{
				margin: 20rpx auto 0;
			}
		}
		.saveQrcode{
			margin: 40rpx auto 0;
			display: flex;
			justify-content: center;
			font-size: 26rpx;
			color: #fff;
		}
		.addresTxt{
			margin-top: 46rpx;
			display: flex;
			justify-content: center;
			font-size: 26rpx;
			color: #676869;
		}
		.addIpt{
			margin: 10rpx 35rpx 0;
			height: 80rpx;
			border: 1px solid #AAADB1;
			border-radius: 6rpx;
			display: flex;
			align-items: center;
			input{
				width: 100%;
				padding-left: 10rpx;
			}
			.copy{
				display: flex;
				flex-wrap: nowrap;
				white-space: nowrap;
				margin-right: 20rpx;
				font-size: 24rpx;
				color: #FF454E;
			}
		}
		.addTip{
			margin: 48rpx 32rpx 0;
			view{
				color: #676869;
				font-size: 24rpx;
				margin-bottom: 30rpx;
			}
		}
	}
</style>
