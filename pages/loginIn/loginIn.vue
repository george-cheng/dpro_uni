<template>
	<view class="noNavMainBox loginIn">
		<view class="logo">
			<image src="../../static/logo.jpg" mode="aspectFit"></image>
		</view>
		<view class="loginSwitch">
			<text :class="[isPoneActive?'textLine' : '']" @click="phoneEvent">手机登录</text>
			<text :class="[isEmailActive?'textLine' : '']" @click="emailEvent">邮箱登录</text>
		</view>
		<view class="loginBox">
			<view class="loginEmail loginIpt" v-if="isEmail">
				<view>
					<input type="text" v-model="emailUser" placeholder="请输入邮箱地址">
					<span @click="downArrowEvent" class="iconLogin i-downArrow" v-if="false"></span>
					<view class="dropDownCOn" v-if="isDropdown">
						<text @click="historyEvent(item)" v-for="(item, index) in historyEmailArr" :key="index">{{item}}</text>
					</view>
				</view>
				<view>
					<input :password="isPassword" v-model="emailPwd" placeholder="请输入登录密码">
					<span @click="eyeEvent" class="iconLogin i-eye"></span>
				</view>
				<view>
					<input v-if="isVerCode" v-model="verCode" placeholder="请输入验证码">
					<span @click="eyeEvent" class="iconLogin "></span>
				</view>
			</view>
			<view class="loginPhone loginIpt" v-if="isPhone">
				<view>
					<input type="text" v-model="phoneUser" placeholder="请输入手机号码">
					<span @click="downArrowPhoneEvent" class="iconLogin i-downArrow" v-if="false"></span>
					<view class="dropDownCOn" v-if="isDropdown">
						<text @click="historyPhoneEvent(item)" v-for="(item, index) in historyPhoneArr" :key="index">{{item}}</text>
					</view>
				</view>
				<view>
					<input :password="isPhPassword" v-model="phonePwd" placeholder="请输入登录密码">
					<span @click="eyePhEvent" class="iconLogin i-eye"></span>
				</view>
			</view>
		</view>
		<view class="loginBtn" >
			<button :style="{backgroundColor: isClick ? '#B8393C' :'#ccc'}" @click="isClick && loginBtnEvent()" type="default">登录</button>
		</view>
		<view class="loginBtm">
			<view @click="forgetPwdEvent">忘记密码？</view>
			<view @click="registerEvent">还没有账号，<span>去注册</span></view>
		</view>
	</view>
</template>

