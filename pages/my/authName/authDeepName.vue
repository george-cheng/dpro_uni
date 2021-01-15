<template>
	<view class="authDeep mainBox">
		<view class="deepTip">
			请拿出本人有效证件准备拍摄，拍摄时请确保证件边框完整、字 迹清晰、亮度均匀，确保照片和个人签字内容清晰可见
		</view>
		<view class="upIdImg">
			<view class="idPositive" @click="positiveChooseImg">
				<view class="upImg">
					<image :src="reserveImg" mode="aspectFit"></image>
				</view>
				<text>上传正面</text>
			</view>
			<view class="idReverse" @click="reverseChooseImg">
				<view class="upImg">
					<image :src="positiveImg" mode="aspectFit"></image>
				</view>
				<text>上传反面</text>
			</view>
		</view>
		
		<view class="upPersonImg" @click="personChooseImg">
			<view class="idPerson">
				<image :src="idPersonImg" mode="aspectFit"></image>
			</view>
			<text>· 手持证件照</text>
		</view>
		
		
		<view class="loginBtn">
			<button @click="authNameDeepEvent" type="default">完成</button>
		</view>
		
	</view>
</template>

<script>
	export default {
		data(){
			return{
				upLoadPosImgFile: {},
				upLoadResImgFile: {},
				upLoadPerImgFile: {},
				
				fIdentityPath1: '',
				fIdentityPath2: '',
				fIdentityPath3: '',
				
				isUpload1: false,
				isUpload2: false,
				isUpload3: false,
				
				reserveImg: '../../../static/images/reserveId.png',
				positiveImg: '../../../static/images/positiveid.png',
				idPersonImg: '../../../static/images/id3.png'
			}
		},
		onLoad() {

		},
		methods: {
			authNameDeepEvent(){
				if(!this.isUpload1){
					uni.showToast({
						image: '../../../static/images/wrong.png',
						title: '请上传身份证正面'
					})
				}else if(!this.isUpload2){
					uni.showToast({
						image: '../../../static/images/wrong.png',
						title: '请上传身份证反面'
					})
				}else if(!this.isUpload3){
					uni.showToast({
						image: '../../../static/images/wrong.png',
						title: '请上传个人签字'
					})
				}else{
					let params = {
						fIdentityPath1: this.fIdentityPath1,
						fIdentityPath2: this.fIdentityPath2,
						fIdentityPath3: this.fIdentityPath3,
					}
					this.ajaxJson({
						url: '/api/v1/account/uploadAuth',
						method: 'POST',
						data: params,
						call: (data)=>{
							if(data.code == 200){
								uni.showToast({
									title: data.msg,
									success: () => {
										uni.reLaunch({
											url: '/pages/my/my'
										})
									}
								})
							}else{
								uni.showToast({
									image: '../../../static/images/wrong.png',
									title: data.msgCode
								})
							}
						}
					})
					
					
				}
			},
			positiveChooseImg(){
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						this.upLoadPosImgFile = res.tempFilePaths
						this.reserveImg = res.tempFilePaths[0]
						
						this.ajaxUpload({
							url: '/api/v1/account/upload',
							method: 'POST',
							filePath: res.tempFilePaths[0],
							name: 'img',
							call: (data)=>{
								let result = JSON.parse(data)
								if(result.code == 200){
									this.fIdentityPath1 = result.data
									this.isUpload1 = true
								}else{
									uni.showToast({
										title: result.msg
									})
								}
							}
						})
						
					}
				})
			},
			reverseChooseImg(){
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						this.upLoadResImgFile = res.tempFilePaths
						this.positiveImg = res.tempFilePaths[0]
						
						this.ajaxUpload({
							url: '/api/v1/account/upload',
							method: 'POST',
							filePath: res.tempFilePaths[0],
							name: 'img',
							call: (data)=>{
								let result = JSON.parse(data)
								if(result.code == 200){
									this.isUpload2 = true
									this.fIdentityPath2 = result.data
								}else{
									uni.showToast({
										title: result.msg
									})
								}
							}
						})
						
					}
				})
			},
			personChooseImg(){
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						this.upLoadPerImgFile = res.tempFilePaths
						this.idPersonImg = res.tempFilePaths[0]
						
						this.ajaxUpload({
							url: '/api/v1/account/upload',
							method: 'POST',
							filePath: res.tempFilePaths[0],
							name: 'img',
							call: (data)=>{
								let result = JSON.parse(data)
								if(result.code == 200){
									this.isUpload3 = true
									this.fIdentityPath3 = result.data
								}else{
									uni.showToast({
										title: result.msg
									})
								}
							}
						})
						
					}
				})
			}
		},
		created() {

		}
	}
</script>

<style scoped lang="scss">
	.authDeep{
		.deepTip{
			padding: 30rpx 40rpx;
			background-color: #fff;
			font-size: 24rpx;
			color: #676869;
		}
		.upIdImg{
			margin: 20rpx 35rpx;
			display: flex;
			justify-content: space-between;
			.idPositive, .idReverse{
				.upImg{
					width: 320rpx;
					height: 200rpx;
					border: 1px solid #f2f2f2;
					border-radius: 6rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #999;
					image{
						width: 100%;
						height: 100%;
					}
				}
				text{
					margin-top: 20rpx;
					color: #999;
					display: flex;
					justify-content: center;
				}
			}
		}
		.upPersonImg{
			margin: 20rpx 35rpx;
			.idPerson{
				width: 680rpx;
				height: 350rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
			text{
				margin-top: 20rpx;
				color: #999;
				display: flex;
				justify-content: center;
				font-size: 24rpx;
			}
		}
		.loginBtn{
			margin: 100rpx auto 0;
			width: 594rpx;
			button{
				background-color: #FF6153;
				color: #fff;
			}
		}
	}
</style>
