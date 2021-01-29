<template>
	<view class="noNavMainBox register">
		<view class="registerTop">
			<view class="loginSwitch">
				<text :class="[isPoneActive?'textLine' : '']" @click="phoneEvent">手机注册</text>
				<text :class="[isEmailActive?'textLine' : '']" @click="emailEvent">邮箱注册</text>
			</view>
			<view class="loginArea">
				<view class="areaSwitch" @click="switchAreaEvent">
					<text>{{areaName}}</text>
					<text class="areaIcon i-downArrow"></text>
				</view>
				<view class="areaList" v-if="isAreaList">
					<text @click="choiceArea(item)" v-for="(item, index) in areaList" :key="index">{{item.name_cn}}</text>
					<text v-show="false">{{countryId}} </text>
				</view>
			</view>
		</view>
		<view class="regBox">
			<view class="regEmail loginIpt" v-if="isEmail">
				<view>
					<input v-model="emailUser" type="text" placeholder="请设置邮箱地址">
				</view>
				<view v-if="false">
					<view class="phoneBox">
						<text class="preIptConID"> + {{prePhoneNum}}</text>
						<input class="phoneIpt" v-model="phoneUser" type="text" placeholder="请输入您的手机号">
						<span class="iconLogin"></span>
					</view>
				</view>
				<view>
					<input v-model="phonePwd" :password="isPassword" placeholder="请设置登陆密码">
					<span @click="pwdEvent" class="iconLogin i-eye"></span>
				</view>
				<text class="pwdTip">提示：8位字符及以上</text>
				<view>
					<input v-model="confirmPwd" :password="isConfirmPassword" placeholder="请确认登录密码">
					<span @click="confirmPwdEvent" class="iconLogin i-eye"></span>
				</view>
				<!-- <view class="regMsg">
					<view class="megBox">
						<input v-model="verCode" type="text" placeholder="请输入验证码">
					</view>
					<view class="msgBtn" @click="getVerCode">
							<image :src="verImage" mode=""></image>
					</view>
				</view> -->
				<view class="regMsg">
					<view class="megBox">
						<input type="number" v-model="msgCode" placeholder="请输入邮箱验证码">
						<span @click="pasteEvent">粘贴</span>
					</view>
					<view class="msgBtn">
						<button @click="getSecVerCode">{{verTxt}}</button>
					</view>
				</view>
				<view>
					<input v-model="invateCode" placeholder="请输入邀请码(区分大小写)">
					<span @click="invateCodeEvent" class=""></span>
				</view>
			</view>
			<view class="regPhone loginIpt" v-if="isPhone">
				<view>
					<view class="phoneBox">
						<text class="preIptConID"> + {{prePhoneNum}}</text>
						<input class="phoneIpt" v-model="phUser" type="text" placeholder="请输入您的手机号">
						<span class="iconLogin"></span>
					</view>
				</view>
				<view>
					<input v-model="phPwd" :password="isPhPassword" placeholder="请设置登陆密码">
					<span @click="pwdPhEvent" class="iconLogin i-eye"></span>
				</view>
				<text class="pwdTip">提示：8位字符及以上</text>
				<view>
					<input v-model="conPwd" :password="isConfirmPhPassword" placeholder="请确认登录密码">
					<span @click="confirmPhPwdEvent" class="iconLogin i-eye"></span>
				</view>
				<!-- <view class="regMsg">
					<view class="megBox">
						<input v-model="verCode" type="text" placeholder="请输入验证码">
					</view>
					<view class="msgBtn" @click="getVerCode">
							<image :src="verImage" mode=""></image>
					</view>
				</view> -->
				<view class="regMsg">
					<view class="megBox">
						<input type="number" v-model="msgPhCode" placeholder="请输入短信验证码">
						<span @click="pasteEvent">粘贴</span>
					</view>
					<view class="msgBtn">
						<button @click="getSecVerCode">{{verTxt}}</button>
					</view>
				</view>
				<view>
					<input v-model="invatePhCode" placeholder="请输入邀请码(区分大小写)">
					<span @click="invateCodeEvent" class=""></span>
				</view>
			</view>
		</view>
		<view class="regWarn">
			<span class="warnSign i-excla"></span>
			<text>国家或地区注册后不可更改。</text>
		</view>
		<view class="btnBox">
			<view class="regBox">
				<button @click=" isClick && registerBtn()" type="default">注册</button>
			</view>
			
		</view>
		<view class="regTip" >
			<span class="checkIcon" @click="checkTipEvent" :class="[isCheck?'i-checked':'i-check']"></span>
			<text>我已阅读并同意</text> 
			<text class="agreement" @click="serviceAgreementEvent">《用户注册及隐私协议》</text>
		</view>
		<view class="loginBtm">
			<view @click="loginEvent">已有帐号，<span>去登陆</span></view>
		</view>
	</view>
