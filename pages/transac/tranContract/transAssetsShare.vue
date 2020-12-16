<template>
	<view class="transAssetsShare mainBox">
		<view class="tractCon">
			<view class="enConList">
				<view class="enList" v-for="(item, index) in tranAssetsShareList" :key="item.id">
					<view><text>下级用户ID</text><text>{{item.uid}}</text></view>
					<view><text>抢购次数</text><text>{{item.purchTimes}}</text></view>
					<view><text>释放收益</text><text>{{item.releaseProfit}}</text></view>
					<view><text>抢购收益</text><text>{{item.purchProfit}}</text></view>
					<view><text>时间</text><text>{{localTime}}</text></view>
					<view><text></text><text></text></view> <!-- 此行占位 -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				tranAssetsShareList: [],
				localTime: '',
				page: 1,
				pageSize: 10,
				pageNum: 0,
				pageTotal: 0
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
				this.getTranAssetsShare()
			}
		},
		methods: {
			getTranAssetsShare(){
				this.ajaxJson({
					url: '/api/v1/suborTreatyProfit',
					data: {page: this.page, pageSize: this.pageSize },
					call: (data)=>{
						if(data.code == 200){
							this.pageTotal = data.data.total
							this.tranAssetsShareList = [...this.tranAssetsShareList, ...data.data.rows]
						}else{
							uni.showToast({
								image: '../../../static/images/wrong.png',
								title: data.msg
							})
						}
					}
				})
			},
			getLocalTmie(){
				let now = new Date();
				let year = now.getFullYear();
				let month = (now.getMonth() + 1).toString().padStart(2 ,0);
				let date = now.getDate().toString().padStart(2 ,0);
				this.localTime = year + '-' + month + '-' + date
			},
		},
		created() {
			this.getTranAssetsShare()
			this.getLocalTmie()
		}
	}
</script>

<style scoped lang="scss">
	.transAssetsShare{
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
