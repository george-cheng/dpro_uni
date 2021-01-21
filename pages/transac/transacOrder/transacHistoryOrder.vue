<template>
	<view class="historyOrder mainBox" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
		<view class="tractCon">
			<view class="enConList">
				<view class="enList" v-for="(item, index) in historyOrderList" :key="index">
					<view><text>币种类型</text><text>{{item.sellName}}</text></view>
					<view><text>委托时间</text><text>{{getLocalTime(item.time)}}</text></view>
					<view><text>类型</text><text>{{item.type == 0 ? '买入' : '卖出'}}</text></view>
					<view><text>委托价格</text><text>{{item.price}}</text></view>
					<view><text>委托数量</text><text>{{item.count}}</text></view>
					<view><text>成交额</text><text>{{item.amount}}</text></view>
					<view class="state">
						<text>状态</text>
						<text v-if="item.status == 1">未成交</text>
						<text v-if="item.status == 2">部分成交</text>
						<text v-if="item.status == 3">完全成交</text>
						<text v-if="item.status == 4">取消</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { unimixin } from '../../../utils/unimixin.js'
	export default {
		mixins: [unimixin],
		data(){
			return{
				symbol: '',
				historyOrderList: [],
			}
		},
		onLoad(options) {
			this.symbol = options.symbol
		},
		onReachBottom(){
			if(this.page>=this.pageNum){
				this.page = this.pageNum
			}else{
				this.page += 1
				this.getHistroyOrderList()
			}
		},
		methods: {
			touchEnd(e){
				if(this.changeY > 50){
					this.page = 1
					this.historyOrderList = []
					this.getHistroyOrderList()
					this.paddingTop = 0
				}
			},
			getHistroyOrderList(){
				let params = {
					id: this.symbol,
					page: this.page,
					pageSize: this.pageSize
				}
				this.ajaxJson({
					url: '/api/v1/account/history',
					method: 'POST',
					data: params,
					call: (data)=>{
						this.pageTotal = data.data.total
						this.historyOrderList = [...this.historyOrderList, ...data.data.rows]
					}
				})
			}
		},
		created() {
			this.getHistroyOrderList()
		}
	}
</script>

<style scoped lang="scss">
.historyOrder{
		position: relative;
		padding-bottom: 140rpx;
		.tractCon{
			.enConList{
				padding: 45rpx 30rpx 0;
				border-top: 2px solid #F2f2f2;
				.enList:last-child{
					border-bottom: none;
				}
				.enList{
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					border-bottom: 2px solid #f2f2f2;
					.state{
						display: flex;
						justify-content: space-between;
						flex-direction: row;
						align-items: center;
						width: 100%;
						margin-top: 0;
						text:nth-of-type(2){
							margin-top: 0;
							margin-right: 50rpx;
						}
					}
					view{
						display: flex;
						flex-wrap: wrap;
						flex-direction: column;
						margin-top: 25rpx;
						
						padding-bottom: 20rpx;
						text{
							font-size: 24rpx;
							white-space: nowrap;
						}
						text:nth-of-type(1){
							font-size: 26rpx;
							line-height: 26rpx;
							color: $c6;
						}
						text:nth-of-type(2){
							margin-top: 20rpx;
							font-size: 24rpx;
							line-height: 24rpx;
							color: $c3;
						}
					}
					view:nth-child(1){
						width: 270rpx;
					}
					view:nth-child(4){
						width: 270rpx;
					}
					view:nth-child(2){
						width: 260rpx;
					}
					view:nth-child(5){
						width: 260rpx;
					}
					view:nth-child(3){
						width: 140rpx;
					}
					view:nth-child(6){
						width: 140rpx;
					}
				}
			}
		}
	}
	
</style>
