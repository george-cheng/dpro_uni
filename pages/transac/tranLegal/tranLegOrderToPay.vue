<template>
	<view class="tranLegOrderToPay">
		<view class="toPayTit">
			<view class="toPayClock" v-if="isTime">
				<view class="clock">
					<image src="/static/images/clock.png" mode=""></image>
					<text v-if="isConOrder">{{clockTime}}</text>
					<text v-if="isConPay">{{proceCount}}</text>
				</view>
				<text class="clockTip" v-if="isConOrder">请在30分钟内向商家付款，否则订单将会自动取消</text>
				<text class="clockTip" v-if="isConPay">商家将会在48小时钟内进行处理，请耐心等待</text>
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
		
		<view class="bussinessDetail"  v-if="!isOrderCancel && !isCollect">
			<view class="bussTit">商家信息</view>
			<view class="bussDetailInfo">
				<view class="payMethod">
					
					<view class="wxMethodPay">
						<view class="MethodPayTit" @click="wxMethodEvent">
							<view class="payLft">
								<view class="payIcon i-wx"></view>
								<text>微信支付</text>
							</view>
							<view class="payArrow" :class="isWxCheck ? 'i-dwArrow' : 'i-rgtArrow'"></view>
						</view>
						<view class="wxMethodPayInfo" v-if="isWxMethod">
							<view class="qrCodeImg" @longtap="saveQrcodeEvent(url + fbuinessAccount.fwxpayReCode)">
								<view class="codeImg"><image :src="url + fbuinessAccount.fwxpayReCode" mode="aspectFit"></image></view>
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
					
					<view class="zfbMethodPay">
						<view class="MethodPayTit" @click="zfbMethodEvent">
							<view class="payLft"><view class="payIcon i-zfb"></view><text>支付宝支付</text></view>
							<view class="payArrow" :class="isZfbCheck ? 'i-dwArrow' : 'i-rgtArrow'"></view>
						</view>
						<view class="zfbMethodPayInfo" v-if="isZfbMethod">
							<view class="qrCodeImg" @longtap="saveQrcodeEvent(url + fbuinessAccount.falipayReCode)">
								<view class="codeImg"><image :src="url + fbuinessAccount.falipayReCode" mode="aspectFit"></image></view>
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
			<button type="default">  {{confirmTxt}} </button>
		</view>
		 <!-- v-if="isConOrder && isOrderType" -->
	</view>
</template>

