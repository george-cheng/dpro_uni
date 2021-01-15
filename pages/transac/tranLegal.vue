<template>
	<view class="tranLegal mainBox" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
		<view class="tranCon">
			<view class="realName"  @click="nameRgtEvent(userInfo.authDeep)">
				<view class="nameLft">
					<view class="nameIcon" :class="userInfo.authDeep ? 'i-checked' : 'i-check'"></view>
					<text>{{userInfo.authDeep ? '已高级实名认证' : '未进行高级实名认证'}}</text>
				</view>
				<view class="nameRgt">
					<text class="i-rgtArrow"></text>
				</view>
			</view>
			<!-- <view class="tranTip">
				<view class="tranAuth">
					<text>进行初级实名制认证</text>
				</view>
				<view class="addBank">
					<view class="bankIcon i-bankIco"></view>
					<text class="bankTxt">添加银行卡</text>
				</view>
			</view> -->
			<view class="tranSwitch">
				<view class="tranBuy" :style="{backgroundColor: tranOn != 1 ? '#3BA987' : ''}" :class="{'tranChoice': tranOn !== 1}" @click="tranBuyEvent">买入</view>
				<view class="tranSale" :style="{backgroundColor: tranOn == 1 ? '#B8393C' : ''}" :class="{'tranChoice': tranOn === 1}" @click="tranSaleEvent">卖出</view>
			</view>
			<view class="tranPresent">
				<view class="choiceKind">
					<text>选择法币</text>
				</view>
				<view class="myBankCard">
					<!-- <text class="bankCardTxt">我的银行卡</text> -->
				</view>
			</view>
			<view class="tranIpt" v-if="isTranIpt">
				<view class="kindIpt">
					<input type="text" v-model="tranKind" disabled>
					<span class="kindIco i-downArrow" @click="kindListEvent"></span>
					<view class="tranKindList" v-if="isKindList">
						<view @click="kindChoiceEvent(item, index)" v-if="index < 1" v-for="(item, index) in kindList" :key="index">{{item.trade_desc}}</view>
					</view>
					<view class="tranKindRate">
						<text>1 USDT = ¥ {{buyPrice}} CNY</text>
					</view>
				</view>
				<view class="kindQuantity">
					<input type="number" @blur="inputEvent" v-model="quantity" placeholder="请输入数量">
					<text class="quantityUnit">USDT</text>
				</view>
			</view>
			
			
			<view class="tranIpt" v-if="isTranSaleIpt">
				<view class="kindIpt">
					<input type="text" v-model="tranKind" disabled>
					<span class="kindIco i-downArrow" @click="kindListEvent"></span>
					<view class="tranKindList" v-if="isKindList" >
						<view @click="kindChoiceEvent(item, index)" v-if="index < 1" v-for="(item, index) in kindList" :key="index">{{item.trade_desc}}</view>
					</view>
					<view class="tranKindRate">
						<text>1 USDT = ¥ {{sellPrice}} CNY</text>
					</view>
				</view>
				<view class="kindQuantity">
					<input type="number" @blur="inputEvent" v-model="quantity" placeholder="请输入数量">
					<text class="quantityUnit">USDT</text>
				</view>
			</view>
			
			
			<!-- <view class="iptTip">
				<text>{{iptTip}}</text>
			</view> -->
			<view class="tranBtn" @click="tranBtnEvent" :style="{backgroundColor: tranOn == 0 ? '#3BA987' : '#B8393C'}">
				<view>{{btnTxt}}</view>
			</view>
		</view>
		<view class="order">
			<view class="orderTit">
				<view class="newOrder">
					<text>商家挂单</text>
				</view>
				<view class="historyOrder" @click="historyOrderEvent">
					<text>订单记录</text>
				</view>
			</view>
			<view class="orderList">
				<view v-for="(item, index) in orderList" :key="item.trans_id" @click="orderListEvent(item)">
					<view class="orderTime"><text>商家：{{item.buiness_name}}</text></view>
					<view class="orderInfo">
						<view class="orderDetail">
							<text class="orderType">{{item.type === 1 ? '买入 ' : '卖出 '}}</text>
							<text class="orderKind">{{coinName}}</text>
						</view>
						<view class="orderUnitPrice">
							<text>单价：</text>
							<text>¥{{item.price}}</text>
						</view>
						<view class="orderQuantity">
							<text>数量：</text>
							<text>{{item.amount}}</text>
						</view>
					</view>
					<view class="orderState">
						<view class="orderPay">
							<text>时间：</text>
							<text>{{item.create_time}}</text>
						</view>
						<!-- <view class="orderPay">
							<text>已付款：</text>
							<text>1400</text>
						</view> -->
						<view class="orderStatus">
							<text>{{item.type === 1 ? '购买' : '出售'}}</text>
							<span class="statusIco i-rgtArrow"></span>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<uni-popup ref="popup" type="bottom" >
			<uni-popup-share :title="operaMethod" @comfirm="comfirm" style="background-color: #f2f2f2;" :style="{ color: tranOn == '0'?'#999': '#B8393C' }">
				<view class="popupCon">
					<view class="popupPrice">单价：¥{{popupPrice}}</view>
					<input class="popupQuantity" type="text" v-model="popupQuantity" @input="calcTotalIptEvent" @blur="calcTotalEvent"  placeholder="请输入数量">
					<view class="popupQuota">限额： {{minQuota}} - {{maxQuota}} {{coinName}}</view>
					<view class="popupPay">实付款：¥ {{payMoney}}</view>
				</view>
			</uni-popup-share>
		</uni-popup>

	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupShare from '../../components/uni-popup/uni-popup-share.vue'
	import { accMul } from '../../utils/common.js'
	import { unimixin } from '../../utils/unimixin.js'
	export default {
		name: 'tranLegal',
		mixins: [ unimixin ],
		data(){
			return{
				tranOn: 0,
				tranSale: 1,
				isKindList: false,
				tranKind: '人民币',
				quantity: '',
				iptTip: '按金额购买',
				btnTxt: '立即买入',
				kindList: [],
				orderList: [],
				isTranIpt: true,
				isTranSaleIpt: false,
				userInfo: {},
				buyPrice: '',
				sellPrice: '',
				tranType: '1',

				popupPrice: '',
				popupQuantity: '',
				minQuota: '',
				maxQuota: '',
				payMoney: '0',
				market_id: '0',
				trans_id: '',
				isVerifica: false,
				
				coinName: 'USDT',
				operaMethod: '购买'
			}
		},
		components: { uniPopup, uniPopupShare },
		onLoad() {

		},
		onShow() {
			
		},
		onReachBottom(){
			if(this.page >= this.pageNum){
				this.page = this.pageNum
			}else{
				this.page += 1
				this.getOrderList()
			}
		},
		methods: {

			touchEnd(e){
				if(this.changeY > 50){
					this.paddingTop = 0
					this.getUserInfo()
					this.getLegalKind()
					this.getOrderList()
				}
			},

			calcTotalEvent(){
				if(parseInt(this.popupQuantity) > this.maxQuota){
					uni.showToast({
						image: '/static/images/wrong.png',
						title: '数量不能大于' + this.maxQuota,
						success: () => {
							this.popupQuantity = ''
							this.payMoney = '0'
							this.isVerifica = false 
						}
					})
				}else if(parseInt(this.popupQuantity) < this.minQuota){
					uni.showToast({
						image: '/static/images/wrong.png',
						title: '数量不能小于' + this.minQuota,
						success: () => {
							this.popupQuantity = ''
							this.payMoney = '0'
							this.isVerifica = false
						}
					})
				}else{
					this.isVerifica = true
				}
			},
			calcTotalIptEvent(){
				this.payMoney = accMul(this.popupPrice, this.popupQuantity)
			},
			comfirm(){
				if(!this.popupQuantity){
					uni.showToast({
						image: '/static/images/wrong.png',
						title: '数量不能为空'
					})
				}else{
					if(this.isVerifica){
						let params = {
							trans_id: this.trans_id,
							price: this.popupPrice,
							amount: this.popupQuantity,
						}
						this.ajaxJson({
							url: '/api/v1/otcOrder/enterOrderByTrans',
							method: 'POST',
							data: params,
							call: (data)=>{
								if(data.code == 200){
									uni.showToast({ 
										title: data.msg,
										success: () => {
											this.$refs.popup.close()
											uni.navigateTo({
												url: '/pages/transac/tranLegal/tranLegOrderToPay?fbuinessAccount=' + encodeURIComponent(JSON.stringify(data.data.fbuinessAccount)) + '&fotcOrder=' + encodeURIComponent(JSON.stringify(data.data.fotcOrder))
											})
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
				}
			},
			orderListEvent(item){
				this.popupQuantity = ''
				this.calcTotalIptEvent()
				this.$refs.popup.open()
				this.popupPrice = item.price
				this.minQuota = this.kindList[0].min_trans
				this.maxQuota = item.amount
				this.market_id = item.market_id
				this.trans_id = item.trans_id
			},
			tranBuyEvent(){
				this.tranOn = 0
				this.isTranSaleIpt = true
				this.isTranIpt = false
				this.btnTxt = '立即买入'
				this.buyPrice = ''
				this.sellPrice = this.kindList[0].sell_price
				this.quantity = ''
				this.tranType = '1'
				this.getOrderList()
				this.operaMethod = '购买'
			},
			tranSaleEvent(){
				this.tranOn = 1
				this.isTranSaleIpt = false
				this.isTranIpt = true
				this.btnTxt = '立即卖出'
				this.sellPrice = ''
				this.buyPrice = this.kindList[0].buy_price
				this.quantity = ''
				this.tranType = '2'
				this.getOrderList()
				this.operaMethod = '出售'
			},
			/* 币种选择  */
			kindListEvent(){
				this.isKindList = !this.isKindList
			},
			/* 限定数量 */
			inputEvent(){
				if(parseInt(this.quantity) > this.kindList[0].max_trans){
					this.quantity = this.kindList[0].max_trans
					uni.showToast({
						image: '/static/images/wrong.png',
						title: '数量不能大于' + this.kindList[0].max_trans
					})
				}else if(parseInt(this.quantity) < this.kindList[0].min_trans){
					this.quantity = this.kindList[0].min_trans
					uni.showToast({
						image: '/static/images/wrong.png',
						title: '数量不能小于' + this.kindList[0].min_trans
					})
				}
			},
			tranBtnEvent(){
				if(!this.quantity){
					uni.showToast({
						image: '/static/images/wrong.png',
						title: '请输入数量'
					})
				}else{
					let params = {
						market_id: '1',
						price: this.sellPrice || this.buyPrice,
						amount: this.quantity,
						type: this.tranType
					}
					this.ajaxJson({
						url: '/api/v1/otcOrder/enterOrder',
						data: params,
						method: 'POST',
						call: (data)=>{
							if(data.code == 200){
								uni.showToast({ 
									title: data.msg,
									success: () => {
										uni.navigateTo({
											url: '/pages/transac/tranLegal/tranLegOrderToPay?fbuinessAccount=' + encodeURIComponent(JSON.stringify(data.data.fbuinessAccount)) + '&fotcOrder=' + encodeURIComponent(JSON.stringify(data.data.fotcOrder))
										})
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
			/* 选择币种 */
			kindChoiceEvent(item, index){
				if(index == 0){
					this.tranKind = item.trade_desc
				}
				this.isKindList = false
			},
			getLegalKind(){
				this.ajaxJson({
					url: '/api/v1/otcMarket/info',
					data: { fvid: '50' },
					call: (data)=>{
						this.kindList = data.data.rows
						this.buyPrice = this.kindList[0].sell_price
					}
				})
			},
			getOrderList(){
				let params = {
					market_id: '1',
					type: this.tranType,
					page: this.page,
					pageSize: this.pageSize
				}
				this.ajaxJson({
					url: '/api/v1/otcTrans/transInfo',
					data: params,
					call: (data)=>{
						if(data.code == 200){
							this.pageTotal = data.data.total
							this.orderList = []
							this.orderList = [...this.orderList, ...data.data.rows]
						}
					}
				})
			},
			getUserInfo(){
				uni.getStorage({
					key: 'userInfo',
					success: (data) => {
						this.userInfo = data.data
					}
				})
			},
			nameRgtEvent(Boolean){
				if(Boolean){
					uni.navigateTo({
						url: '/pages/my/authName/authDeepComplete?category=1'
					})
				}else{
					if(this.userInfo.post){
						uni.navigateTo({
							url: '/pages/my/authName/authDeepName'
						})
					}else{
						uni.navigateTo({
							url: '/pages/my/authName/authName'
						})
					}
				}
			},
			historyOrderEvent(){
				uni.reLaunch({
					url: '/pages/assets/orderRecord',
					success: () => {}
				})
			},
		},
		created() {
			this.getUserInfo()
			this.getLegalKind()
			this.getOrderList()
			let webView = this.$mp.page.$getAppWebview();
			webView.setTitleNViewButtonStyle(0,{
				text: ' ',  
			})
		}
	}
</script>

<style lang="scss">

	.tranLegal{
		.popupCon{
			color: #999;
			.popupQuantity{
				border: 1px solid #676869;
				width: 640rpx;
				height: 60rpx !important;
				border-radius: 4rpx;
				margin-top: 20rpx;
			}
			.popupQuota, .popupPay{
				margin-top: 20rpx;
			}
		}
		
		.legTit{
			display: flex;
			justify-content: space-between;
			margin: 0 100rpx;
			view{
				color: #7E7C8A;
				font-size: 28rpx;
				line-height: 56rpx;
			}
			view.choiceTran{
				position: relative;
			}
			view.choiceTran:after{
				content: '';
				display: inline-block;
				position: absolute;
				text-align: center;
				bottom: 0;
				left: 12rpx;
				width: 80%;
				height: 6rpx;
				border-radius: 2rpx;
				background-color: #fff;
			}
		}
		.tranCon{
			margin-top: 30rpx;
			.realName{
				height: 90rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 20rpx;
				background-color: #f2f2f2;
				.nameLft{
					display: flex;
					align-items: center;
					color: #999999;
					font-size: 24rpx;
					line-height: 24rpx;
					.nameIcon{
						margin-right: 10rpx;
						display: flex;
						align-items: center;
					}
				}
				.nameRgt{
					color: #999;
					font-size: 24rpx;
					line-height: 24rpx;
				}
			}
			.tranTip{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 35rpx 30rpx 0;
				.tranAuth{
					text{
						font-size: 22rpx;
						line-height: 22rpx;
						color: #BD3A3B;
					}
				}
				.addBank{
					display: flex;
					flex-direction: row;
					align-items: center;
					text{
						font-size: 22rpx;
						line-height: 22rpx;
						color: #BD3A3B;
					}
					.bankIcon{
						color: #BD3A3B;
						margin-right: 10rpx;
						margin-top: 5rpx;
					}
				}
			}
			.tranSwitch{
				margin: 75rpx 45rpx 0;
				display: flex;
				justify-content: space-between;
				text-align: center;
				align-items: center;
				view{
					background-color: #f2f2f2;
					height: 80rpx;
					width: 330rpx;
					text-align: center;
					color: #000;
					font-size: 30rpx;
					line-height: 80rpx;
				}
				.tranBuy{
					border-radius: 6rpx;
				}
				.tranSale{
					border-radius: 6rpx;
				}
				.tranChoice{
					border-radius: 6rpx;
					color: #fff;
				}
			}
			.tranPresent{
				margin: 40rpx 48rpx 0;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.choiceKind{
					text{
						font-size: 28rpx;
						line-height: 28rpx;
						color: #999999;
					}
				}
				.myBankCard{
					font-size: 26rpx;
					line-height: 28rpx;
					color: #BD3A3B;
				}
			}
			.tranIpt{
				margin: 30rpx 45rpx 0;
				view.kindIpt{
					position: relative;
					input{
						border: 2px solid #f2f2f2;
						height: 80rpx;
						border-radius: 10rpx;
					}
					.kindIco{
						position: absolute;
						right: 30rpx;
						top: 25rpx;
					}
					.i-downArrow:before{
						color: #999;
					}
					.tranKindList{
						position: absolute;
						width: 100%;
						background-color: #f2f2f2;
						top: 100rpx;
						border: 1px solid #f2f2f2;
						z-index: 9;
						view{
							color: #999;
							font-size: 32rpx;
							line-height: 48rpx;
							padding: 5rpx 0 10rpx 10rpx;
						}
					}
					.tranKindRate{
						margin-top: 20rpx;
						text{
							font-size: 28rpx;
							line-height: 28rpx;
							color: #999;
						}
					}
				}
				view.kindQuantity{
					margin-top: 52rpx;
					position: relative;
					input{
						border: 2px solid #f2f2f2;
						height: 80rpx;
						border-radius: 10rpx;
					}
					.quantityUnit{
						position: absolute;
						right: 30rpx;
						top: 25rpx;
						color: #fff;
						font-size: 24rpx;
						line-height: 50rpx;
					}
				}
			}
			.iptTip{
				display: flex;
				justify-content: flex-end;
				margin: 28rpx 43rpx 0;
				text{
					color: #BD3A3B;
					font-size: 26rpx;
					line-height: 26rpx;
				}
			}
			.tranBtn{
				margin: 28rpx 78rpx 0;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 80rpx;
				view{
					color: #fff;
					font-size: 28rpx;
				}
			}
		}
		.order{
			padding-bottom: 20rpx;
			.orderTit{
				display: flex;
				justify-content: space-between;
				margin: 40rpx 44rpx 0;
				.newOrder, .historyOrder{
					font-size: 28rpx;
					line-height: 28rpx;
					color: #666;
				}
			}
		}
		.orderList>view{
				border-bottom: 1px solid #f7f7f7;
			}
		.orderList{
			margin-top: 32rpx;
			background-color: #f2f2f2;
			.orderTime{
				padding: 10rpx 43rpx 0;
				justify-content: flex-start;
				text{
					font-size: 24rpx;
					line-height: 24rpx;
					color: #999;
				}
			}
			.orderInfo{
				padding: 0 43rpx;
				display: flex;
				margin: 28rpx 0;
				justify-content: space-between;
				.orderDetail{
					margin-bottom: 0rpx;
					.orderType, .orderKind{
						color: #BD3A3B;
						font-size: 28rpx;
						line-height: 28rpx;
					}
					.orderKind{
						color: #999;
					}
				}
				.orderUnitPrice, .orderQuantity{
					text{
						font-size: 24rpx;
						line-height: 24rpx;
						color: #999;
					}
					text:last-child{
						color: #999;
					}
				}
			}
			.orderState{
				padding: 0 43rpx;
				display: flex;
				margin: 28rpx 0;
				padding-bottom: 10rpx;
				justify-content: space-between;
				.orderPay{
					text{
						font-size: 24rpx;
						line-height: 24rpx;
						color: #999;
					}
					text:last-child{
						color: #999;
					}
				}
				.orderStatus{
					display: flex;
					align-items: center;
					text{
						font-size: 24rpx;
						line-height: 24rpx;
						color: #BD3A3B;
					}
					.statusIco{
						
					}
					.statusIco::before{
						color: #BD3A3B;
					}
				}
			}
		}
	}
</style>
