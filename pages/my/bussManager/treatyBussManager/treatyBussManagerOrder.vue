<template>
	<view class="treatyBussManagerOrder mainBox" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
		<view class="recordArea">
			<view v-for="(item, index) in treatyOrderInfo" :key="index" @click="mallDetailEvent(item)">
				<view class="flexArea">
					<view class="areaLft">
						<view class="areaName">{{item.region_type == '1' ? '平台区' : '商家区'}}</view>
						<view class="areaImg">
							<image :src="url + item.desc_diagram" mode="aspectFit"></image>
						</view>
					</view>
					<view class="areaMid">
						<view class="name">{{item.name}}</view>
						<view class="itemName">{{item.item_type == '1' ? '虚拟物品' : '实体物品'}}</view>
						<view class="totalPrice">总价：¥ {{item.price}} USDT</view>
						<view class="time">{{item.cash_time}}</view>
					</view>
				</view>
				<view class="areaRgt">
					<view class="state" v-if="item.state == 1">买家已付款</view>
					<view class="state" v-if="item.state == 2">卖家已发货</view>
					<view class="state" v-if="item.state == 3">买家已收货</view>
					<view class="state" v-if="item.state == 4">已撤销</view>
					
					<view class="price">¥ {{item.price}} USDT</view>
					<view class="amount">X1</view>
					
					<view class="shopState" v-if="item.state == 1">待发货</view>
					<view class="shopState" v-if="item.state == 2">待收货</view>
					<view class="shopState" v-if="item.state == 3">订单已完成</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { unimixin } from '../../../../utils/unimixin.js'
	export default {
		mixins: [ unimixin ],
		data(){
			return{
				treatyOrderInfo: []
			}
		},
		onLoad() {

		},
		onNavigationBarButtonTap(e){
			if(e.float == 'left'){
				uni.reLaunch({
					url: '/pages/my/bussManager/treatyBussManager/treatyBussManager',
					success: () => {}
				})
			}
		},
		onReachBottom(){
			if(this.page>=this.pageNum){
				this.page = this.pageNum
			}else{
				this.page += 1
				this.getTreatyBussManagerOrder()
			}
		},
		methods: {
			touchEnd(e){
				if(this.changeY > 50){
					this.page = 1
					this.treatyOrderInfo = []
					this.getTreatyBussManagerOrder()
					this.paddingTop = 0
				}
			},
			getTreatyBussManagerOrder(){
				this.ajaxJson({
					url: '/api/v1/treatyCashOrder/businessOrders',
					data: { page: '1', 'pageSize': '10' },
					call: (data)=>{
						if(data.code == 200){
							this.pageTotal = data.data.total
							this.treatyOrderInfo = []
							this.treatyOrderInfo = [...this.treatyOrderInfo, ...data.data.rows]
						}
					}
				})
			},
			mallDetailEvent(item){
				uni.reLaunch({
					url: '/pages/my/bussManager/treatyBussManager/treatyBussManagerDetail?category=2&id=' + item.id,
					success: () => {}
				})
			}
		},
		created() {
			this.getTreatyBussManagerOrder()
		}
	}
</script>

<style scoped lang="scss">
	.treatyBussManagerOrder{
		.recordArea{
			margin-top: 30rpx;
		}
		.recordArea>view{
			background-color: #f7f7f7;
			padding: 30rpx 30rpx;
			display: flex;
			justify-content: space-between;
			margin-top: 20rpx;
			.flexArea{
				display: flex;
				justify-content: space-between;
				.areaLft{
					display: flex;
					flex-direction: column;
					.areaName{
						color: #b8393c;
					}
					.areaImg{
						margin-top: 25rpx;
						width: 158rpx;
						height: 158rpx;
						background-color: #fff;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					image{
						width: 80%;
						height: 80%;
					}
				}
				.areaMid{
					margin-left: 30rpx;
					.name{
						font-size: 30rpx;
						line-height: 30rpx;
						color: $c3;
					}
					.itemName{
						margin-top: 20rpx;
						font-size: 26rpx;
						line-height: 26rpx;
						color: $c6;
					}
					.totalPrice{
						margin-top: 50rpx;
						font-size: 28rpx;
						line-height: 28rpx;
						color: $c9;
					}
					.time{
						margin-top: 30rpx;
						color: $c6;
						font-size: 24rpx;
						line-height: 24rpx;
					}
				}
			}
			.areaRgt{
				margin-right: 0;
				.state{
					color: #b8393c;
					font-size: 24rpx;
					line-height: 24rpx;
				}
				.price{
					margin-top: 30rpx;
					color: $c6;
					font-size: 22rpx;
				}
				.amount{
					margin-top: 20rpx;
					color: $c9;
					font-size: 28rpx;
					line-height: 28rpx;
				}
				.shopState{
					margin-top: 38rpx;
					padding: 12rpx 0;
					border: 1px solid #b8393c;
					border-radius: 24rpx;
					text-align: center;
					font-size: 22rpx;
					line-height: 22rpx;
					color: #b8393c;
				}
			}
		}
	}
</style>
