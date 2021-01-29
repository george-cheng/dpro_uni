<template>
	<view class="tranLegOrderToPay">
		<view class="toPayTit" v-if="isTime">
			<view class="toPayClock" >
				<view class="clock">
					<image src="/static/images/clock.png" mode=""></image>
					<text v-if="isClockTime">{{clockTime}}</text>
					<text v-if="isProceCount">{{proceCount}}</text>
				</view>
				<text class="clockTip" v-if="isClockTime">请在30分钟内向商家付款，否则订单将会自动取消</text>
				<text class="clockTip" v-if="isProceCount">商家将会在48小时钟内进行处理，请耐心等待</text>
			</view>
		</view>
		
		
		<view class="orderDetail">
			<view class="detailTit">订单明细</view>
			<view class="orderNum">
				<view>订单号：{{fotcOrder.order_id}}</view>
			</view>
			<view class="orderDetailInfo">
				<view><text> ¥ {{fotcOrder.price}} </text><text> 单价 </text></view>
				<view><text>{{fotcOrder.amount}}</text><text>数量</text></view>
				<view><text> ¥ {{fotcOrder.total}} </text><text>总额</text></view>
			</view>
			<view class="orderDetailBtm">
				<view class="orderDetailState" v-if="isConOrder">待支付</view>
				<view class="orderDetailState" v-if="isConPay">待确认</view>
				<view class="orderDetailState" v-if="isCollect">已付款</view>
				<view class="orderDetailState" v-if="isOrderCancel">已撤销</view>
				<view class="orderDetailMoney">
					<text> ¥ {{fotcOrder.total}}</text>
					<view class="copy" @click="copyEvent(fotcOrder.total)">复制</view>
				</view>
			</view>
		</view>
		
		<view class="bussinessDetail"  v-if="isBussDetail">
			<view class="bussTit">商家信息</view>
			<view class="bussDetailInfo">
				<view class="payMethod">
					
					<view class="wxMethodPay" v-if="isWxShow">
						<view class="MethodPayTit" @click="wxMethodEvent">
							<view class="payLft">
								<view class="payIcon i-wx"></view>
								<text>微信支付</text>
							</view>
							<view class="payArrow" :class="isWxCheck ? 'i-dwArrow' : 'i-rgtArrow'"></view>
						</view>
						<view class="wxMethodPayInfo" v-if="isWxMethod">
							<view class="qrCodeImg" @longtap="saveQrcodeEvent(urlImg + fbuinessAccount.fwxpayReCode)">
								<view class="codeImg"><image :src="urlImg + fbuinessAccount.fwxpayReCode" mode="aspectFit"></image></view>
								<view class="downQrcodeImg">长按保存收款二维码</view>
							</view>
							<view class="payName">
								<view class="nameLft">姓名：</view>
								<view class="infoRgt"><text>{{fbuinessAccount.fuName}}</text><view class="copy" @click="copyEvent(fbuinessAccount.fuName)">复制</view></view>
							</view>
							<view class="payAcc">
								<view class="nameLft">账号：</view>
								<view class="infoRgt"><text>{{fbuinessAccount.fweChat}}</text><view class="copy" @click="copyEvent(fbuinessAccount.fweChat)">复制</view></view>
							</view>
							<view class="payAcc">
								<view class="nameLft">备注：</view>
								<view class="infoRgt"><text>{{fbuinessAccount.fwxpayRemarks}}</text></view>
							</view>
						</view>
					</view>
					
					<view class="zfbMethodPay" v-if="isZfbShow">
						<view class="MethodPayTit" @click="zfbMethodEvent">
							<view class="payLft"><view class="payIcon i-zfb"></view><text>支付宝支付</text></view>
							<view class="payArrow" :class="isZfbCheck ? 'i-dwArrow' : 'i-rgtArrow'"></view>
						</view>
						<view class="zfbMethodPayInfo" v-if="isZfbMethod">
							<view class="qrCodeImg" @longtap="saveQrcodeEvent(urlImg + fbuinessAccount.falipayReCode)">
								<view class="codeImg"><image :src="urlImg + fbuinessAccount.falipayReCode" mode="aspectFit"></image></view>
								<view class="downQrcodeImg">长按保存收款二维码</view>
							</view>
							<view class="payName">
								<view class="nameLft">姓名：</view>
								<view class="infoRgt"><text>{{fbuinessAccount.fuName}}</text><view class="copy" @click="copyEvent(fbuinessAccount.fuName)">复制</view></view>
							</view>
							<view class="payAcc">
								<view class="nameLft">账号：</view>
								<view class="infoRgt"><text>{{fbuinessAccount.falipay}}</text><view class="copy" @click="copyEvent(fbuinessAccount.falipay)">复制</view></view>
							</view>
							<view class="payName">
								<view class="nameLft">备注：</view>
								<view class="infoRgt"><text>{{fbuinessAccount.falipayRemarks}}</text><view></view></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="confirmPay" @click="isClick && confirmPayEvent(confirmTxt)" v-if="isConfirmBtn">
			<button type="default">{{confirmTxt}} </button>
		</view>
		
	</view>
