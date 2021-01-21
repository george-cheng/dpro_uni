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
				<view class="payMethodRemark">添加收款二维码</view>
				<!-- <input type="file" v-model="payAddQrCode" v-if="!payQrCode"> -->
				
				<view class="upLoadImg" v-if="!isPayQrCode">
					<view class="upLoadImgBtn" @click="chooseUpLoadImg">上传图片</view>
					<image class="previewImg" :src="previewImgUrl" mode="aspectFit"></image>
				</view>
				
				<image :src="payQrCodeImg" mode="" v-if="isPayQrCode"></image>
			</view>
		</view>
		<view class="payMethodBtn" @click="isClick && payMethodBtnEvent()">
			<button type="default">{{btnTxt}}</button>
		</view>
	</view>
</template>

<script>
	import axios from '../../../js_sdk/gangdiedao-uni-axios/index.js'
	import { unimixin } from '../../../utils/unimixin.js'
	export default {
		mixins: [ unimixin ],
		data(){
			return{
				data: {},
				payName: '',
				payAcc: '',
				payRemark: '',
				payQrCodeImg: '',
				payAddQrCode: '',
				btnTxt: '',
				category: '',
				previewImgUrl: '',
				upLoadImgFile: {},
				isPayQrCode: false,
				isValidator: false,
				url: 'https://dpro-main.oss-cn-hongkong.aliyuncs.com/', 
			}
		},
		onLoad(options) {
			this.category = options.category
			if(this.category == 0){
				uni.setNavigationBarTitle({
					title: '微信',
					success: () => {
						this.btnTxt = '绑定'
					}
				});
			}else{
				uni.setNavigationBarTitle({
					title: '支付宝',
					success: () => {
						this.btnTxt = '绑定'
					}
				});
			}
		},
		methods: {
			chooseUpLoadImg(){
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res)=>{
						this.isPayQrCode = true
						this.upLoadImgFile = res.tempFilePaths
						this.payQrCodeImg = res.tempFilePaths[0]
					}
				});
			},
			validator(){
				if(!this.payName){
					uni.showToast({
						image: '../../../static/images/wrong.png',
						title: '请输入您的姓名'
					})
					this.isValidator = false
				}else if(!this.payAcc){
					uni.showToast({
						image: '../../../static/images/wrong.png',
						title: '请输入您的账号'
					})
					this.isValidator = false
				}else if(!this.upLoadImgFile[0]){
					uni.showToast({
						image: '../../../static/images/wrong.png',
						title: '请添加收款二维码'
					})
					this.isValidator = false
				}else{
					this.isValidator = true
				}
			},
			payMethodBtnEvent(){
				this.isClick = false
				let params = {}
				let name = ''
				if(this.category == 0){
					name = 'wxpayReCode'
					params = {
						fuName: this.payName,
						fweChat: this.payAcc,
						fwxpayRemarks: this.payRemark,
					}
				}else{
					name = 'alipayReCode'
					params = {
						fuName: this.payName,
						falipay: this.payAcc,
						falipayRemarks: this.payRemark,
					}
				}
				this.validator()
				
				if(this.isValidator){
					this.ajaxUpload({
						url: '/api/v1/updateFuserAccount',
						filePath: this.upLoadImgFile[0],
						name: name,
						formData: params,
						call: (data1)=>{
							this.isClick = true
							let result = JSON.parse(data1);
							if(result.code == 200){
								uni.showToast({
									title: result.msg
								})
								setTimeout(()=>{
									uni.redirectTo({
										url: './payMethod'
									})
								}, 1000)
							}else{
								uni.showToast({
									title: result.msg,
									image: '../../../static/images/wrong.png'
								})
							}
						}
					})
				}
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
				color: $c3;
				margin-top: 24rpx;
			}
			input{
				margin-top: 50rpx;
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
