<template>
	<view class="assTranOrder mainBox" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
		<view class="tractCon">
			<view class="enConList">
				<view class="enList" v-for="(item, index) in assTranOrderList" :key="index">
					<view><text>转账时间</text><text>{{item.transfer_time}}</text></view>
					<view><text>币种名称</text><text>{{item.coin_name}}</text></view>
					<view><text>手续费</text><text>{{item.fee}} {{item.coin_name}}</text></view>
					<view><text>转账数量</text><text>{{item.transfer_amount}} {{item.coin_name}}</text></view>
					<view><text>对方账户UID</text><text>{{item.transfer_uid}}</text></view>
					<view></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { unimixin } from '../../../utils/unimixin.js'
	export default {
		mixins: [ unimixin ],
		data(){
			return{
				coin_id: '',
				assTranOrderList: []
			}
		},
		onLoad(options) {
			this.coin_id = options.coinId
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
					this.assTranOrderList = []
					this.getAssTranAccList()
					this.paddingTop = 0
				}
			},
			getAssTranAccList(){
				this.ajaxJson({
					url: '/api/v1/forwardLog/list',
					data: {coin_id: this.coin_id, page: this.page, pageSize: this.pageSize},
					call: (data)=>{
						this.pageTotal = data.data.total
						this.assTranOrderList = [...this.assTranOrderList, ...data.data.rows]
					}
				})
			}
		},
		created() {
			this.getAssTranAccList()
		}
	}
</script>

<style scoped lang="scss">
	.assTranOrder{
		position: relative;
		padding-bottom: 140rpx;
		.tractCon{
			.enConList{
				padding: 45rpx 30rpx 0;
				border-top: 2px solid #303030;
				.enList:last-child{
					border-bottom: none;
				}
				.enList{
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					border-bottom: 2px solid #303030;
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
							color: #676869;
						}
						text:nth-of-type(2){
							margin-top: 20rpx;
							font-size: 24rpx;
							line-height: 24rpx;
							color: #fff;
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
