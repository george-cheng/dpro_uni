<template>
	<view class="bussManagerOrder mainBox" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
		<view v-for="(item, index) in bussManagerOrderList" :key="index" @click="bussManagerOrderEvent(item, index)">
			<view class="orderTop">
				<view :style="{color: item.order_type == '1' ? '#38ad70' : '#fe5c57'}">{{item.order_type == '1' ? '买入' : '卖出'}}USDT</view>
				<view style="color: #b8393c;" v-if="item.order_status == 1">待付款></view>
				<view style="color: #b8393c;" v-if="item.order_status == 2">待用户收款></view>
				<view style="color: #b8393c;" v-if="item.order_status == 3">已完成></view>
				<view style="color: #b8393c;" v-if="item.order_status == 4">已撤销></view>
			</view>
			<view class="orderMid">
				<view><text>{{item.price}}</text><text>单价(USDT)</text></view>
				<view><text>{{item.amount}}</text><text>数量(USDT)</text></view>
				<view><text>{{item.total}}</text><text>总额(USDT)</text></view>
			</view>
			<view class="orderBtm">
				<view>时间：{{item.place_time}}</view>
				<view>订单号：{{item.order_id}}</view>
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
				bussManagerOrderList: []
			}
		},
		onLoad() {

		},
		onReachBottom(){
			if(this.page>=this.pageNum){
				this.page = this.pageNum
			}else{
				this.page += 1
				this.getBussManagerOrderList()
			}
		},
		onNavigationBarButtonTap(e){
			if(e.float == 'left'){
				uni.reLaunch({
					url: '/pages/my/bussManager/legalBussManager/legalBussManager',
					success: () => {}
				})
			}
		},
		methods: {
			touchEnd(e){
				if(this.changeY > 50){
					this.page = 1
					this.getBussManagerOrderList()
					this.paddingTop = 0
				}
			},
			bussManagerOrderEvent(item, index){
				uni.reLaunch({
					url: '/pages/my/bussManager/legalBussManager/legalBussManagerOrderToPay?orderId=' + item.order_id,
					success: () => {}
				})
			},
			getBussManagerOrderList(){
				let params = {
					page: this.page,
					pageSize: this.pageSize,
				}
				this.ajaxJson({
					url: '/api/v1/otcOrder/buinessOrderList',
					data: params,
					call: (data)=>{
						if(data.code == 200){
							this.pageTotal = data.data.total
							this.bussManagerOrderList = [...this.bussManagerOrderList, ...data.data.rows]
						}
					}
				})
			}
		},
		created() {
			this.getBussManagerOrderList()
		}
	}
</script>

<style scoped lang="scss">

	.bussManagerOrder>view{
		background-color: #f2f2f2;
		padding: 10rpx 30rpx 10rpx;
		font-size: 24rpx;
		margin-top: 20rpx;
		.orderTop{
			margin-top: 10rpx;
		}
		.orderTop, .orderBtm{
			display: flex;
			justify-content: space-between;
			color: $c6;
		}
		.orderMid{
			margin-top: 15rpx;
			display: flex;
			justify-content: space-between;
			view{
				display: flex;
				flex-direction: column;
				text-align: center;
				color: $c3;
			}
		}
		.orderBtm{
			margin-top: 15rpx;
		}
	}
</style>
