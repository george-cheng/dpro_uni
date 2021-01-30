<template>
	<view class="exchangeMallDetail mainBox" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
		<view class="topDetail">
			<view class="detailTit" v-if="mallDetail.state == 1">待发货</view>
			<view class="detailTit" v-if="mallDetail.state == 2">确认收货</view>
			<view class="detailTit" v-if="mallDetail.state == 3">订单已完成</view>
			<view class="detailImg">
				<image :src=" mallDetail.state == '1' ? giftImg : carImg " mode="aspectFit"></image>
			</view>
		</view>
		<view class="detailAddress">
			<view class="addressImg">
				<image src="../../static/images/map.png" mode="aspectFit"></image>
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
					<view class="shopState" v-if="mallDetail.state == 1">待发货</view>
					<view @click="shopStateEvent(mallDetail)" class="shopState" v-if="mallDetail.state == 2">确认收货</view>
					<view class="shopState" v-if="mallDetail.state == 3">订单已完成</view>
				</view>
			</view>
			<view class="remarksSize">
				<view class="sizeTit">用户备注：</view>
				<view class="remarksSizeArea">
					{{mallDetail.remarks}}
				</view>
			</view>
			
		</view>
		<view class="orderDetail">
			<view class="detailTxt">订单信息</view>
			<view class="orderInfo">
				
				<view>
					<view class="orderLft">订单编号：{{mallDetail.id}}</view>
					<view class="orderRgt" @click="copyEvent(mallDetail.id)">复制</view>
				</view>
				<view>
					<view class="orderLft">兑换时间：{{mallDetail.cash_time}}</view>
				</view>
				<view v-if="mallDetail.send_time">
					<view class="orderLft">发货时间：{{mallDetail.send_time}}</view>
				</view>
				<view v-if="mallDetail.receive_time">
					<view class="orderLft">收货时间：{{mallDetail.receive_time}}</view>
					<view class="orderRgt" @click="copyEvent(mallDetail.receive_time)">复制</view>
				</view>
				<view>
					<view class="orderLft">商家姓名：{{mallDetail.fuser.frealName}}</view>
					<view class="orderRgt" @click="copyEvent(mallDetail.fuser.frealName)">复制</view>
				</view>
				<view>
					<view class="orderLft">联系方式：{{mallDetail.fuser.floginName}}</view>
					<view class="orderRgt" @click="copyEvent(mallDetail.fuser.floginName)">复制</view>
				</view>
				<view>
					<view class="orderLft">物流单号：{{mallDetail.express_order}}</view>
					<view class="orderRgt" @click="copyEvent(mallDetail.express_order)">复制</view>
				</view>
				<view>
					<view class="orderLft">物流名称：{{mallDetail.express_name}}</view>
					<view class="orderRgt" @click="copyEvent(mallDetail.express_name)">复制</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { unimixin } from '../../utils/unimixin.js'
	export default {
		mixins: [ unimixin ],
		data(){
			return{
				id: '',
				
				carImg: '/static/images/car.png',
				giftImg: '/static/images/gift.png',
				mallDetail: '',
				receiveAddress: '',
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		onNavigationBarButtonTap(e) {
			if(e.float == 'left') {
				uni.reLaunch({
					url: '/pages/contractExchange/exchangeMallRecord',
					success: () => {}
				})
			}
		},
		methods: {
			touchEnd(e){
				if(this.changeY > 50){
					this.getExchangeMallDetail()
					
					this.paddingTop = 0
				}
			},
			getExchangeMallDetail(){
				this.ajaxJson({
					url: '/api/v1/treatyCashOrder/queryByIdAndUid',
					data: { id: this.id },
					call: (data)=>{
						if(data.code == 200){
							this.mallDetail = data.data
							this.receiveAddress = data.data.receiveAddress
						}
					}
				})
			},
			shopStateEvent(item){
				this.ajaxJson({
					url: '/api/v1/treatyCashOrder/userEnterReceive',
					method: 'POST',
					data: { id: item.id },
					call: (data)=>{
						if(data.code == 200){
							uni.showToast({
								icon: 'none',
								title: data.msg,
								success: () => {}
							})
							setTimeout(()=>{
								uni.reLaunch({
									url: '/pages/contractExchange/exchangeMallRecord',
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
			},
			copyEvent(data){
				uni.setClipboardData({
					data: data,
					success: () => {
						uni.showToast({
							icon: 'none',
							title: '复制成功'
						})
					}
				})
			},
		},
		created() {
			this.getExchangeMallDetail()
		}
	}
</script>

<style scoped lang="scss">
	.exchangeMallDetail{
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
		.remarksSize{
			font-size: 28rpx;
			color: $c9;
			.remarksSizeArea{
				color: $c3;
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
		
		
	}
</style>
