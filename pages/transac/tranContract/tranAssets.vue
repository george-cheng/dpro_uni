<template>
	<view class="tranContract mainBox" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
		<view class="tractCon">
			<view class="enConList">
				<view class="enList" v-for="(item, index) in recordList" :key="index" @click="tranAssetsEvent(item)">
					<view><text>合约名称</text><text>{{item.treaty_name}}</text></view>
					<view><text>抢购标准</text><text>{{item.ded_amount}}</text></view>
					<view><text>总产量</text><text>{{item.ded_amount * item.out_mult}}</text></view>
					<view><text>剩余天数</text><text>{{item.return_days}} 天</text></view>
					<view><text>抢购时间</text><text>{{item.purch_date}}</text></view>
					<view><text>抢购状态</text><text :class="item.purch_state === 0 ? 'close' : 'open'">{{item.purch_state === 0 ? '失败' : '成功'}}</text></view>
					<view class="state"><text>激活状态</text><text @click.stop="deactivaEvent(item)" :class="item.activate_state === 0 ? 'close' : 'open'">{{item.activate_state === 1 ? '已激活' : '去激活'}}</text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { unimixin } from '@/utils/unimixin.js'
	export default {
		mixins: [unimixin],
		data(){
			return{
				recordList: [],
			}
		},
		onReachBottom(){
			this.pageNum = Math.ceil( this.pageTotal / this.pageSize)
			if(this.page>=this.pageNum){
				this.page = this.pageNum
			}else{
				this.page += 1
				this.getRecordList()
			}
		},
		methods: {
			
			touchEnd(e){
				if(this.changeY > 50){
					this.paddingTop = 0
					this.recordList = []
					this.getRecordList()
				}
			},
			
			deactivaEvent(item){
				if(item.activate_state === 0){
					this.ajaxJson({
						url: '/api/v1/purchTreatyLog/active',
						data: { id: item.id },
						method: 'POST',
						call: (data)=>{
							if(data.code == 200){
								uni.showToast({
									title: data.msg,
									success: () => {
										this.recordList = []
										this.getRecordList()
									}
								})
							}else{
								uni.showToast({
									image: '../../../static/images/wrong.png',
									title: data.msg
								})
							}
						}
					})
				}
			},
			tranAssetsEvent(item){
				uni.navigateTo({
					url: '/pages/transac/tranContract/tranAssetsDetail?id=' + item.id
				})
			},
			getRecordList(){
				let params = {}
				this.ajaxJson({
					url: '/api/v1/purchTreatyLog/list',
					data: { purchState: 1, page: this.page, pageSize: this.pageSize},
					call: (res)=>{
						this.pageTotal = res.data.total
						this.recordList = [...this.recordList, ...res.data.rows]
					}
				})
			}
		},
		created() {
			this.getRecordList()
		}
	}
</script>

<style scoped lang="scss">
	.tranContract{
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
							margin-right: 70rpx;
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
	
	
	.close{
	  color: #f00 !important;
	}
	.open{
	  color: #ccc !important;
	}
	
</style>
