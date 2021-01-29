<template>
	<view class="resetPassword mainBox">
		<view class="resetPwdBox">
			<view>
				<input v-model="odlPassword" :password="isOldPassword" placeholder="请输入旧密码">
				<span @click="pwdOldEvent" class="iconLogin i-eye"></span>
			</view>
			<view>
				<input v-model="password" :password="isPassword" placeholder="请输入新密码">
				<span @click="pwdEvent" class="iconLogin i-eye"></span>
			</view>
			<text class="pwdTip">提示：8位字符及以上</text>
			<view>
				<input v-model="confirmPassword" :password="isConfirmPassword" placeholder="请确认新密码">
				<span @click="confirmPwdEvent" class="iconLogin i-eye"></span>
			</view>
			<view class="regMsg">
				<view class="megBox">
					<input type="text" v-model="msgCode" placeholder="请输入短信验证码">
					<span @click="pasteEvent">粘贴</span>
				</view>
				<view class="msgBtn">
					<button @click="getMeg">{{verTxt}}</button>
				</view>
			</view>
			<view class="btnBox" @click="isClick && resetPassowrdEvent()">
				<button type="default">确认</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { checkPwd } from '../../../utils/common.js'
	import { unimixin } from '../../../utils/unimixin.js'
	export default {
		mixins: [ unimixin ],
		data(){
			return{
				name: '',
				odlPassword: '',
				password: '',
				confirmPassword: '',
				msgCode: '',
				
				isOldPassword: true,
				isPassword: true,
				isConfirmPassword: true,
				
				verTxt: '获取验证码',
				isFlag: true,
				isValidator: false,
			}
		},
		onLoad() {

		},
		onNavigationBarButtonTap(e){
			if(e.float == 'left'){
				uni.reLaunch({
					url: '/pages/my/mySetting',
					success: () => {}
				})
			}
		},
		methods: {
			resetPassowrdEvent(){
				this.isClick = false
				this.validator()
				if(this.isValidator){
					let params = {
						oldPwd: this.odlPassword,
						pwd: this.password,
						code: this.msgCode,
						type: '2'
					}
					this.ajaxJson({
						url: '/api/v1/account/modPassWord',
						method: 'POST',
						data: params,
						call: (data)=>{
							this.isClick = true
							if(data.code == 200){
								this.odlPassword = ''
								this.password = ''
								this.confirmPassword = ''
								this.msgCode = ''
								uni.showToast({
									title: data.msg,
									success: () => {}
								})
								setTimeout(()=>{
									uni.reLaunch({
										url: '/pages/my/mySetting',
										success: () => {}
									})
								},500)
							}else{
								uni.showToast({
									image: '/static/images/wrong.png',
									title: data.msg,
									success: () => {}
								})
							}
						}
					})
				}
			},
			pasteEvent(){
				uni.getClipboardData({
					success: (res) => {
						this.msgCode = res.data
					}
				});
			},
			pwdOldEvent(){
				this.isOldPassword = !this.isOldPassword
			},
			pwdEvent(){
				this.isPassword = !this.isPassword
			},
			confirmPwdEvent(){
				this.isConfirmPassword = !this.isConfirmPassword
			},
			getMeg(){
				let timer
				let count = 60
				clearInterval(timer)
				this.sendVerMsg()
				if(this.isFlag){
					this.isFlag = false
					timer = setInterval(()=>{
						count--;
						if(count < 10){
							count = '0' + count
						}
						this.verTxt = count + 's后重新获取'
						if(count == 0){
							clearInterval(timer)
							this.verTxt = '获取验证码'
							this.isFlag = true
						}
					}, 1000)
				}
			},
			sendVerMsg(){
				if(this.isFlag){
					this.ajaxJson({
						url: '/api/v1/sendFindCode',
						method: 'POST',
						data: { name: this.name },
						call: (data)=>{
							if(data.code == 200){
								uni.showToast({
									title: data.msg,
									success: () => {}
								})
							}else{
								uni.showToast({
									image: '/static/images/wrong.png',
									title: data.msg,
									success: () => {}
								})
							}
						}
					})
				}
			},
			validator(){
				if(!this.odlPassword){
					uni.showToast({
						icon: 'none',
						title: '请输入旧密码'
					})
					this.isValidator = false
					this.isClick = true
				}else if(!checkPwd(this.password)){
					uni.showToast({
						icon: 'none',
						title: '请输入新密码'
					})
					this.isValidator = false
					this.isClick = true
				}else if(this.password != this.confirmPassword){
					uni.showToast({
						icon: 'none',
						title: '两次密码输入不一致'
					})
					this.isValidator = false
					this.isClick = true
				}else if(!this.msgCode){
					uni.showToast({
						icon: 'none',
						title: '请输入验证码'
					})
					this.isValidator = false
					this.isClick = true
				}else {
					this.isValidator = true
				}
			},
			getUserSessionInfo(){
				uni.getStorage({
					key: 'userSession',
					success: (data)=>{
						this.name = data.data.loginName
					}
				})
			}
		},
		created() {
			this.getUserSessionInfo()
		}
	}
</script>

<style scoped lang="scss">
	.resetPassword{
		.resetPwdBox{
			view{
				position: relative;
				input{
					margin: 34rpx auto 0;
					width: 584rpx;
					height: 80rpx;
					border: 1px solid #676869;
					border-radius: 6px;
					color: #fff;
				}
				.iconLogin{
					position: absolute;
					right: 100rpx;
					top: 25rpx;
					z-index: 9;
				}
				.i-downArrow::before,.i-eye::before{
					color: #515151;
					font-size: 42rpx;
				}
			}
			.regMsg{
				display: flex;
				.megBox{
					position: relative;
					input{
						margin: 34rpx 30rpx 0 78rpx;
						width: 390rpx;
						text-align: left;
					}
					span{
						position: absolute;
						top: 70rpx;
						right: 50rpx;
						color: #BD3A3B;
						font-size: 24rpx;
						z-index: 9;
						line-height: 24rpx;
					}
				}
				.msgBtn{
					width: 165rpx;
					margin-top: 34rpx;
					button{
						font-size: 24rpx;
						height: 80rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						white-space: nowrap;
						background-color: #ED6B58;
						color: #fff;
					}
					image{
						width: 165rpx;
						height: 80rpx;
						
					}
				}
			}
			.btnBox{
				margin: 520rpx auto 0;
				width: 594rpx;
				button{
					background-color: #BD3A3B;
					color: #fff;
					font-size: 28rpx;
				}
			}
		}
	}
	.pwdTip{
		color: #B8393C;
		font-size: 22rpx;
		margin: 0 80rpx;
	}
</style>
