<template>
	<view class="assRecord mainBox">
		<view class="assRecordSwitch">
			<view :class="{'choice': choiceOn == 0}" @click="switchEvent(0)">充值记录</view>
			<view :class="{'choice': choiceOn != 0}" @click="switchEvent(1)">提币记录</view>
		</view>
		<view class="assRecordTit">
			<view>币种</view>
			<view>时间</view>
			<view>金额</view>
		</view>
		<view class="assRecordList">
			<view v-for="(item, index) in assRecordList" :key="index">
				<view class="kind">{{item.name}}</view>
				<view class="time">getLocalTime(1590044400)</view>
				<view class="money">{{item.amount}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getLocalTime } from '../../utils/common.js'
	export default {
		data(){
			return{
				category: '',
				symbol: '',
				choiceOn: -1,
				recordList: '',
				assRecordList: [],
				page: 1,
				pageSize: 10,
				pageNum: 0,
				pageTotal: 0
			}
		},
		onLoad(options) {
			this.category = options.category
			this.choiceOn = this.category
			this.symbol = options.id
			if(this.category == 0){
				uni.setNavigationBarTitle({
						title: '充值记录',
						success: () => {
						}
				});
			}else{
				uni.setNavigationBarTitle({
						title: '提币记录',
						success: () => {
						}
				});
			}
		},
		onReachBottom(){
			this.pageNum = Math.ceil( this.pageTotal / this.pageSize)
			if(this.page>=this.pageNum){
				this.page = this.pageNum
			}else{
				this.page += 1
				this.getAssRecord()
			}
		},
		methods: {
			switchEvent(index){
				this.choiceOn = index
				if(this.choiceOn == 0){
					uni.setNavigationBarTitle({
							title: '充值记录',
							success: () => {
								this.getAssRecord()
							}
					});
				}else{
					uni.setNavigationBarTitle({
							title: '提币记录',
							success: () => {
								this.getAssRecord()
							}
					});
				}
			},
			getAssRecord(){
				let params = {
					symbol: this.symbol,
					page: this.page, 
					pageSize: this.pageSize
				}
				let url = '/api/v1/account/coinIn'
				if(this.choiceOn == 1){
					url = '/api/v1/account/coinOut'
				}
				this.ajaxJson({
					url: url,
					data: params,
					method: "POST",
					call: (res)=>{
						this.pageTotal = res.data.total
						this.assRecordList = [...this.assRecordList, ...res.data.rows]
					}
				})
			},
		},
		created() {
			this.getAssRecord()
		}
	}
</script>

<style scoped lang="scss">
	.assRecord{
		.assRecordSwitch{
			display: flex;
			justify-content: center;
			view{
				margin: 0 26rpx;
				font-size: 30rpx;
				color: #676869;
				line-height: 68rpx;
			}
			view.choice{
				position: relative;
				color: #BD3A3B;
			}
			view.choice:after{
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 5rpx;
				background-color: #BD3A3B;
			}
		}
		.assRecordTit{
			padding: 0 63rpx;
			display: flex;
			justify-content: space-between;
			background-color: #1C1C1C;
			view{
				line-height: 90rpx;
				color: #676869;
				font-size: 28rpx;
			}
		}
		.assRecordList{
			view{
				display: flex;
				justify-content: space-between;
				border-bottom: 1px solid #383838;
				view{
					padding: 0 56rpx;
					height: 90rpx;
					display: flex;
					align-items: center;
					color: #fff;
					font-size: 26rpx;
				}
				.time{
					margin-left: 40rpx;
				}
				.money{
					font-size: 30rpx;
					color: #BD3A3B;
				}
			}
			view:last-child{
				
			}
		}
	}
</style>