</template>

<script>
	import { unimixin } from '../../../../utils/unimixin.js'
	export default {
		mixins: [ unimixin ],
		data(){
			return{
				isClockTime: true,
				isProceCount: false,
				
				isConOrder: false,
				isConPay: false,
				isCollect: false,
				isOrderCancel: false,
				
				isZfbCheck: false,
				isZfbMethod: false,
				isWxCheck: false,
				isWxMethod: false,
				isWxShow: false,
				isZfbShow: false,
				
				clockTime: '',
				
				orderId: '',
				fbuinessAccount: '',
				fotcOrder: '',
				
				isConfirmBtn: false,
				isTime: true,
				isBussDetail: true,
				
				
				confirmTxt: '确认付款',
				
				urlImg: 'https://dpro-main.oss-cn-hongkong.aliyuncs.com/',
			}
		},
		onLoad(options) {
			this.orderId = options.orderId
		},
		onNavigationBarButtonTap(e){
			if(e.float == 'left'){
				uni.reLaunch({
					url: '/pages/my/bussManager/legalBussManager/legalBussManagerOrder',
					success: () => {}
				})
			}
		},
		methods: {
			confirmPayEvent(confirmTxt){
				this.isClick = false
				if(confirmTxt === '确认付款'){
					this.ajaxJson({
						url: '/api/v1/otcOrder/buinessEnterPay',
						method: 'POST',
						data: {order_id: this.orderId},
						call: (data)=>{
							this.isClick = true
							if(data.code == 200){
								uni.showToast({
									title: data.msg
								})
								setTimeout(()=>{
									uni.reLaunch({
										url: '/pages/my/bussManager/bussManager',
										success: () => {}
									})
								}, 1000)
							}else{
								uni.showToast({
									image: '/static/images/wrong.png',
									title: data.msg
								})
							}
						}
					})
				}else if(confirmTxt === '确认放币'){
					this.ajaxJson({
						url: '/api/v1/otcOrder/buinessEnterColl',
						method: 'POST',
						data: {order_id: this.orderId},
						call: (data)=>{
							this.isClick = true
							if(data.code == 200){
								uni.showToast({
									title: data.msg
								})
								setTimeout(()=>{
									uni.reLaunch({
										url: '/pages/my/bussManager/bussManager',
										success: () => {}
									})
								}, 1000)
							}else{
								uni.showToast({
									image: '/static/images/wrong.png',
									title: data.msg
								})
							}
						}
					})
				}
			},
			/* 微信 */
			wxMethodEvent(){
				this.isWxMethod = !this.isWxMethod
				this.isWxCheck = !this.isWxCheck
				this.isZfbMethod = false
				this.isZfbCheck = false
			},
			/* 支付宝 */
			zfbMethodEvent(){
				this.isZfbMethod = !this.isZfbMethod
				this.isZfbCheck = !this.isZfbCheck
				this.isWxMethod = false
				this.isWxCheck = false
			},
			/* 复制 */
			copyEvent(data){
				uni.setClipboardData({
					data: data.toString()
				})
			},
			/* 请求订单数据 */
			getBussManagerOrdeToPayInfo(){
				this.ajaxJson({
					url: '/api/v1/otcOrder/buinessFindByOrderId',
					data: {order_id: this.orderId},
					call: (data)=>{
						if(data.code == 200){
							this.fotcOrder = data.data.fotcOrder
							if(data.data.fbuinessAccount){
								this.fbuinessAccount = data.data.fbuinessAccount
							}
							this.countTime()
							if(this.fbuinessAccount.falipay == null){
								this.isZfbShow = false
							}else{
								this.isZfbShow = true
							}
							if(this.fbuinessAccount.fweChat == null){
								this.isWxShow = false
							}else{
								this.isWxShow = true
							}
							
							if(this.fotcOrder.order_status == '1'){
								// 确认付款按钮
								this.isConfirmBtn = true
							}
							
							if(this.fotcOrder.order_status == '2' && this.fotcOrder.order_type == '2'){
								// 确认付款按钮
								this.isConfirmBtn = false
								this.isBussDetail = true
								this.isTime = false
								uni.setNavigationBarTitle({
									title: '等待用户收款',
									success: () => {}
								});
							}
							
							
							if(this.fotcOrder.order_status == '2' && this.fotcOrder.order_type == '1'){
								this.isConfirmBtn = true
								this.confirmTxt = '确认放币'
							}
							
							if(this.fotcOrder.order_status == '3'){
								// 确认付款按钮
								this.isConfirmBtn = false
								this.isTime = false
								this.isBussDetail = false
								uni.setNavigationBarTitle({
									title: '订单已完成',
									success: () => {}
								});
							}
							
							if(this.fotcOrder.order_status == 4){
								this.isTime = false
								this.isBussDetail = false
							}
							
							if( this.fotcOrder.order_status == 2 && this.fotcOrder.order_type == 2){
								const webView = this.$scope.$getAppWebview()
								webView.setTitleNViewButtonStyle(0, {
									text: ' ',    
								});
							}
						}
					}
				})
			},
			
			/* 确认付款倒计时 */
			countTime(){
				this.timer = setInterval(()=>{
					let newDataTime = this.fotcOrder.place_time.replace(/-/g, '/')
					let newTime = new Date(newDataTime).getTime() + 30*60*1000
					let nowTime = new Date().getTime()
					let countTime =  newTime - nowTime
					let min = parseInt(countTime / 1000 / 60 % 60 )
					let sec = parseInt(countTime / 1000 %  60 )
					this.clockTime = min.toString().padStart(2 ,0) + ':' + sec.toString().padStart(2 ,0)
					if(countTime <= 1000){
						clearInterval(this.timer)
						this.isBussDetail = false
						uni.setNavigationBarTitle({
							title: '订单已撤销',
							success: () => {
								let webView = this.$mp.page.$getAppWebview();
								webView.setTitleNViewButtonStyle(0, {
									text: ' ',    
								});	
							}
						});
					}
				}, 1000)
			}
		},
		created() {
			this.getBussManagerOrdeToPayInfo()
		}
	}
