<template>
	<view class="treatyBussManagerDetail noNavMainBox" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
		<view class="topDetail">
			<view class="detailTit" v-if="mallDetail.state == 1">已兑换</view>
			<view class="detailTit" v-if="mallDetail.state == 2">待发货</view>
			<view class="detailTit" v-if="mallDetail.state == 3">订单已完成</view>
			<view class="detailImg">
				<image :src="giftImg" mode="aspectFit"></image>
			</view>
		</view>
		<view class="detailAddress">
			<view class="addressImg">
				<image src="/static/images/map.png" mode="aspectFit"></image>
			</view>
			<view class="addressInfo">
				<view class="area">{{receiveAddress.area}}</view>
				<view class="fullAddress">{{receiveAddress.full_address}}</view>
				<view class="personInfo">
					{{receiveAddress.name}} &nbsp; {{receiveAddress.phone.toString().replace(/(\d{3})\d{4}(\d{4})/g, '$1****$2')}}
				</view>
			</view>
		</view>
		<view class="detailShop">
			<view class="shopInfo">
				<view class="infoArea">
					<view class="infoLft">
						<view class="shopRegionType">{{mallDetail.region_type == 1 ? '平台区' : '商家区'}}</view>
						<view class="shopImg">
							<image :src="url + mallDetail.desc_diagram" mode="aspectFit"></image>
						</view>
					</view>
					<view class="infoMid">
						<view class="shopName">{{mallDetail.name}}</view>
						<view class="shopItemType">{{mallDetail.item_type == 1 ? '虚拟物品' : '实体物品'}}</view>
					</view>
				</view>
				<view class="infoRgt">
					<view class="shopPrice">¥ {{mallDetail.price}} USDT</view>
					<view class="shopAmount">X 1</view>
					<view class="shopState" @click="isClick && confirmSendShop(mallDetail)"  v-if="mallDetail.state == 1">确认发货</view>
					<view class="shopState" v-if="mallDetail.state == 2">待收货</view>
					<view class="shopState" v-if="mallDetail.state == 3">订单已完成</view>
				</view>
			</view>
		</view>
		
		<uni-popup ref="popup" type="dialog">
			<view class="sendShopArea">
				<view class="sendShopTit">物流信息</view>
				<view class="logisticsName">
					<view class="nameTxt">物流名称：</view>
					<input type="text" maxlength="10" v-model="express_name" />
				</view>
				<view class="logisticsNum">
					<view class="nameTxt">物流单号：</view>
					<input type="text" maxlength="20" v-model="express_order" />
				</view>
				<view class="logisticsBtn" @click="isClick && logisticsBtnEvent()">确认发货</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import { unimixin } from '../../../../utils/unimixin.js'
	
	import uniPopup from '../../../../components/uni-popup/uni-popup.vue'
	import uniPopupMessage  from '../../../../components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '../../../../components/uni-popup/uni-popup-dialog.vue'
	export default {
		components: { uniPopup, uniPopupDialog, uniPopupMessage},
		mixins: [ unimixin ],
		data(){
			return{
				category: '',
				id: '',
				shopId: '',
				mallDetail: '',
				receiveAddress: '',
				giftImg: '/static/images/gift.png',
				isSendShop: true,
			
				
				express_name: '',
				express_order: '',
			}
		},
		onLoad(options) {
			this.category = options.category
			this.id = options.id
		},
		onNavigationBarButtonTap(e) {
			if(e.float == 'left') {
				let url = ''
				if(this.category == 1){
					url = '/pages/my/bussManager/treatyBussManager/treatyBussManager'
				}else{
					url = '/pages/my/bussManager/treatyBussManager/treatyBussManagerOrder'
				}
				uni.reLaunch({
					url: url,
					success: () => {}
				})
			}
		},
		
		methods: {
			touchEnd(e){
				if(this.changeY > 50){
					this.getTreatyShopDetail()
					
					this.paddingTop = 0
				}
			},
			confirmSendShop(item){
				this.shopId = item.id
				if(item.item_type == 1){
					this.isClick = false
					this.ajaxJson({
						url: '/api/v1/treatyCashOrder/businessEnterSend',
						method: 'POST',
						data: { id: item.id },
						call: (data)=>{
							this.isClick = true
							if(data.code == 200){
								uni.showToast({
									icon: 'none',
									title: data.msg,
									success: () => {}
								})
								this.getTreatyShopDetail()
							}else{
								uni.showToast({
									image: '/static/images/wrong.png',
									title: data.msg,
									success: () => {}
								})
							}
						}
					})
				}else{
					this.$refs.popup.open()
				}

			},
			logisticsBtnEvent(){
				this.isClick = false
				if(!this.express_name && !this.express_order){
					uni.showToast({
						icon: 'none',
						title: '请输入物流公司或单号',
						success: () => {}
					})
				}else{
					this.ajaxJson({
						url: '/api/v1/treatyCashOrder/businessEnterSend',
						method: 'POST',
						data: { id: this.shopId, express_name: this.express_name, express_order: this.express_order},
						call: (data)=>{
							this.isClick = true
							this.$refs.popup.close()
							if(data.code == 200){
								uni.showToast({
									icon: 'none',
									title: data.msg,
									success: () => {}
								})
								this.getTreatyShopDetail()
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
			getTreatyShopDetail(){
				this.ajaxJson({
					url: '/api/v1/treatyCashOrder/queryByIdAndBid',
					data: { id: this.id },
					call: (data)=>{
						if(data.code == 200){
							this.mallDetail = data.data
							this.receiveAddress = data.data.receiveAddress
						}
					}
				})
			},
			close(){
			  this.$refs.popup.close()
			},
			
		},
		created() {
			this.getTreatyShopDetail()
		}
	}
</script>

<style scoped lang="scss">
	.uni-popup{
		z-index: 1;
	}
	.treatyBussManagerDetail{
		.topDetail{
			display: flex;
			justify-content: space-between;
			background-color: #f7f7f7;
			padding: 40rpx 112rpx 40rpx 40rpx;
			.detailTit{
				font-size: 26rpx;
				color: #b8393c;
			}
			.detailImg{
				width: 116rpx;
				height: 90rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
		.detailAddress{
			margin-top: 20rpx;
			padding: 35rpx 30rpx 70rpx;
			background-color: #f7f7f7;
			display: flex;
			align-items: center;
			.addressImg{
				width: 44rpx;
				height: 44rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
		.addressInfo{
			margin-left: 30rpx;
			.area{
				font-size: 24rpx;
				color: $c6;
			}
			.fullAddress{
				color: $c3;
				font-size: 36rpx;
			}
			.personInfo{
				color: $c6;
				font-size: 26rpx;
			}
		}
		.detailShop{
			margin-top: 20rpx;
			background-color: #f7f7f7;
			padding: 30rpx;
			.shopInfo{
				display: flex;
				margin-left: 38rpx;
				justify-content: space-between;
				margin-top: 20rpx;
				.infoArea{
					display: flex;
					.infoLft{
						.shopRegionType{
							font-size: 24rpx;
							color: #b8393c;
						}
						.shopImg{
							margin-top: 20rpx;
							width: 158rpx;
							height: 158rpx;
							background-color: #fff;
							display: flex;
							align-items: center;
							justify-content: center;
							image{
								width: 80%;
								height: 80%;
							}
						}
					}
					.infoMid{
						margin-left: 28rpx;
						.shopName{
							font-size: 30rpx;
							color: $c3;
						}
						.shopItemType{
							margin-top: 18rpx;
							font-size: 26rpx;
							color: $c6;
						}
					}
				}
				.infoRgt{
					.shopPrice{
						color: $c6;
						font-size: 28rpx;
					}
					.shopAmount{
						margin-top: 20rpx;
						font-size: 28rpx;
						color: $c9;
					}
					.shopState{
						margin-top: 60rpx;
						padding: 12rpx 0;
						border: 1px solid #b8393c;
						border-radius: 24rpx;
						text-align: center;
						font-size: 24rpx;
						line-height: 24rpx;
						color: #b8393c;
					}
				}
			}
		}
		.orderDetail{
			margin-top: 20rpx;
			background-color: #f7f7f7;
			padding: 30rpx;
			.detailTxt{
				font-size: 28rpx;
				color: $c6;
			}
			.orderInfo{
				margin-top: 32rpx;
			}
			.orderInfo>view{
				margin-top: 10rpx;
				display: flex;
				justify-content: space-between;
				font-size: 28rpx;
				color: $c6;
				.orderRgt{
					padding: 2rpx 12rpx;
					border: 1px solid #b8393c;
					border-radius: 8rpx;
					text-align: center;
					display: flex;
					align-items: center;
					font-size: 24rpx;
					line-height: 24rpx;
					color: #b8393c;
				}
			}
		}
		.sendShopArea{
			width: 540rpx;
			background-color: #fff;
			border-radius: 20rpx;
			padding: 0 30rpx 30rpx;
			.sendShopTit{
				padding-top: 20rpx;
				display: flex;
				justify-content: center;
				font-size: 32rpx;
				color: $c3;
			}
			.logisticsName, .logisticsNum{
				display: flex;
				align-items: center;
				margin-top: 10rpx;
				input{
					border-bottom: 1px solid $c3;
				}
			}
			.logisticsNum{
				margin-top: 20rpx;
			}
			.logisticsBtn{
				display: flex;
				justify-content: flex-end;
				font-size: 30rpx;
				margin-top: 30rpx;
				margin-right: 18rpx;
				color: #b8393c;
			}
		}
	}
</style>