<script>
	import { checkEmail, checkPhone, checkPwd } from '../../utils/common.js'
	import { unimixin } from '../../utils/unimixin.js'
	export default{
		mixins: [ unimixin ],
		data(){
			return{
				isEmail: false,
				isPhone: true,
				isDropdown: false,
				emailUser: '',
				emailPwd: '',
				phoneUser: '',
				phonePwd: '',
				isPassword: true,
				isPhPassword: true,
				emailUserArr: [],
				historyEmailArr: [],
				phoneUserArr: [],
				historyPhoneArr: [],
				isEmailActive: false,
				isPoneActive: true,
				isVerCode: false,
				isValidator: false,
				verCode: ''
			}
		},
		onLoad(options) {
			
		},
		methods:{
			emailEvent(){
				this.isPhone = false;
				this.isEmail = true
				this.isEmailActive = true
				this.isPoneActive = false
				this.getUserPhone()
			},
			phoneEvent(){
				this.isPhone = true;
				this.isEmail = false
				this.isEmailActive = false
				this.isPoneActive = true
				this.getUserPhone()
			},
			downArrowEvent(){
				uni.getStorage({
					key: 'emailUser',
					success: (res)=>{
						this.historyEmailArr = res.data
						if(this.historyEmailArr){
							this.isDropdown = !this.isDropdown
						}
					}
				})
			},
			downArrowPhoneEvent(){
				this.isDropdown = !this.isDropdown
				uni.getStorage({
					key: 'phoneUser',
					success: (res)=>{
						this.historyPhoneArr = res.data
					}
				})
			},
			historyEvent(item){
				this.emailUser = item
				this.emailPwd = ''
				this.isDropdown = false
			},
			historyPhoneEvent(item){
				this.phoneUser = item
				this.emailPwd = ''
				this.isDropdown = false
			},
			eyeEvent(){
				this.isPassword = !this.isPassword
			},
			eyePhEvent(){
				this.isPhPassword = !this.isPhPassword
			},
			validator(){
				this.isClick = true
				if(this.isEmail){
					if(checkEmail(this.emailUser) && checkPwd(this.emailPwd)){						
						if(this.emailUser){
							this.isValidator = true
							uni.setStorageSync('emailUser', this.emailUser);
							uni.setStorageSync('emailPwd', this.emailPwd);
						}
					}else{
						uni.showToast({
							icon: 'none',
							title: '邮箱格式不正确或密码错误，请重新输入',
							success: () => {}
						})
					}
				}else{ 
					if(checkPhone(this.phoneUser) && checkPwd(this.phonePwd)){
						if(this.phoneUser){
							this.isValidator = true
							uni.setStorageSync('phoneUser', this.phoneUser);
							uni.setStorageSync('phonePwd', this.phonePwd);
						}
					}else{
						uni.showToast({
							icon: 'none',
							title: '手机号码格式不正确或密码错误，请重新输入',
							success: () => {}
						})
					}
				}
			},
			loginBtnEvent(){
				this.isClick = false
				let params = {}
				if(this.isEmail){
					params = {
						name: this.emailUser.toString(),
						pwd: this.emailPwd.toString(),
					}
				}else{
					 params = {
						name: this.phoneUser.toString(),
						pwd: this.phonePwd.toString(),
					}
				}
				
				this.validator()
				if(this.isValidator){
					let category = '1'
					if(this.isEmail){
						category = '0'
					}
					this.ajaxJson({
						url: '/api/v1/login',
						method: 'POST',
						data: params,
						call: (data)=>{
							this.isClick = true
							if(data.code == 6 || data.code == 7){
								uni.redirectTo({
									url: '/pages/verifica/verifica?category='+ category + '&params=' +  encodeURIComponent(JSON.stringify(params)),
								})
							}else if(data.code == 200){
								uni.showToast({
									title: data.msg,
									success: () => {},
								})
								setTimeout(()=>{
									uni.reLaunch({
										url: '/pages/index/index',
										success: () => {}
									})
								},500)
							}else{
								uni.showToast({
									icon: 'none',
									title: data.msg,
									success: () => {},
								})
							}
						}
					})
				}
			},
			forgetPwdEvent(){
				uni.reLaunch({
					url: '/pages/loginIn/forgetPwd',
					success: () => {}
				})
			},
			registerEvent(){
				uni.navigateTo({
					url: '../register/register'
				})
			},
			
			getUserPhone(){
				if(this.isEmail){
					this.emailUser = uni.getStorageSync('emailUser')
					this.emailPwd = uni.getStorageSync('emailPwd')
				}else{
					this.phoneUser = uni.getStorageSync('phoneUser')
					this.phonePwd = uni.getStorageSync('phonePwd')
				}
			}
		},
		mounted() {
			
		},
		created() {
			this.getUserPhone()
		}
	}
</script>

<style scoped lang="scss">
	.loginIn{
		.logo{
			width: 130rpx;
			height: 152rpx;
			margin: 0 auto;
			padding: 110rpx 0 150rpx 0;
			border-radius: 4rpx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		
		.loginSwitch{
			margin: 0 78rpx;
			display: flex;
			text{
				color: #333;
				font-size: 28rpx;
				line-height: 28rpx;
			}
			text:last-child{
				margin-left: 62rpx;
			}
			.textLine{
				position: relative;
			}
			.textLine::after{
				content: '';
				display: inline-block;
				width: 120rpx;
				height: 4rpx;
				position: absolute;
				bottom: -15rpx;
				left: 0;
				background-color: #B8393C;
			}
		}
		
		.loginBox{
					.loginIpt{
						view{
							position: relative;
							input{
								margin: 68rpx auto 0;
								width: 594rpx;
								height: 80rpx;
								border: 1px solid #F2F2F2;
								border-radius: 6px;
								color: #999;
							}
							input:last-child{
								margin-top: 42rpx;
							}
							.dropDownCOn{
								width: 592rpx;
								margin: 0 auto;
								border: 1px solid #676869;
								border-radius: 6rpx;
								position: absolute;
								top: 96rpx;
								right: 77rpx;
								background-color: $bg;
								z-index: 2;
								text{
									padding: 0 5rpx;
									margin: 0 5rpx;
									display: flex;
									flex-wrap: wrap;
									color: #fff;
									line-height: 48rpx;
								}
							}
							.iconLogin{
								position: absolute;
								right: 100rpx;
								top: 25rpx;
							}
							.i-downArrow::before,.i-eye::before{
								color: #515151;
								font-size: 42rpx;
							}
						}
					}
				}
		.loginBtn{
			margin: 100rpx auto 0;
			width: 594rpx;
			button{
				background-color: #B8393C;
				color: #fff;
			}
		}
		.loginBtm{
			display: flex;
			flex-direction: column;
			justify-content: center;
			width: 100%;
			text-align: center;
			margin: 40rpx auto 0;
			color: $c3;
			view:nth-child(2){
				margin-top: 168rpx;
				span{
					color: #BD3A3B;
				}
			}
		}
	}
</style>
