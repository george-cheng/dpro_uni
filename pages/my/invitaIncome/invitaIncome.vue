<template>
	<view class="invita mainBox">
		<view class="invitaTit">扫码推荐</view>
		<image :src="qrCode" mode=""></image>
		<view class="linkCopy" @click="linkCopy">邀请注册链接(点击复制)</view>
		<view class="invitaLink">{{invitaLink}}</view>
	</view>
</template>

<script>
	import axios from '../../../js_sdk/gangdiedao-uni-axios/index.js'
	export default {
		data(){
			return{
				qrCode: '',
				invitaLink: '',
			}
		},
		onLoad() {

		},
		methods: {
			getQrCode(){
				axios.get('https://www.dpro.ltd/api/v1/findIntroCode',{
					responseType: "arraybuffer",
				}).then((data)=>{
					let uint = new Uint8Array(data.data)
					let base =  uni.arrayBufferToBase64(uint)
					let unit8Array = base
					this.qrCode = "data:image/png;base64," + unit8Array
				})
			},
			linkCopy(){
				uni.setClipboardData({
					data: this.invitaLink,
					success: () => {
						uni.showToast({
							title: '复制成功'
						})
					}
				})
			},
			getSession(){
				uni.getStorage({
					key: 'userInfo',
					success: (data) => {
						this.invitaLink = 'http://www.dproltd.show/test.html?introId=' + data.data.id
					}
				})
			}
		},
		created() {
			this.getQrCode()
			this.getSession()
		}
	}
</script>

<style scoped lang="scss">
	.invita{
		.invitaTit{
			margin: 20rpx 30rpx 0;
			display: flex;
			justify-content: center;
			color: #fff;
		}
		image{
			width: 280rpx;
			height: 280rpx;
			margin: 20rpx auto 0;
			display: flex;
			justify-content: center;
		}
		.linkCopy{
			color: #fff;
			margin-top: 20rpx;
			display: flex;
			justify-content: center;
		}
		.invitaLink{
			color: #fff;
			margin-top: 20rpx;
			display: flex;
			justify-content: center;
			font-size: 30rpx;
		}
	}
</style>
