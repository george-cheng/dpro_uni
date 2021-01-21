<template>
	<view class="forgetPwd noNavMainBox">
		<view class="forgetPwdBox">
			<view>
				<input type="text" v-model="name" placeholder="请输入手机号或邮箱" />
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
			<view>
				<input v-model="password" :password="isPassword" placeholder="请设置登陆密码">
				<span @click="pwdEvent" class="iconLogin i-eye"></span>
			</view>
			<text class="pwdTip">提示：8位字符及以上</text>
			<view>
				<input v-model="confirmPassword" :password="isConfirmPassword" placeholder="请确认登录密码">
				<span @click="confirmPwdEvent" class="iconLogin i-eye"></span>
			</view>
			
			
			<view class="btnBox" @click="isClick && forgetPassowrdEvent()">
				<button type="default">确认</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { checkEmail, checkPhone, checkPwd } from '../../utils/common.js'
	export default {
		data(){
			return{
				name: '',
				verTxt: '获取验证码',
				isFlag: true,
				msgCode: '',
				msgPhCode: '',
				password: '',
				confirmPassword: '',
				isPassword: true,
				isConfirmPassword: true,
				isValidator: false,
			}
		},
		onLoad() {

		},
		onNavigationBarButtonTap(e){
			if(e.float == 'left'){
				uni.navigateTo({
					url: '/pages/loginIn/loginIn',
					success: () => {}
				})
			}
		},
		methods: {
			forgetPassowrdEvent(){
				this.validator()
				if(this.isValidator){
					let params = {
						name: this.name,
						code: this.msgCode,
						pwd: this.password
					}
					this.ajaxJson({
						url: '/api/v1/findPwd',
						method: 'POST',
						data: params,
						call: (data)=>{
							if(data.code == 200){
								uni.showToast({
									title: data.msg,
									success: () => {}
								})
								setTimeout(()=>{
									uni.reLaunch({
										url: '/pages/loginIn/loginIn'
									})
								}, 500)
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
			pwdEvent(){
				this.isPassword = !this.isPassword
			},
			confirmPwdEvent(){
				this.isConfirmPassword = !this.isConfirmPassword
			},
			/* 短信验证码粘贴 */
			pasteEvent(){
				uni.getClipboardData({
					success: (res) => {
						this.msgCode = res.data
					}
				});
			},
			getMeg(){
				let indexOf = this.name.indexOf('.')
				if(indexOf != -1){
					if(!checkEmail(this.name)){
						uni.showToast({
							image: '/static/images/wrong.png',
							title: '邮箱输入错误',
							success: () => {
								this.name = ''
							}
						})
					}else{
						this.getSecVerCode()
					}
				}else{
					if(!checkPhone(this.name)){
						uni.showToast({
							image: '/static/images/wrong.png',
							title: '手机号输入错误',
							success: () => {
								this.name = ''
							}
						})
					}else{
						this.getSecVerCode()
					}
				}
			},
			getSecVerCode(){
				let timer
				let count = 60
				clearInterval(timer)
				this.sendVerMsg()
				if(this.isFlag && ( checkEmail(this.name) || checkPhone(this.name))){
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
				if(!this.name){
					uni.showToast({
						icon: 'none',
						title: '邮箱地址为空或错误，请重新输入'
					})
					this.isValidator = false
				}else if(!this.msgCode){
					uni.showToast({
						icon: 'none',
						title: '密码错误或两次密码输入不一样'
					})
					this.isValidator = false
				}else if(!checkPwd(this.password) || this.password !== this.confirmPassword){
					uni.showToast({
						icon: 'none',
						title: '密码错误或两次密码输入不一样'
					})
					this.isValidator = false
				}else{
					this.isValidator = true
				}
			}
		},
		created() {

		}
	}
</script>

<style scoped lang="scss">
	.forgetPwd{
		.forgetPwdBox{
			view{
				position: relative;
				input{
					margin: 34rpx auto 0;
					width: 584rpx;
					height: 80rpx;
					border: 1px solid #F2F2F2;
					border-radius: 6px;
					color: #999;
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
