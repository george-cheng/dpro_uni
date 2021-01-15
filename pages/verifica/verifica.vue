<template>
	<view class="verifica mainBox">
		<view class="verIpt">
			<view>
				<input type="text" v-model="code" placeholder="请输入验证码">
				<span @click="pasteEvent">粘贴</span>
			</view>
			<text @click="getSecAgain">{{verTxt}}</text>
		</view>
		<button type="default" @click="loginBtn">提交</button>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				verTxt: '点击获取验证码',
				category: '',
				code: '',
				params: {}
			}
		},
		onLoad(options) {
			this.category = options.category
			this.params = JSON.parse(decodeURIComponent(options.params))
			if(this.category == '0'){
				uni.setNavigationBarTitle({
						title: '邮箱验证'
				});
			}else{
				uni.setNavigationBarTitle({
						title: '手机验证'
				});
			}
			this.getMsg()
		},
		methods: {
			/* 重新获取验证码 */
			getSecAgain(){
				if(this.verTxt == '重新获取验证码'){
					this.getSendLoginCode()
				}
			},
			getSendLoginCode(){
				this.ajaxJson({
					url: '/api/v1/sendLoginCode',
					data: this.params,
					method: 'POST',
					call: (data)=>{
						if(data.code == 200){
							uni.showToast({
								title: data.msg
							})
						}else{
							uni.showToast({
								image: '../../static/images/wrong.png',
								title: data.msg
							})
						}
					},
				})
			},
			/* 验证码提交 */
			loginBtn(){
				
				let secCodeParams = {
					name: this.params.emailUser || this.params.phoneUser,
					code: this.code
				}
				this.ajaxJson({
					url: '/api/v1/secLogin',
					data: secCodeParams,
					method: 'POST',
					call: (data)=>{
						if(data.code == 200){
							uni.showToast({
								title: '登录成功',
								success: () => {
									uni.reLaunch({
										url: '../index/index'
									})
								}
							})
						}else{
							uni.showToast({
								image: '../../static/images/wrong.png',
								title: data.msg
							})
						}
					}
				})
			},
		/* 短信验证码粘贴 */
			pasteEvent(){
				uni.getClipboardData({
					success: (res) => {
						this.code = res.data
					}
				});
			},
			getMsg(){
				var count = 60
				clearInterval(timer)
				let timer = setInterval(()=>{
					count--;
					if(count < 10){
						count =  '0' + count
					}
					this.verTxt = count + 's后重新发送'
					if(count == 0){
						clearInterval(timer)
						this.verTxt = '重新获取验证码'
					}
				}, 1000)
				
			}
		},
		created() {
			this.getSendLoginCode()
		}
	}
</script>

<style lang="scss">
	.verifica{
		.verIpt{
			margin: 0 84rpx;
			display: flex;
			justify-content: space-between;
			view{
				position: relative;
				input{
					margin: 20rpx auto 0;
					width: 400rpx;
					height: 80rpx;
					border: 1px solid #f2f2f2;
					border-radius: 6px;
					color: #999;
				}
				span{
					position: absolute;
					top: 54rpx;
					right: 50rpx;
					color: #BD3A3B;
					font-size: 24rpx;
					z-index: 9;
					line-height: 24rpx;
				}
			}
			text{
				margin-top: 25rpx;
				display: flex;
				align-items: center;
				color: #999;
				font-size: 22rpx;
				line-height: 22rpx;
			}
		}
		button{
			margin: 58rpx 78rpx 0;
			background-color: #BD3A3B;
			color: #fff;
			font-size: 28rpx;
			line-height: 80rpx;
		}
	}
</style>
