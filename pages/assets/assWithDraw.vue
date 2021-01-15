<template>
	<view class="widthDraw mainBox">
		<view class="drawInfo">
			<view class="drawImg">
				<image :src="url + this.imgUrl" mode=""></image>
			</view>
			<view class="drawName">
				<view class="">{{feeName}}</view>
			</view>
			<view class="line"></view>
			<view class="infoMoney">
				<view class="infoLft">
					<text class="infoTxt">可用</text>
					<text class="infoVal">{{total}}</text>
				</view>
				<view class="infoRgt">
					<text class="infoTxt">冻结</text>
					<text class="infoVal">{{frozen}}</text>
				</view>
			</view>
		</view>
		<view class="drawIpt">
			<view class="amountIpt">
				<input type="text" v-model="amount" @input="amountNum" placeholder="请输入提现数量">
				<view class="iptRgt">
					<text>{{iptTxt}}</text>
					<text @click="withDrawAll">全部</text>
				</view>
			</view>
			<view class="amountTip">
				<text>实际到账: {{actuTotal}}</text>
				<text>手续费: 固定 {{feeAmount}} + {{accMul(feeRatio, 100)}} %</text>
			</view>
			<view v-if="addresses.length != 0">
				<input type="text" v-model="flag" placeholder="已设置的提币地址">
				<span @click="flagEvent" class="iconLogin i-dwArrow"></span>
				<view class="flagList" v-if="isAddresses">
					<text @click="addressesEvent(item)" v-for="(item, index) in addresses" :key="item.id">{{item.flag}} -- {{item.address}}</text>
				</view>
			</view>
			<view class="amountIpt">
				<input type="text" v-model="address" placeholder="输入或粘贴地址">
				<view class="iptRgt">
					<text @click="pasteEvent(0)">粘贴</text>
				</view>
			</view>
			<view class="iptTip">请输入或粘贴ERC20地址</view>
			<view>
				<input  v-model="safeWord" placeholder="输入交易密码" :password="isSafeWord">
				<span @click="pwdEvent" class="iconLogin i-eye"></span>
			</view>
			<view class="regMsg">
				<view class="megBox">
					<input type="text" v-model="code" placeholder="输入验证码">
					<span @click="pasteEvent(1)">粘贴</span>
				</view>
				<view class="msgBtn">
					<button @click="getVerMsg">{{verTxt}}</button>
				</view>
			</view>
			<view>
				<input type="text" v-if="isGoogleCode" v-model="googleCode" placeholder="输入谷歌验证码">
			</view>
			<view>
				<input type="text" v-model="remark" placeholder="提现说明">
			</view>
		</view>
		<view class="addTip">
			<view> · 为保障您的资金安全，当前账户安全策略变更、密码修改，我们 会对提币人工审核，请耐心等待工作人员联系。请务必确认电脑以及浏览器安全，防止信息被篡改或泄露。</view>
		</view>
		<view class="widthDrawBtn" @click="withDrawEvent">
			<button type="default">确认</button>
		</view>
	</view>
</template>

