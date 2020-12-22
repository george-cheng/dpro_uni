<template>
	<view class="orderRecord mainBox">
		<view class="orderScreen" @click="showDrawer" v-if="false">筛选</view>
		<view v-for="(item, index) in orderList" :key="index" @click="orderDetail(item)" v-if="isOrderList">
			<view>
				<view class="orderTop">
					<view class="topLft">
						<text class="ftransType">{{item.order_type === 1 ? '买入' : '卖出'}}</text>
						<text class="fvShortName">USDT</text>
					</view>
					<view class="topRgt">
						<text v-if="item.order_status == 1" class="i-rgtArrowAfter">确认下单</text>
						<text v-if="item.order_status == 2" class="i-rgtArrowAfter">确认已付款</text>
						<text v-if="item.order_status == 3" class="i-rgtArrowAfter">确认已收款</text>
						<text v-if="item.order_status == 4" class="i-rgtArrowAfter">已撤销</text>
					</view>
				</view>
				
				<view class="orderCon">
					<view class="price">
						<text>{{item.price}}</text>
						<text>单价(USDT)</text>
					</view>
					<view class="price">
						<text>{{item.amount}}</text>
						<text>数量(USDT)</text>
					</view>
					<view class="price">
						<text>{{item.total}}</text>
						<text>总额(USDT)</text>
					</view>
				</view>
				<view class="orderConMid">
					<view class="price">
						<text>时间：{{item.place_time}}</text>
					</view>
					<view class="price">
						<text>订单号：{{item.order_id}}</text>
					</view>
				</view>
			</view>
		</view>
		<uni-drawer ref="uniDrawer" mode="right">
		    <view style="padding:30rpx;">
					<view>
						<view class="drawerTit">订单类型</view>
						<view class="drawerList">
						<view :class="{choice: choiceTypeOn == index}" v-for="(item, index) in typeList" :key="item.type" @click="drawerChoiceEvent(0, index, item)">{{item.name}}</view>
						</view>
					</view>
					<view style="margin-top: 20rpx;">
						<view class="drawerTit">订单状态</view>
						<view class="drawerList">
							<view :class="{choice: choiceOn == index}" v-for="(item, index) in statusList" :key="item.status"  @click="drawerChoiceEvent(1, index, item)">{{item.name}}</view>
						</view>
					</view>
		    </view>
				<view class="drawerBtn">
					<view @click="drawerReset">重置</view>
					<view @click="drawerConfirm">确认</view>
				</view>
		</uni-drawer>
	</view>
</template>

