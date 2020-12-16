<template>
	<view class="recordDetail mainBox">
		<view class="detailTit">
			<view class="detailLft">
				<text class="lftTop" v-if="fotcOrder.order_status === 1">确定下单</text>
				<text class="lftTop" v-if="fotcOrder.order_status === 2">确认付款</text>
				<text class="lftTop" v-if="fotcOrder.order_status === 3">确认收款</text>
				<text class="lftTop" v-if="fotcOrder.order_status === 4">已撤销</text>
			</view>
		</view>
		<view class="fotcOrder">
			<view>
				<text class="fotcLft">订单号</text>
				<text class="foctRgt">{{fotcOrder.order_id}}</text>
			</view>
			<view>
				<text class="fotcLft">付款金额</text>
				<text class="foctRgt">{{fotcOrder.total}}CNY</text>
			</view>
			<view>
				<text class="fotcLft">单价</text>
				<text class="foctRgt">{{fotcOrder.price}}</text>
			</view>
			<view>
				<text class="fotcLft">交易数量</text>
				<text class="foctRgt">{{fotcOrder.amount}}</text>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data(){
			return{
				order_id: '',
				total: '',
				price: '',
				amount: '',
				fotcOrder: {}
			}
		},
		onLoad(options) {
			this.order_id = options.orderId
		},
		methods: {
			getOrderDetail(){
				this.ajaxJson({
					url: '/api/v1/otcOrder/findByOrderId',
					data: {order_id: this.order_id},
					call: (data)=>{
						this.fotcOrder = data.data.fotcOrder
					}
				})
			}
		},
		created() {
			this.getOrderDetail()
		}
	}
</script>

<style scoped lang="scss">
	.recordDetail{
		.detailTit{
			margin: 20rpx 40rpx 0;
			.detailLft{
				display: flex;
				justify-content: flex-start;
				flex-direction: column;
				.lftTop{
					font-size: 28rpx;
					color: #fff;
				}
				.lftInfo{
					margin-top: 20rpx;
					font-size: 26rpx;
					color: #676869;
				}
			}
		}
		.fotcOrder{
			margin-top: 45rpx;
			padding: 0 34rpx;
			background-color: #303030;
			view{
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 65rpx;
				text{
				}
				.fotcLft{
					color: #676869;
					font-size: 26rpx;
				}
				.foctRgt{
					color: #fff;
					font-size: 28rpx;
				}
			}
		}
	}
</style>
