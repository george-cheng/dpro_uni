<template>
	<view class="tranAssetsFailPurchase mainBox" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
		<view class="tractCon">
			<view class="enConList">
				<view class="enList" @click="tranAssetsFailEvent(item)" v-for="(item, index) in tranAssetsFailList" :key="index">
					<view><text>合约名称</text><text>{{item.treaty_name}}</text></view>
					<view><text>抢购标准</text><text>{{item.ded_amount}}</text></view>
					<view><text>纯收益</text><text>{{item.reward_amount}}</text></view>
					<view><text>进入虫洞</text><text>{{item.destroy_amount}}</text></view>
					<view><text>抢购时间</text><text>{{item.purch_time}}</text></view>
					<view><text></text><text></text></view> <!-- 此行占位 -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {unimixin} from '../../../utils/unimixin.js'
	export default {
		mixins: [unimixin],
		data(){
			return{
				tranAssetsFailList: [],
				isFresh: false
			}
		},
		onLoad() {

		},
		onReachBottom(){
			if(this.page>=this.pageNum){
				this.page = this.pageNum
			}else{
				this.page += 1
				this.getTranAssetsFailPurchase()
			}
		},
		methods: {
			touchEnd(e){
				if(this.changeY > 50){
					this.page = 1
					this.tranAssetsFailList = []
					this.getTranAssetsFailPurchase()
					this.paddingTop = 0
				}
			},
			getTranAssetsFailPurchase(){
				this.ajaxJson({
					url: '/api/v1/purchTreatyFailLog/list',
					data: {page: this.page, pageSize: this.pageSize },
					call: (data)=>{
						if(data.code == 200){
							this.pageTotal = data.data.total
							this.tranAssetsFailList = [...this.tranAssetsFailList, ...data.data.rows]
						}else{
							uni.showToast({
								image: '../../../static/images/wrong.png',
								title: data.msg
							})
						}
					}
				})
			},
			tranAssetsFailEvent(item){
				uni.navigateTo({
					url: '/pages/transac/tranContract/tranAssetsFailPurchaseDetail?id=' + item.id
				})
			}
		},
		created() {
			this.getTranAssetsFailPurchase()
		}
	}
</script>

<style scoped lang="scss">
	.tranAssetsFailPurchase{
		position: relative;
		padding-bottom: 140rpx;
		.tractCon{
			.enConList{
				padding: 45rpx 30rpx 0;
				border-top: 2px solid #f2f2f2;
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
							margin-right: 90rpx;
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
			.tractBtn{
				position: fixed;
				z-index: 9;
				bottom: 120rpx;
				display: flex;
				justify-content: space-between;
				width: 100%;
				font-size: 20rpx;
				view{
					background-color: #BD3A3B;
					color: #fff;
					display: flex;
					flex-wrap: nowrap;
					font-size: 26rpx;
					margin: 0 14rpx;
					padding: 5rpx 12rpx;
					border-radius: 4rpx;
				}
			}
		}
		
		.close{
		  color: #f00 !important;
		}
		.open{
		  color: #ccc !important;
		}
	}
</style>