</template>
<script>
	import { checkEmail, checkPhone, checkPwd } from '../../utils/common.js'

	import axios from '../../js_sdk/gangdiedao-uni-axios/index.js'
	
	import { unimixin } from '../../utils/unimixin.js'

	export default {
		mixins: [ unimixin ],
		data(){
			return{
				isEmail: false,
				isPhone: true,
				isEmailActive: false,
				isPoneActive: true,
				isAreaList: false,
				areaName: '中国',
				areaList: [],
				phoneUser: '',
				emailUser: '',
				confirmPwd: '',
				phonePwd: '',
				msgCode: '',
				verCode: '',
				invateCode: '',
				
				verImage: '',
				
				phUser: '',
				phPwd: '',
				conPwd: '',
				msgPhCode: '',
				invatePhCode: '',
				
				isPassword: true,
				isPhPassword: true,
				isConfirmPassword: true,
				isConfirmPhPassword: true,
				isCheck: false,
				prePhoneNum: '86',
				countryId: '37',
				isValidator: false,
				isClick: true,
				verTxt: '获取验证码',
				flag: true,
				isSendSuccess: false
			}
		},
		onLoad() {

		},
		methods: {
			emailEvent(){
				this.verCode = ''
				this.isPhone = false;
				this.isEmail = true
				this.isEmailActive = true
				this.isPoneActive = false
				this.isCheck = false
				
				this.phUser = ''
				this.phPwd = ''
				this.conPwd = ''
				this.msgPhCode = ''
				this.invatePhCode = ''
				
			},
			phoneEvent(){
				this.verCode = ''
				this.isPhone = true;
				this.isEmail = false
				this.isEmailActive = false
				this.isPoneActive = true
				this.isCheck = false
				
				this.phoneUser = ''
				this.emailUser = ''
				this.confirmPwd = ''
				this.phonePwd = ''
				this.msgCode = ''
				this.invateCode = ''
			},
			switchAreaEvent(){
				this.isAreaList = !this.isAreaList
			},
			choiceArea(item){
				this.areaName = item.name_cn
				this.prePhoneNum = item.area_code
				this.countryId = item.country_id
				this.isAreaList = false
			},
			pwdEvent(){
				if(this.phonePwd){
					this.isPassword = !this.isPassword
				}
			},
			confirmPwdEvent(){
				if(this.confirmPwd){
					this.isConfirmPassword = !this.isConfirmPassword
				}
			},
			confirmPhPwdEvent(){
				if(this.conPwd){
					this.isConfirmPhPassword = !this.isConfirmPhPassword
				}
			},
			pwdPhEvent(){
				if(this.phPwd){
					this.isPhPassword = !this.isPhPassword
				}
			},
			loginEvent(){
				uni.navigateTo({
					url: '../loginIn/loginIn',
					success: () => {}
				})
			},
			
			getSecVerCode(){
				if(this.verTxt == '获取验证码'){
					this.getSendVerCode()
				}
			},
			/* 获取验证码 */
			getSendVerCode(){
				let params = {
					// code: this.verCode,
					name:  this.emailUser || this.phUser,
					areaCode: this.prePhoneNum
				}
				
				if(this.emailUser || this.phUser){
					this.getMsg()
					this.ajaxJson({
						url: '/api/v1/sendRegCode',
						method: 'POST',
						data: params,
						call: (data)=>{
							if(data.code == 200){
								this.isSendSuccess = true
								uni.showToast({
									title: data.msg,
								})
							}else{
								uni.showToast({
									image: '../../static/images/wrong.png',
									title: data.msg
								})
							}
						}
					})
				}else{
					uni.showToast({
						image: '/static/images/wrong.png',
						title: '请输入用户名'
					})
				}
			},
			getMsg(){
				let count = 60
				let timer
				clearInterval(timer)
				if(this.flag || this.isSendSuccess){
					timer = setInterval(()=>{
						count--;
						this.flag = false
						if(count < 10){
							count = '0' + count
						}
						this.verTxt = count + 's后重新获取'
						if(count == 0){
							clearInterval(timer)
							this.verTxt = '获取验证码'
							this.flag = true
						}
					}, 1000)
				}
			},
			/* 短信验证码粘贴 */
			pasteEvent(){
				uni.getClipboardData({
					success: (res) => {
						this.msgCode = res.data
					}
				});
			},
			/* 邀请码明文显示 */
			invateCodeEvent(){
				
			},
			checkTipEvent(){
				this.isCheck = !this.isCheck
			},
			/* 跳转登录 */
			loginBtn(){
				uni.navigateTo({
					url: '../loginIn/loginIn',
					success: () => {}
				})
			},
			/* 注册提交按钮 */
			registerBtn(){
				this.isClick = false
				this.validator()
				if(this.isValidator){
					let params = {
						name: this.emailUser || this.phUser,
						pwd: this.phonePwd || this.phPwd,
						code: this.msgCode || this.msgPhCode,
						countryId: this.countryId,
						areaCode: this.prePhoneNum,
						inviteCode: this.invateCode || this.invatePhCode
					}
					this.ajaxJson({
						url: '/api/v1/register',
						data: params,
						method: 'POST',
						call: (data)=>{
							this.isClick = true
							if(data.code == 200){
								uni.showToast({
									title: '注册成功',
									success: () => {
										setTimeout(()=>{
											uni.navigateTo({
												url: '/pages/loginIn/loginIn',
												success: () => {}
											})
										},1000)
									},
								})
							}else{
								uni.showToast({
									image: '/static/images/wrong.png',
									title: '注册失败'
								})
							}
						}
					})
				}
			},
			blurEvent(){
				this.validator()
			},
			
			/* 获取国家id和国家区号  */
			getCountry(){
				this.ajaxJson({
					url: '/api/v1/config/countryCode',
					call: (res)=>{
						this.areaList = res.data.oftenUseList
					}
				})
			},
				
			/* 获取图形验证码 */
			getVerCode(){
				this.verCode = ''
				axios.get('/api/v1/servlet/ImageCode',{
					responseType: "arraybuffer",
				})
				.then((response)=>{
					// #ifdef H5
						let codeImg = btoa(
								new Uint8Array(response.data).reduce(
									(data, byte) => data + String.fromCharCode(byte),
									""
								)
							);
						// #endif
						let uint = new Uint8Array(response.data)
						let base =  uni.arrayBufferToBase64(uint)
						let unit8Array = base || codeImg
				    this.verImage = "data:image/png;base64," + unit8Array
				  })
			},
			
			
			validator(){
				if(this.isEmail){
					if(!checkEmail(this.emailUser) || !this.emailUser){
						uni.showToast({
							icon: 'none',
							title: '邮箱地址为空或错误，请重新输入'
						})
						this.isValidator = false
						this.isClick = true
					}else if(!checkPwd(this.phonePwd) || !this.phonePwd){
						uni.showToast({
							icon: 'none',
							title: '请设置登录密码或格式不正确'
						})
						this.isValidator = false
						this.isClick = true
					}else if(!checkPwd(this.confirmPwd) || this.phonePwd !== this.confirmPwd){
						uni.showToast({
							icon: 'none',
							title: '请输入确认密码或两次密码输入不一致'
						})
						this.isValidator = false
						this.isClick = true
					}else if(!this.msgCode){
						uni.showToast({
							icon: 'none',
							title: '请输入短信验证码'
						})
						this.isValidator = false
						this.isClick = true
					}else if(!this.invateCode){
						uni.showToast({
							icon: 'none',
							title: '请输入邀请码'
						})
					}else if(!this.isCheck){
						uni.showToast({
							icon: 'none',
							title: '请勾选我已阅读并同意《用户注册及隐私协议》'
						})
						this.isValidator = false
						this.isClick = true
					}else{
						this.isValidator = true
					}
				}else{
					if(!checkPhone(this.phUser) || !this.phUser){
						uni.showToast({
							icon: 'none',
							title: '手机号码为空或错误，请重新输入'
						})
						this.isValidator = false
						this.isClick = true
					}else if(!checkPwd(this.phPwd) || !this.phPwd){
						uni.showToast({
							icon: 'none',
							title: '请设置登录密码或密码格式不正确'
						})
						this.isValidator = false
						this.isClick = true
					}
					else if(!checkPwd(this.conPwd) || this.phPwd !== this.conPwd){
						uni.showToast({
							icon: 'none',
							title: '请输入确认密码或两次密码输入不一致'
						})
						this.isValidator = false
						this.isClick = true
					}else if(!this.msgPhCode){
						uni.showToast({
							icon: 'none',
							title: '请输入短信验证码'
						})
						this.isValidator = false
						this.isClick = true
					}else if(!this.invatePhCode){
						uni.showToast({
							icon: 'none',
							title: '请输入邀请码'
						})
						this.isValidator = false
						this.isClick = true
					}else if(!this.isCheck){
						uni.showToast({
							icon: 'none',
							title: '请勾选我已阅读并同意《用户注册及隐私协议》'
						})
						this.isValidator = false
						this.isClick = true
					}else{
						this.isValidator = true
					}
				}
			},
			serviceAgreementEvent(){
				uni.navigateTo({
					url: '../sundry/serviceAgreement'
				})
			}
		},
		created() {
			this.getVerCode()
			this.getCountry()
		}
	}