<script>
	import { accAdd, getLocalTime } from '../../../utils/common.js'
	import { unimixin } from '../../../utils/unimixin.js'
	export default {
		mixins: [unimixin],
		data(){
			return{
				fbuinessAccount: [],
				fotcOrder: [],
				isWxMethod: false,
				isZfbMethod: false,
				isWxCheck: false,
				isZfbCheck: false,
				placeTime: '',
				clockTime: '',
				proceCount: '',
				isProce: false,
				timer: '',
				orderTime: '',
				orderId: '',
				orderStatus: '',
				flagProce: true,
				flagCount: true,
				orderType: '',
				isOrderType: true,
				isConfirmBtn: false,
				
				isClock: false,
				isConOrder: false,   //确认下单
				isConPay: false,   //确认付款
				isCollect: false,   //确认放币
				isOrderCancel: false,   //取消
				confirmTxt: '确认已付款',
				isTime: true,
				
				urlImg: 'https://dpro-main.oss-cn-hongkong.aliyuncs.com/',
			}
		},
		onLoad(options) {
			if(options.orderId){
				this.orderId = options.orderId
				this.orderStatus = options.orderStatus
				this.getPayInfoEvent()
				if(this.orderStatus == 1){
					this.isConOrder = true
					this.isConfirmBtn = true
					uni.setNavigationBarTitle({
						title: '确认下单',
					})
				}else if(this.orderStatus == 2){
					this.isConPay = true
					uni.setNavigationBarTitle({
						title: '订单处理中...',
					})
				}else if(this.orderStatus == 3){
					this.isCollect = true
					uni.setNavigationBarTitle({
						title: '确认放币',
					})
				}else if(this.orderStatus == 4){
					this.isOrderCancel = true
					uni.setNavigationBarTitle({
						title: '订单已撤销',
					})
				}
			}else{
				this.fbuinessAccount = JSON.parse(decodeURIComponent(options.fbuinessAccount));
				this.fotcOrder = JSON.parse(decodeURIComponent(options.fotcOrder));
				this.orderType = this.fotcOrder.order_type
				console.log(this.orderType)
				
				
				this.isConOrder = true
				this.isConfirmBtn = true
				this.countTime(this.fotcOrder.place_time)
				this.orderId = this.fotcOrder.order_id
				if(this.orderType == 2){
					uni.setNavigationBarTitle({
						title: '等待商家付款',
					})
					this.isOrderType = false
					this.isConfirmBtn = false
				}
			}
		},
		methods: {
			/* 复制 */
			copyEvent(data){
				uni.setClipboardData({
					data: data.toString(),
					success: () => {
						uni.showToast({
							icon: 'none',
							title: '复制成功'
						})
					}
				})
			},
			/* 保存图片 */
			saveQrcodeEvent(urlQrcode){
				uni.saveImageToPhotosAlbum({
					filePath: urlQrcode,
					success: ()=>{
						uni.showToast({
							title: '保存成功'
						})
					}
				});
			},
			/* 确认付款 */
			confirmPayEvent(confirmTxt){
				this.isClick = false
				let params = {
					order_id: this.orderId
				}
				if(this.confirmTxt == '确认放币'){
					this.ajaxJson({
						url: '/api/v1/otcOrder/userEnterColl',
						data: params,
						method: 'POST',
						call: (data)=>{
							this.isClick = true
							if(data.code == 200){
								uni.showToast({
									title: data.msg,
									success: () => {}
								})
								setTimeout(()=>{
									uni.reLaunch({
										url: '/pages/assets/orderRecord',
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
				}else if(this.confirmTxt == '确认已付款'){
				
					this.ajaxJson({
						url: '/api/v1/otcOrder/userEnterPay',
						method: 'POST',
						data: params,
						call: (data)=>{
							this.isClick = true
							if(data.code == 200){
								this.isConPay = true
								this.isConOrder = false
								this.isConfirmBtn = false
								this.orderTime = getLocalTime(new Date())
								this.countProceTime(this.orderTime)
								uni.showToast({
									title: data.msg,
									success: () => {
										uni.setNavigationBarTitle({
											title: '订单处理中......',
											success: () => {
												const webView = this.$scope.$getAppWebview()
												webView.setTitleNViewButtonStyle(0, {
													text: ' ',    
												});	
											}
										});
									}
								})
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
			getPayInfoEvent(){
				this.ajaxJson({
					url: '/api/v1/otcOrder/findByOrderId',
					data: {order_id: this.orderId },
					call: (data)=>{
						this.fbuinessAccount = data.data.fbuinessAccount
						this.fotcOrder = data.data.fotcOrder
						if(this.fotcOrder.order_status == 1 && this.fotcOrder.order_type == 2){
							this.isConfirmBtn = false
						}
						if(this.fotcOrder.order_status == 2 && this.fotcOrder.order_type == 2){
							this.isTime = false
						}
						if(this.fotcOrder.order_status == 3 ){
							this.isTime = false
						}

						if(data.data.fotcOrder.length !=0){
							this.orderType = data.data.fotcOrder.order_type
							if( this.fotcOrder.order_status == 2 && this.fotcOrder.order_type == 2){
								this.isConfirmBtn = true
								this.confirmTxt = '确认放币'
								uni.setNavigationBarTitle({
									title: '等待确认放币',
								})
								const webView = this.$scope.$getAppWebview()
								webView.setTitleNViewButtonStyle(0, {
									text: ' ',    
								});
							}
		
							if(this.fotcOrder.order_status == 1){
								this.countTime()
							}
							if(this.fotcOrder.order_type == 2 && this.fotcOrder.order_status == 1){
								uni.setNavigationBarTitle({
									title: '等待商家付款',
								})
								const webView = this.$scope.$getAppWebview()
								webView.setTitleNViewButtonStyle(0, {
									text: ' ',    
								});
								this.isOrderType = false
								this.isConfirmBtn = false
								
							}
						}
						let placeTime = this.fotcOrder.place_time
						if(this.fotcOrder.pay_time){
							this.countProceTime(this.fotcOrder.pay_time)
						}
					}
				})
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
			onNavigationBarButtonTap(e) {
				if (e.float == 'right') {
					if(this.isConOrder){
						this.ajaxJson({
							url: '/api/v1/otcOrder/revokeOrder',
							method: 'POST',
							data: { order_id: this.fotcOrder.order_id },
							call: (data)=>{
								if(data.code == 200){
									uni.showToast({
										title: data.msg,
										success: () => {
											uni.setNavigationBarTitle({
												title: '订单已撤销',
												success: () => {
													this.isCancel = false
													uni.navigateTo({})
												}
											});
										}
									})
								}
							}
						})
					}
				}
			},
			countProceTime(orderTime){
					clearInterval(this.timer)
					let timerProce
					this.flagProce = false
					timerProce = setInterval(()=>{
						let newDataTime = orderTime.replace(/-/g, '/')
						let newTime = new Date(newDataTime).getTime() + 60*60*1000
						let nowTime = new Date().getTime()
						let timeProce = newTime - nowTime
						let day = parseInt(timeProce / 1000 / 60 / 60 / 24)
						let hours = parseInt(timeProce / 1000 / 60 / 60 % 24)
						let min = parseInt(timeProce / 1000 / 60 % 60 )
						let sec = parseInt(timeProce / 1000 %  60 )
						this.proceCount = day.toString().padStart(2 ,0) + ':' + hours.toString().padStart(2 ,0) + ':' + min.toString().padStart(2 ,0) + ':' + sec.toString().padStart(2 ,0)
						if(timeProce <= 1000){
							clearInterval(timerProce)
						}
					}, 1000)
			},
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
						uni.setNavigationBarTitle({
							title: '订单已撤销',
							success: () => {
								const webView = this.$scope.$getAppWebview()
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
		},
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
			background-color: #f2f2f2;
			padding: 0 30rpx;
			.detailTit{
				padding-top: 40rpx;
				font-size: 28rpx;
				color: #999;
			}
			.orderNum{
				margin-top: 25rpx;
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
			display: flex;
			justify-content: space-between;
			.orderDetailState{
				color: $c3;
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
			background-color: #f2f2f2;
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
		margin: 120rpx 30rpx 0;
		border-radius: 4rpx;
		button{
			background-color: #B8393C;
			color: #fff;
		}
	}
	
</style>
