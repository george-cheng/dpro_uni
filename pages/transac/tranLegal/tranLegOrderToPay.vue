<template>
	<view class="tranLegOrderToPay">
		<view class="toPayTit">
			<view class="toPayClock" v-if="!this.isOrderCancel && !this.isCollect">
				<view class="clock">
					<image src="/static/images/clock.png" mode=""></image>
					<text v-if="this.isConOrder">{{clockTime}}</text>
					<text v-if="this.isConPay">{{proceCount}}</text>
				</view>
				<text class="clockTip" v-if="this.isConOrder">请在30分钟内向商家付款，否则订单将会自动取消</text>
				<text class="clockTip" v-if="this.isConPay">商家将会在48小时钟内进行处理，请耐心等待</text>
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
		
		<view class="bussinessDetail"  v-if="!this.isOrderCancel && !this.isCollect">
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
					
					<view class="zfbMethodPay">
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
		
		<view class="confirmPay" @click="confirmPayEvent" v-if="this.isConOrder">
			<button type="default">确认付款</button>
		</view>
		
	</view>
</template>

<script>
	import { accAdd, getLocalTime } from '../../../utils/common.js'
	export default {
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
				
				
				isConOrder: false,   //确认下单
				isConPay: false,   //确认付款
				isCollect: false,   //确认收款
				isOrderCancel: false,   //取消
				
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
						title: '确认收款',
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
				this.countTime(this.fotcOrder.place_time)
				this.orderId = this.fotcOrder.order_id
				this.isConOrder = true
			}
		},
		methods: {
			/* 复制 */
			copyEvent(data){
				uni.setClipboardData({
					data: data.toString()
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
			confirmPayEvent(){
				let params = {
					order_id: this.orderId
				}
				this.ajaxJson({
					url: '/api/v1/otcOrder/userEnterPay',
					method: 'POST',
					data: params,
					call: (data)=>{
						if(data.code == 200){
							this.isConPay = true
							this.isConOrder = false
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
			},
			getPayInfoEvent(){
				this.ajaxJson({
					url: '/api/v1/otcOrder/findByOrderId',
					data: {order_id: this.orderId },
					call: (data)=>{
						if(data.data.fotcOrder.length !=0){
							this.fotcOrder = data.data.fotcOrder
							if(this.fotcOrder.order_status == 1){
								this.countTime()
							}
						}
						this.fbuinessAccount = data.data.fbuinessAccount
						let placeTime = this.fotcOrder.place_time
						this.countProceTime(this.fotcOrder.pay_time)
						this.countProceTime(this.fotcOrder.pay_time)
						
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
						let newTime = new Date(newDataTime).getTime() + 2*24*60*60*1000
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
						color: #fff;
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
				color: #fff;
				margin: 40rpx auto 0;
			}
		}
		.orderDetail{
			margin-top: 50rpx;
			background-color: #303030;
			padding: 0 30rpx;
			.detailTit{
				padding-top: 40rpx;
				font-size: 28rpx;
				color: #fff;
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
					color: #fff;
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
				color: #fff;
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
			background-color: #303030;
			padding: 0 30rpx;
			.bussTit{
				font-size: 28rpx;
				color: #fff;
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
									color: #fff;
									font-size: 40rpx;
									margin-right: 10rpx;
								}
								text{
									color: #fff;
									font-size: 28rpx;
								}
							}
							.payArrow::before{
								color: #fff;
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
									color: #fff;
									margin-top: 10rpx;
									text-align: center;
								}
							}
							.payName, .payAcc{
								display: flex;
								justify-content: space-between;
								margin-top: 20rpx;
								.nameLft{
									color: #fff;
								}
								.infoRgt{
									color: #fff;
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
		color: #fff;
		border: 2rpx solid #fff;
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
