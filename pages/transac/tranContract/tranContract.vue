<template>
	<view class="tranContract mainBox" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
		<view class="tractCon">
			<view class="enConList">
				<view class="enList" v-for="(item, index) in contractList" :key="index">
					<view><text>合约名称</text><text>{{item.name}}</text></view>
					<view><text>抢购币种名称</text><text>{{item.coin_name}}</text></view>
					<view><text>抢购标准</text><text>{{item.ded_amount}}</text></view>
					<view><text>总产量</text><text>{{item.ded_amount*item.out_mult}}</text></view>
					<view><text>释放周期</text><text>{{item.return_days}}</text></view>
					<view><text>开放时间</text><text>{{item.open_date}}</text></view>
					<view class="state"><text>状态</text><text :class="item.state === 0 ? 'close' : 'open'">{{item.state === 0 ? '关闭' : '开启'}}</text></view>
				</view>
			</view>
			
			<view class="tractBtn">
				<view @click="tranctBtnEvent(0)">抢1单</view>
				<view @click="tranctBtnEvent(1)">委托抢购</view>
				<view @click="tranctBtnEvent(2)">合约资产</view>
<!-- 				<view @click="tranctBtnEvent(3)">抢购收益</view>
				<view @click="tranctBtnEvent(4)">分享收益</view> -->
			</view>
			
		</view>
	</view>
</template>

<script>
	import {unimixin} from '../../../utils/unimixin.js'
	import { accMul, accAdd} from '../../../utils/common.js'
	export default {
		mixins: [unimixin],
		data(){
			return{
				contractList: [],
				flag: true,
				page: 1,
				pageSize: 10,
				pageNum: 0,
				pageTotal: 0,
				isFlag: true,
				
			}
		},
		onLoad() {

		},
		onReachBottom(){
			if(this.page>=this.pageNum){
				this.page = this.pageNum
			}else{
				this.page += 1
				this.getContractList()
			}
		},

		methods: {
			touchEnd(e){
				if(this.changeY > 50){
					this.page = 1
					this.getContractList()
					this.paddingTop = 0
				}
			},
	
			tranctBtnEvent(index){
				if(index === 0){
					this.rushPurchaseNowEvent()
				}else if(index === 1){
					this.isFlag = true
					let count = 0
					if(this.flag){
						this.flag = false
						clearInterval(timer)
						let timer = setInterval(()=>{
							count ++ 
							if(count >= 10){
								clearInterval(timer)
							}
							if(this.isFlag){
								this.rushPurchaseNowEvent()
							}
						}, 3000)
					}
				}else if(index === 2){
					uni.navigateTo({
						url: '/pages/transac/tranContract/tranAssets'
					})
				}

				
				/* else if(index === 3){
					uni.navigateTo({
						url: '/pages/transac/tranContract/tranAssetsFailPurchase'
					})
				}else if(index === 4){
					uni.navigateTo({
						url: '/pages/transac/tranContract/transAssetsShare'
					})
				} */
			},
			rushPurchaseNowEvent(){
				this.ajaxJson({
					url: '/api/v1/treatyType/buy',
					method: 'POST',
					call: (data)=>{
						if(data.code == 200){
							this.isFlag = true
							uni.showToast({
								title: data.msg
							})
						}else if(data.code == 500){
							this.isFlag = true
							uni.showToast({
								image: '/static/images/wrong.png',
								title: data.msg
							})
						} else{
							this.isFlag = false
							uni.showToast({
								image: '/static/images/wrong.png',
								title: data.msg
							})
						}
					}
				})
			},
			entrustEvent(){
			},
			getContractList(){
				this.ajaxJson({
					url: '/api/v1/treatyType/allList',
					data: {page: this.page, pageSize: this.pageSize },
					call: (data)=>{
						this.pageTotal = data.data.total
						this.contractList = []
						this.contractList = [...this.contractList, ...data.data.rows]
					}
				})
			},
		},
		created() {
			this.getContractList()
			let webView = this.$mp.page.$getAppWebview()
			webView.setTitleNViewButtonStyle(0,{  
				text: '\ue91d',  
			})
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
				margin: 0 60rpx;
				padding: 5rpx 12rpx;
				border-radius: 4rpx;
				white-space: nowrap;
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