</script>

<style scoped lang="scss">
	.tranLegOrderToPay{
		.toPayTit{
			.toPayClock{
				margin-top: 85rpx;
				display: flex;
				justify-content: center;
				flex-direction: column;
				.clock{
					display: flex;
					justify-content: center;
					align-items: center;
					text{
						font-size: 48rpx;
						color: #999;
					}
					image{
						margin-right: 10rpx;
						width: 40rpx;
						height: 40rpx;
					}
				}
			}
			.clockTip{
				font-size: 24rpx;
				color: #999;
				margin: 40rpx auto 0;
			}
		}
		.orderDetail{
			margin-top: 50rpx;
			background-color: #fff;
			.detailTit{
				padding: 40rpx 30rpx 0 30rpx;
				font-size: 28rpx;
				color: #999;
			}
			.orderNum{
				margin-top: 25rpx;
				padding: 0 30rpx 0;
				color: #676869;
				font-size: 26rpx;
				display: flex;
				justify-content: space-between;
			}
		}
		.orderDetailInfo{
			display: flex;
			justify-content: space-between;
			margin-top: 60rpx;
			background-color: #f2f2f2;
			padding: 10rpx 30rpx 10rpx 30rpx;
			view{
				display: flex;
				flex-direction: column;
				text:nth-of-type(1){
					color: $c3;
					font-size: 28rpx;
				}
				text:nth-of-type(2){
					margin-top: 20rpx;
					color: #676869;
					font-size: 22rpx;
				}
			}
		}
		.orderDetailBtm{
			margin-top: 80rpx;
			padding: 0 30rpx 0;
			display: flex;
			justify-content: space-between;
			.orderDetailState{
				color: #999;
				font-size: 28rpx;
			}
			.orderDetailMoney{
				display: flex;
				flex-direction: row;
				align-items: center;
				padding-bottom: 20rpx;
				text{
					color: #BD3A3B;
					font-size: 28rpx;
				}
			}
		}
		.bussinessDetail{
			margin-top: 15rpx;
			background-color: #fff;
			padding: 0 30rpx;
			.bussTit{
				font-size: 28rpx;
				color: #999;
				padding-top: 45rpx;
			}
			.bussDetailInfo{
				margin-top: 30rpx;
				.payMethod{
					.wxMethodPay, .zfbMethodPay{
						.MethodPayTit{
							display: flex;
							justify-content: space-between;
							align-items: center;
							margin-top: 10rpx;
							.payLft{
								display: flex;
								align-items: center;
								.payIcon{
									color: #999;
									font-size: 40rpx;
									margin-right: 10rpx;
								}
								text{
									color: #999;
									font-size: 28rpx;
								}
							}
							.payArrow::before{
								color: #999;
							}
						}
						.wxMethodPayInfo, .zfbMethodPayInfo{
							padding: 30rpx 0;
							.qrCodeImg{
								margin: 0 auto;
								.codeImg{
									width: 280rpx;
									height: 280rpx;
									margin: 0 auto;
									image{
										width: 100%;
										height: 100%;
									}
								}
								.downQrcodeImg{
									color: #999;
									margin-top: 10rpx;
									text-align: center;
								}
							}
							.payName, .payAcc{
								display: flex;
								justify-content: space-between;
								margin-top: 20rpx;
								.nameLft{
									color: #999;
								}
								.infoRgt{
									color: #999;
									display: flex;
									flex-direction: row;
								}
							}
						}
					}
				}
			}
		}
	}
	.copy{
		font-size: 22rpx;
		color: #B8393C;
		border: 2rpx solid #666;
		border-radius: 30rpx;
		padding: 3rpx 15rpx;
		margin-left: 20rpx;
	}
	.confirmPay{
		color: #fff;
		margin: 120rpx 30rpx 0;
		border-radius: 4rpx;
		button{
			background: linear-gradient(#EA506E, #EE7154);
			color: #fff;
		}
	}
	
</style>
