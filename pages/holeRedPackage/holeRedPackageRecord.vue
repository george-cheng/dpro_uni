<template>
	<view class="holeRedPackageRecord mainBox" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
		<view class="tractCon">
			<view class="enConList">
				<view class="enList" v-for="(item, index) in holeRedPackageList" :key="index">
					<view><text>领取时间</text><text>{{item.receive_time}}</text></view>
					<view><text>用户ID</text><text>{{item.uid}}</text></view>
					<view><text>领取数量</text><text>{{item.receive_amount}}</text></view>
					<view><text>领取后账户余额</text><text>{{item.wallet_total}}</text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { unimixin } from '../../utils/unimixin.js'
	export default {
		mixins: [unimixin],
		data(){
			return{
				holeRedPackageList: []
			}
		},
		onLoad() {

		},
		onReachBottom(){
			if(this.page>=this.pageNum){
				this.page = this.pageNum
			}else{
				this.page += 1
				this.getHoleRedPackageRecord()
			}
		},
		methods: {
			touchEnd(e){
				if(this.changeY > 50){
					this.page = 1
					this.holeRedPackageList = []
					this.getHoleRedPackageRecord()
					this.paddingTop = 0
				}
			},
			getHoleRedPackageRecord(){
				this.ajaxJson({
					url: '/api/v1/wormhole/receiveLog/list',
					data: {page: this.page,pageSize: this.pageSize},
					call: (data)=>{
						if(data.code == 200){
							this.pageTotal = data.data.total
							this.holeRedPackageList = [...this.holeRedPackageList, ...data.data.rows]
						}else{
							uni.showToast({
								image: '/static/images/wrong.png',
								title: data.msg
							})
						}
					}
				})
			}
		},
		created() {
			this.getHoleRedPackageRecord()
		}
	}
</script>

<style scoped lang="scss">
	.holeRedPackageRecord{
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
							color: #999;
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
