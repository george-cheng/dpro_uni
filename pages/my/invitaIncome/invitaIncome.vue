<template>
	<view class="invita mainBox">
		<view class="personInfo">
			<view class="infoTit">个人信息</view>
			<view class="infoCon">
				<view>
					<view>登录名：{{userInfo.loginName}}</view>
					<view v-if="userInfo.grade === 0">等级：普通用户</view>
					<view v-if="userInfo.grade === 1">等级：VIP</view>
					<view v-if="userInfo.grade !== 0 && userInfo.grade !== 1">等级：VIP{{ parseInt( userInfo.grade ) -1 }}</view>
				</view>
				<view>
					<view>直推人数：{{userInfo.introCount}}</view>
					<view>团队人数：{{userInfo.introTeamTotal}}</view>
				</view>
				<view>
					<view>直推业绩：{{userInfo.subordinateDedAmount}}</view>
				</view>
			</view>
		</view>
		<view class="invitaTit">扫码推荐</view>
		<image :src="qrCode" mode="" @longtap="downLoad(qrCode)"></image>
		<view @click="linkCopy">
		<view class="linkCopy">邀请注册链接(点击复制)</view>
		<view class="invitaLink">{{invitaLink}}</view>
		</view>
	</view>
</template>

<script>
	import axios from '../../../js_sdk/gangdiedao-uni-axios/index.js'
	export default {
		data(){
			return{
				qrCode: '',
				userInfo: '',
				invitaLink: '',
				category: '',
			}
		},
		onLoad(options) {
			this.category = options.category
		},
		onNavigationBarButtonTap(e) {
			if(e.float == 'right') {
				uni.navigateTo({
					url: '/pages/my/invitaIncome/invitaIncomRecord',
					success: () => {}
				})
			}else{
				let url = ''
				if(this.category == 1){
					url = '/pages/my/my'
				}else if(this.category == 2){
					url = '/pages/index/index'
				}else{
					url = '/pages/holeRedPackage/holeRedPackage'
				}
				uni.reLaunch({
					url: url,
					success() {}
				})
			}
		},
		methods: {
			downLoad(url){
				let base64 = url
				const bitmap = new plus.nativeObj.Bitmap("");
				bitmap.loadBase64Data(base64, function() {
						const url = "_doc/" + new Date().getTime() + ".png";
						bitmap.save(url, {
								overwrite: true,
						}, (i) => {
								uni.saveImageToPhotosAlbum({
										filePath: url,
										success: function() {
												uni.showToast({
														title: '图片保存成功',
												})
												bitmap.clear()
										}
								});
						}, (e) => {
								uni.showToast({
										title: '图片保存失败',
								})
								bitmap.clear()
						});
				}, (e) => {
						uni.showToast({
								title: '图片保存失败',
								icon: 'none'
						})
						bitmap.clear()
				});
			},
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
						this.userInfo = data.data
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
		.personInfo{
			margin: 0 80rpx;
			color: $c3;
			.infoTit{
				display: flex;
				justify-content: center;
				font-size: 24rpx;
				margin-bottom: 30rpx;
			}
			.infoCon{
				view{
					display: flex;
					justify-content: space-between;
					margin-bottom: 10rpx;
					font-size: 26rpx;
				}
			}
		}
		.invitaTit{
			margin: 20rpx 30rpx 0;
			display: flex;
			justify-content: center;
			color: #999;
		}
		image{
			width: 280rpx;
			height: 280rpx;
			margin: 20rpx auto 0;
			display: flex;
			justify-content: center;
		}
		.linkCopy{
			color: $c3;
			margin-top: 20rpx;
			display: flex;
			justify-content: center;
		}
		.invitaLink{
			color: $c3;
			margin-top: 20rpx;
			display: flex;
			justify-content: center;
			font-size: 30rpx;
		}
	}
</style>