<script>
	import uniDrawer from '../../components/uni-drawer/uni-drawer.vue'
	export default {
		components: { uniDrawer },
		data(){
			return{
				fuld: '',
				choiceOn: 0,
				choiceTypeOn: 0,
				type: 1,
				status: 1,
				isOrderList: false,
				orderList: [],
				typeList: [{type: '1', name: '买入'},{type: '2', name: '卖出'}],
				statusList: [{status: '1',name: '确认下单'},{status: '2',name: '确认付款'},{status: '3',name: '确认收款'},{status: '4',name: '已撤销'}],
				page: 1,
				pageSize: 10,
				pageNum: 0,
				pageTotal: 0,
				
				orderStatus: ''
			}
		},
		onLoad() {

		},
		onReachBottom(){
			this.pageNum = Math.ceil( this.pageTotal / this.pageSize)
			if(this.page>=this.pageNum){
				this.page = this.pageNum
			}else{
				this.page += 1
				this.getOrderList()
			}
		},
		methods: {
			orderDetail(item){
				uni.navigateTo({
					url: '/pages/transac/tranLegal/tranLegOrderToPay?orderId=' + item.order_id + '&orderStatus=' + item.order_status
				})
			},
			drawerReset(){
				this.choiceTypeOn = 0
				this.type = 1
				this.choiceOn = 0
				this.status = 1
				this.setStorage()
				this.getOrderList()
				this.$refs.uniDrawer.close()
			},
			drawerConfirm(){
				this.setStorage()
				this.$refs.uniDrawer.close()
				this.getOrderList()
			},
			setStorage(){
				let drawer = {
					type: this.choiceTypeOn,
					status: this.choiceOn,
				}
				uni.setStorage({
					key: 'drawer',
					data: drawer,
					success: () => {
						
					}
				})
			},
			getStorage(){
				uni.getStorage({
					key: 'drawer',
					success: (res)=>{
						this.choiceTypeOn = res.data.type,
						this.choiceOn = res.data.status
						this.type = res.data.type 
						this.status = res.data.status 
					}
				})
			},
			drawerChoiceEvent(category, index, item){
				if(category == 0){
					this.type = item.type
					this.choiceTypeOn = index
				}else{
					this.status = item.status
					this.choiceOn = index
				}	
			},
			showDrawer(){
				this.getStorage()
				this.$refs.uniDrawer.open()
			},
			getOrderList(){
				this.getStorage()
				let params = {
					// status: parseInt(this.status) + 1,
					// type:  parseInt(this.type) + 1,
					
					page: this.page, 
					pageSize: this.pageSize
				}
				this.ajaxJson({
					url: '/api/v1/otcOrder/userOrderList',
					data: params,
					call: (data)=>{
						if(data.code == 200){
							this.isOrderList = true
							this.pageTotal = data.data.total
							this.orderList = [...this.orderList, ...data.data.rows]
						}else{
							this.isOrderList = false
							uni.showToast({
								image: '../../static/images/wrong.png',
								title: '当前无订单记录'
							})
						}
					}
				})
			},
		},
		created() {
			this.getOrderList()
		}
	}
</script>

<style scoped lang="scss">
	.orderScreen{
		padding: 0 !important;
		margin-bottom: 20rpx !important;
		margin-right: 20rpx;
		color: #fff;
		font-size: 28rpx;
		display: flex;
		justify-content: flex-end;
		margin-top: 20rpx;
		background-color: transparent !important;
	}
	.orderRecord>view{
		background-color: #303030;
		padding: 0 30rpx;
		margin-bottom: 30rpx;
		.orderTop{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding-top: 38rpx;
			.topLft{
				.ftransType{
					color: #BD3A3B;
					font-size: 28rpx;
					margin-right: 10rpx;
				}
				.fvShortName{
					color: #fff;
					font-size: 28rpx;
					margin-right: 24rpx;
				}
				.ftransTime{
					color: #676869;
					font-size: 22rpx;
				}
			}
			.topRgt{
				color: #BD3A3B;
			}
		}
		.orderConMid{
			margin: rpx 0;
			padding-bottom: 20rpx;
			display: flex;
			justify-content: space-between;
			color: #fff;
			font-size: 26rpx;
		}
		.orderCon{
			margin-top: 20rpx;
			padding-bottom: 30rpx;
			display: flex;
			justify-content: space-between;
			view{
				display: flex;
				flex-direction: column;
				text-align: center;
				text:nth-of-type(1){
					color: #fff;
					font-size: 28rpx;
				}
				text:nth-of-type(2){
					color: #676869;
					font-size: 22rpx;
				}
			}
		}
	}

	.drawerTit{
		color: #5E606C;
	}
	.drawerList{
		display: flex;
		flex-wrap: wrap;
		view{
			border: 1px solid #303030;
			padding: 5rpx 15rpx;
			margin-top: 10rpx;
			margin-right: 15rpx;
			border-radius: 4rpx;
			white-space: nowrap;
			color: #fff !important;
		}
		view.choice{
			background-color: #303030;
			border: 1px solid #BD3A3B;
		}
	}
	.drawerBtn{
		width: 100%;
		position: absolute;
		bottom: 50rpx;
		display: flex;
		justify-content: center;
		view{
			border: 1px solid #fff;
			border-radius: 10rpx;
			margin: 0 30rpx;
			padding: 15rpx 32rpx;
			color: #fff;
		}
		view:nth-of-type(2){
			border: 1px solid #BD3A3B;
			background-color: #BD3A3B;
			color: #fff;
		}
	}
</style>