<script>
	import { accAdd, accMul } from '../../utils/common.js'
	export default {
		data() {
			return {
				assetsId: '',
				feeName: '',
				imgUrl: '',
				total: '',
				frozen: '',
				amount: '',
				actuTotal: '0',
				googleCode: '',
				iptTxt: '',
				safeWord: '',
				address: '',
				code: '',
				max: '',
				min: '',
				flag: '',
				feeRatio: '',
				remark: '',
				feeAmount: '',
				addressName: '',
				timer: '',
				isSafeWord: true,
				userSession: [],
				addresses: [],
				isGoogleCode: false,
				isAddresses: false,
				isValidator: false,
				isAmount: false,
				verTxt: '点击获取验证码',
				url: 'https://dpro-main.oss-cn-hongkong.aliyuncs.com/',
			}
		},
		onLoad(options) {
			this.assetsId = options.id
			this.imgUrl = options.imgUrl
			this.getWithDrawInfo()
		},
		methods: {
			addressesEvent(item){
				this.isAddresses = false
				this.flag = item.flag
				this.address = item.address
			},
			flagEvent(){
				this.isAddresses = !this.isAddresses
			},
			getCount(){
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
			},
			getVerMsg(){
				if(this.verTxt == '点击获取验证码' || this.verTxt === '重新获取验证码'){
					this.getMsg()
				}
			},
			getMsg(){
				if(this.address && this.safeWord){
					this.getCount()
					this.ajaxJson({
						url: '/api/v1/account/sendCode',
						method: 'POST',
						data: {type: '1'},
						call: (data)=>{
							if(data.code == 200){
								uni.showToast({
									title: '发送成功'
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
						image: '../../static/images/wrong.png',
						title: '请先输入提币地址或交易密码'
					})
				}
			},
			
			validator(){
				if(!this.amount){
					uni.showToast({
						image: '../../static/images/wrong.png',
						title: '请输入提现数量'
					})
					this.isValidator = false
				}else if(!this.address){
					uni.showToast({
						image: '../../static/images/wrong.png',
						title: '请输入提现地址'
					})
					this.isValidator = false
				}else if(!this.safeWord){
					uni.showToast({
						image: '../../static/images/wrong.png',
						title: '请输入交易密码'
					})
					this.isValidator = false
				}else if(!this.code){
					uni.showToast({
						image: '../../static/images/wrong.png',
						title: '请输入验证码'
					})
					this.isValidator = false
				}else{
					this.isValidator = true
				}
			},
			withDrawEvent(){
				this.validator()
				if(this.isValidator){
					let params = {
						id: this.assetsId,
						amount: this.amount,
						flag: this.flag,
						address: this.address,
						safeWord: this.safeWord,
						code: this.code,
						googleCode: this.googleCode,
						remark: this.remark,
					}
					this.ajaxJson({
						url: '/api/v1/account/withdrawCoin',
						data: params,
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
						}
					})
				}
			},
			pwdEvent(){
				if(this.safeWord){
					this.isSafeWord = !this.isSafeWord
				}
			},
			pasteEvent(){
				if(index == 0){
					uni.getClipboardData({
						success: (res) => {
							this.address = res.data
						}
					});
				}else{
					uni.getClipboardData({
						success: (res) => {
							this.code = res.data
						}
					});
				}
			},
			amountNum(){
				if(this.max >= parseFloat(this.amount) && parseFloat(this.amount) >= this.min){
					this.isAmount = true
					this.actuTotal = accAdd(accAdd(this.amount, this.accMul(this.feeAmount, -1)), accMul(accMul(this.amount, this.feeRatio), -1))
				}
			},
			withDrawAll(){
				this.amount = this.total
				this.amountNum()
			},
			getWithDrawInfo(){
				let params = {
					id: this.assetsId
				}
				this.ajaxJson({
					url: '/api/v1/account/getParamsByCoin',
					data: params,
					call: (data)=>{
						this.feeName = this.iptTxt = data.data.feeName
						this.total = data.data.total
						this.feeAmount = data.data.feeAmount
						this.frozen = data.data.frozen
						this.feeRatio = data.data.feeRatio
						this.max = data.data.max
						this.min = data.data.min
						this.addresses = data.data.addresses
						uni.setNavigationBarTitle({
							title: this.feeName + '提现',
						});
					}
				})
			},
			getSession(){
				uni.getStorage({
					key: 'userSession',
					success: (res) => {
						this.userSession = res
						this.isGoogleCode = res.googleBind
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
	.widthDraw{
		.drawInfo{
			padding: 34rpx 0;
			margin: 0 auto 0;
			background-color: #fff;
			.drawImg{
				width: 60rpx;
				height: 60rpx;
				margin: 0 auto;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.drawName{
				margin-top: 20rpx;
				text-align: center;
				font-size: 28rpx;
				color: #999;
			}
			.line{
				height: 2rpx;
				background-color: #383838;
				margin: 42rpx 30rpx 0;
			}
			.infoMoney{
				display: flex;
				justify-content: space-between;
				margin-top: 40rpx;
				margin: 40rpx 80rpx 0;
				.infoLft, .infoRgt{
					display: flex;
					flex-direction: column;
					text{
						display: flex;
						justify-content: center;
					}
					.infoTxt{
						font-size: 24rpx;
						color: #676869;
					}
					.infoVal{
						margin-top: 30rpx;
						font-size: 28rpx;
						color: #999;
					}
				}
			}
		}
		.drawIpt{
			.amountTip{
				display: flex;
				justify-content: space-between;
				margin-top: 15rpx;
				text{
					font-size: 24rpx;
					color: #999;
				}
			}
			.amountIpt{
				position: relative;
				view.iptRgt{
					position: absolute;
					top: -15rpx;
					right: 0;
					
					text {
						color: #676869;
						font-size: 24rpx;
					}
					text:nth-of-type(2){
						color: #BD3A3B;
						margin-left: 10rpx;
					}
				}
			}
			.iptTip{
				color: #999;
				font-size: 24rpx;
				margin-top: 10rpx;
			}
			view{
				margin: 35rpx 35rpx 0;
				position: relative;
				.flagList{
					position: absolute;
					top: 60rpx;
					right: -35rpx;
					z-index: 10;
					display: flex;
					flex-direction: column;
					border: 1px solid #676869;
					background-color: #282828;
					text{
						display: flex;
						flex-direction: column;
						font-size: 30rpx;
						line-height: 48rpx;
						padding: 10rpx;
						color: #fff;
					}
				}
				.iconLogin{
					position: absolute;
					right: 30rpx;
					top: 25rpx;
					z-index: 9;
				}
				.i-downArrow::before,.i-eye::before,.i-dwArrow::before{
					color: #515151;
					font-size: 42rpx;
				}
				input{
					height: 80rpx;
					background-color: #fff;
					border: 1px solid #f2f2f2;
					border-radius: 8rpx;
					color: #999;
				}
			}
			.regMsg{
				display: flex;
				.megBox{
					position: relative;
					margin: 0;
					input{
						width: 480rpx;
						text-align: left;
					}
					span{
						position: absolute;
						top: 35rpx;
						right: 30rpx;
						color: #BD3A3B;
						font-size: 24rpx;
						z-index: 9;
						line-height: 24rpx;
					}
				}
				.msgBtn{
					width: 180rpx;
					margin: 0;
					margin-left: 30rpx;
					button{
						font-size: 24rpx;
						height: 80rpx;
						display: flex;
						align-items: center;
						white-space: nowrap;
						background-color: #ED6B58;
						color: #fff;
						justify-content: center;
					}
				}
			}
		}
		.addTip{
			margin: 48rpx 32rpx 0;
			view{
				color: #676869;
				font-size: 24rpx;
				margin-bottom: 30rpx;
			}
		}
		.widthDrawBtn{
			margin: 84rpx 78rpx 0;
			padding-bottom: 40rpx;
			button{
				background-color: #BD3A3B;
				color: #fff;
			}
		}
	}
</style>
