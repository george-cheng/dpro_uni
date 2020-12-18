<template>
	<view class="tranPwd mainBox">
		<view>
			<input v-model="pwd" :password="isPwd" placeholder="请输入交易密码密码">
			<span @click="pwdEvent(0)" class="iconLogin i-eye"></span>
		</view>
		<view>
			<input v-model="conPwd" :password="isConPwd" placeholder="请确认交易密码">
			<span @click="pwdEvent(1)" class="iconLogin i-eye"></span>
		</view>
		<view class="regMsg">
			<view class="megBox">
				<input type="text" v-model="code" placeholder="请输入验证码">
				<span @click="pasteEvent">粘贴</span>
			</view>
			<view class="msgBtn">
				<button @click="getVerMsg">{{verTxt}}</button>
			</view>
		</view>
		<button class="btn" type="default" @click="confirmEvent">确认</button>
	</view>
</template>

<script>
	import { checkPwd } from '../../../utils/common.js'
	export default {
		data(){
			return{
				pwd: '',
				conPwd: '',
				code: '',
				verTxt: '',
				name: '',
				isPwd: true,
				isConPwd: true,
				verTxt: '点击获取验证码',
			}
		},
		onLoad() {

		},
		methods: {
			pwdEvent(index){
				if(index == 0){
					this.isPwd = !this.isPwd
				}else{
					this.isConPwd = !this.isConPwd
				}
			},
			confirmEvent(){
				if(!checkPwd(this.pwd) || this.pwd !== this.conPwd){
					uni.showToast({
						icon: 'none',
						title: '请输入确认密码或两次密码输入不一致'
					})
				}else if( !this.code){
					uni.showToast({
						icon: 'none',
						title: '验证码不能为空'
					})
				}else{
					let params = {
						code: this.code,
						pwd: this.pwd
					}
					this.ajaxJson({
						url: '/api/v1/account/modSafeWord',
						method: 'POST',
						data: params,
						call: (data)=>{
							if(data.code == 200){
								uni.showToast({
									title: data.msg,
									success: () => {
										
									}
								})
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
			pasteEvent(){
				uni.getClipboardData({
					success: (res) => {
						this.code = res.data
					}
				});
			},
			getCount(){
				var count = 60
				clearInterval(this.timer)
				this.timer = setInterval(()=>{
					count--;
					if(count < 10){
						count =  '0' + count
					}
					this.verTxt = count + 's后重新发送'
					if(count == 0){
						clearInterval(this.timer)
						this.verTxt = '重新获取验证码'
					}
				}, 1000)
			},
			getVerMsg(){
				if(this.verTxt == '点击获取验证码' || this.verTxt === '重新获取验证码'){
					this.getMsg()
				}
			},
			getMsg(){
				if(this.pwd && this.conPwd){
					this.getCount()
					this.ajaxJson({
						url: '/api/v1/sendFindCode',
						method: 'POST',
						data: {name: this.name},
						call: (data)=>{
							if(data.code == 200){
								uni.showToast({
									title: '发送成功',
								})
							}else{
								uni.showToast({
									image: '../../../static/images/wrong.png',
									title: data.msg
								})
							}
						}
					})
				}else{
					uni.showToast({
						image: '../../../static/images/wrong.png',
						title: '请先输入密码和确认密码'
					})
				}
			},
			getSession(){
				uni.getStorage({
					key: 'userSession',
					success: (data) => {
						this.name = data.data.loginName
					}
				})
			}
		},
		created() {
			this.getSession()
		}
	}
</script>

<style scoped lang="scss">
	.tranPwd{
		view{
			position: relative;
			input{
				margin: 68rpx auto 0;
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
					margin: 68rpx 30rpx 0 78rpx;
					width: 390rpx;
					text-align: left;
					position: relative;
				}
				span{
					position: absolute;
					top: 102rpx;
					right: 50rpx;
					color: #BD3A3B;
					font-size: 24rpx;
					z-index: 9;
					line-height: 24rpx;
				}
			}
			.msgBtn{
				width: 165rpx;
				margin-top: 68rpx;
				button{
					font-size: 24rpx;
					height: 80rpx;
					display: flex;
					align-items: center;
					white-space: nowrap;
					justify-content: center;
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
	.btn{
		margin: 100rpx 80rpx;
		background-color: #FC6154;
		font-size: 30rpx;
		color: #fff;
	}
</style>