</script>
<style scoped lang="scss">
	.pwdTip{
		color: #B8393C;
		font-size: 22rpx;
		margin: 0 80rpx;
	}
	.register{
		padding-bottom: 45rpx;
		.loginSwitch{
			margin: 0 78rpx;
			display: flex;
			text{
				color: $c3;
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
		 .regBox{
			.loginIpt{
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
					input:last-child{
						margin-top: 42rpx;
					}
					.phoneBox{
						display: flex;
						align-items: center;
						.preIptConID{
							width: 120rpx;
							height: 80rpx;
							margin: 34rpx 25rpx 20rpx 80rpx;
							border: 1px solid #F2F2F2;
							border-radius: 6px;
							display: flex;
							align-items: center;
							justify-content: center;
							color: #999;
						}
						.preIpt{
							width: 110rpx;
							margin: 34rpx 20rpx 20rpx 68rpx;
						}
						.phoneIpt{
							width: 434rpx;
							margin: 34rpx 68rpx 20rpx 0;
						}
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
						z-index: 9;
					}
					.i-downArrow::before,.i-eye::before{
						color: #515151;
						font-size: 42rpx;
					}
				}
			}
		}
		.registerTop{
			display: flex;
			justify-content: space-between;
		}
		.loginSwitch{
			padding-top: 70rpx;
			
		}
		.loginArea{
			float: right;
			margin-top: 60rpx;
			margin-right: 40rpx;
			color: #fff;
			position: relative;
			.areaIcon{
				margin-left: 5rpx;
			}
			.areaList{
				display: flex;
				flex-direction: column;
				position: absolute;
				background-color: $bg;
				top: 44rpx;
				right: 5rpx;
				white-space: nowrap;
				border: 1px solid #676869;
				border-radius: 6rpx;
				padding: 5rpx;
				line-height: 48rpx;
				z-index: 9;
				padding: 5rpx;
			}
		}
		.regBox{
			.regEmail, .regPhone{
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
			}
		}
		.btnBox{
			margin: 30rpx auto 0;
			width: 594rpx;
			.regBox{
				button{
					background-color: #BD3A3B;
					color: #fff;
					font-size: 28rpx;
				}
			}
			
		}
		.regTip{
			margin: 50rpx auto 0;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
			.checkIcon{
				color: #888;
			}
			text{
				font-size: 22rpx;
				line-height: 22rpx;
				color: #999999;
				margin-left: 10rpx;
			}
			text.agreement{
				color: #BD3A3B;
			}
		}
		.regWarn{
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			margin-left: 72rpx;
			text{
				margin-left: 10rpx;
				color: #5B5C5B;
				font-size: 24rpx;
			}
			.i-excla:before{
				color: #99403d;
			}
		}
		.loginBtm{
			display: flex;
			flex-direction: column;
			justify-content: center;
			width: 100%;
			text-align: center;
			margin: 40rpx auto 0;
			color: #999999;
			view:nth-child(1){
				span{
					color: #BD3A3B;
				}
			}
		}
	}
</style>
