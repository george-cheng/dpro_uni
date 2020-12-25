<template>
	<view class="orderRecord mainBox" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
		<view class="orderScreen" @click="showDrawer" v-if="false">筛选</view>

		<view v-for="(item, index) in orderList" :key="item.order_id" v-if="isOrderList">
			<view>
				<view class="orderTop">
					<view class="topLft">
						<text class="fvShortName">{{item.coin_name}}</text>
					</view>
				</view>
				<view class="orderCon">
					<view class="price">
						<text>{{item.amount}}</text>
						<text>划转数量</text>
					</view>
					<view class="price">
						<text>{{item.type == '1' ? '资金到法币' : '法币到资金'}}</text>
						<text>类型</text>
					</view>
					<view class="price">
						<text>{{getLocalTime(item.time)}}</text>
						<text>时间</text>
					</view>
				</view>
			</view>
		</view>

		<uni-drawer ref="uniDrawer" mode="right">
			<view style="padding:30rpx;">
				<view>
					<view class="drawerTit">划转类型</view>
					<view class="drawerList">
						<view :class="{choice: choiceTypeOn == index}" v-for="(item, index) in typeList" :key="item.type" @click="drawerChoiceEvent(index, item)">{{item.name}}</view>
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
	import {unimixin} from '../../utils/unimixin.js'
	export default {
		components: {uniDrawer},
		mixins: [unimixin],
		data() {
			return {
				choiceTypeOn: 1,
				type: 1,
				isOrderList: false,
				orderList: [],
				typeList: [{type: '1', name: '资金到法币'},{type: '2', name: '法币到资金'}],
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
			
			touchEnd(e){
				if(this.changeY > 50){
					this.page = 1
					this.orderList = []
					this.getOrderList()
					this.paddingTop = 0
				}
			},
			
			
			drawerReset(){
				this.choiceTypeOn = 0
				this.type = 1
				this.setTranStorage()
				this.getOrderList()
				this.$refs.uniDrawer.close()
			},
			drawerConfirm(){
				this.setTranStorage()
				this.$refs.uniDrawer.close()
				this.getOrderList()
			},
			drawerChoiceEvent( index, item){
				this.type = item.type
				this.choiceTypeOn = index
			},
			showDrawer() {
				this.getTranStorage()
				this.$refs.uniDrawer.open()
			},
			setTranStorage(){
				let drawerTran = {
					type: this.choiceTypeOn,
				}
				uni.setStorage({
					key: 'drawerTran',
					data: drawerTran,
					success: () => {
						
					}
				})
			},
			getTranStorage() {
				uni.getStorage({
					key: 'drawerTran',
					success: (res) => {
						this.choiceTypeOn = res.data.type,
						this.type = res.data.type
					}
				})
			},
			getOrderList(){
				this.getTranStorage()
				let params = {
					fvid: '50',
					// type: parseInt(this.type) + 1 ,
					page: this.page,
					pageSize: this.pageSize
				}
				this.ajaxJson({
					url: '/api/v1/transfer/logList',
					data: params,
					call: (data)=>{
						if(data.code == 200){
							if(data.data.rows){
								this.pageTotal = data.data.total
								this.orderList = [...this.orderList, ...data.data.rows]
								this.isOrderList = true
							}
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
	.orderScreen {
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
					color: #BD3A3B;
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
		.orderCon{
			margin-top: 40rpx;
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
					margin-top: 30rpx;
				}
			}
		}
	}

	.drawerTit {
		color: #5E606C;
	}
	.drawerList {
		display: flex;
		flex-wrap: wrap;

		view {
			border: 1px solid #303030;
			padding: 5rpx 15rpx;
			margin-top: 10rpx;
			margin-right: 15rpx;
			border-radius: 4rpx;
			white-space: nowrap;
			color: #fff !important;
		}
		view.choice {
			background-color: #303030;
			border: 1px solid #BD3A3B;
		}
	}
	.drawerBtn {
		width: 100%;
		position: absolute;
		bottom: 50rpx;
		display: flex;
		justify-content: center;
		view {
			border: 1px solid #fff;
			border-radius: 10rpx;
			margin: 0 30rpx;
			padding: 15rpx 32rpx;
			color: #fff;
		}
		view:nth-of-type(2) {
			border: 1px solid #BD3A3B;
			background-color: #BD3A3B;
			color: #fff;
		}
	}
</style>
