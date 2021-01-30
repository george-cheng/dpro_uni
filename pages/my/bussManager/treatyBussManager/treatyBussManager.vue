<template>
	<view class="treatyBussManager mainBox" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
		<view class="switchState">
			<view :class="{switchChoice: switchOn == index }" @click="switchEvent(item, index)" v-for="(item, index) in switchState" :key="index">{{item}}</view>
		</view>
		
		<view class="recordArea">
			<view v-for="(item, index) in treatyInfo" :key="index">
				<view class="flexArea">
					<view class="areaLft">
						<view class="areaName">{{item.region_type == '1' ? '平台区' : '商家区'}}</view>
						<view class="areaImg">
							<image :src="url + item.desc_diagram" mode="aspectFit"></image>
						</view>
					</view>
					<view class="areaMid">
						<view class="name">{{item.name}}</view>
						<view class="itemName">{{item.item_type == '1' ? '虚拟物品' : '实体物品'}}</view>
						<view class="totalPrice">总价：¥ {{item.price}} USDT</view>
						<view class="time">{{item.cash_time}}</view>
					</view>
				</view>
				<view class="areaRgt">
					<view class="state" v-if="item.state == 1">待审核</view>
					<view class="state" v-if="item.state == 2">上架中</view>
					<view class="state" v-if="item.state == 3">未通过审核</view>
					<view class="state" v-if="item.state == 4">已下架</view>
					
					<view class="price">¥ {{item.price}} USDT</view>
					<view class="amount">X1</view>
					
					<view class="shopState" @click.stop="offShelfShop(item)" v-if="item.state == 2">下架</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { unimixin } from '../../../../utils/unimixin.js'
	export default {
		mixins: [ unimixin ],
		data(){
			return{
				switchState: ['全部订单','待审核','上架中','未通过审核','已下架'],
				switchOn: '0',
				treatyInfo: []
			}
		},
		onLoad() {

		},
		onNavigationBarButtonTap(e){
			if(e.float == 'left'){
				uni.reLaunch({
					url: '/pages/my/bussManager/bussManagerSetting',
					success: () => {}
				})
			}else{
				uni.reLaunch({
					url: '/pages/my/bussManager/treatyBussManager/treatyBussManagerOrder',
					success: () => {}
				})
			}
		},
		onReachBottom(){
			if(this.page>=this.pageNum){
				this.page = this.pageNum
			}else{
				this.page += 1
				this.getTreatyInfo()
			}
		},
		methods: {
			touchEnd(e){
				if(this.changeY > 50){
					this.page = 1
					this.treatyInfo = []
					this.getTreatyInfo()
					this.paddingTop = 0
				}
			},
			getTreatyInfo(){
				let params = {}
				if(this.switchOn == 0){
					params = {
						page: '1',
						pageSize: '10'
					}
				}else{
					params = {
						state: this.switchOn,
						page: '1',
						pageSize: '10'
					}
				}
				this.ajaxJson({
					url: '/api/v1/treatyCashGoods/businessCashGoods',
					data: params,
					call: (data)=>{
						if(data.code == 200){
							this.pageTotal = data.data.total
							this.treatyInfo = []
							this.treatyInfo = [ ...this.treatyInfo, ...data.data.rows ]
						}else{
							this.treatyInfo = []
						}
					}
				})
			},
			offShelfShop(item){
				this.ajaxJson({
					url: '/api/v1/treatyCashGoods/businessRevoke',
					method: 'POST',
					data: { gid: item.gid },
					call: (data)=>{
						if(data.code == 200){
							uni.showToast({
								icon: 'none',
								title: data.msg,
								success: () => {
									this.getTreatyInfo()
								}
							})
						}else{
							uni.showToast({
								image: '/static/images/wrong.png',
								title: data.msg,
								success: () => {}
							})
						}
					}
				})
			},
			// mallDetailEvent(item){
			// 	uni.reLaunch({
			// 		url: '/pages/my/bussManager/treatyBussManager/treatyBussManagerDetail?category=1&id=' + item.id,
			// 		success: () => {}
			// 	})
			// },
			switchEvent(item, index){
				this.switchOn = index
				this.getTreatyInfo()
			},
		},
		created() {
			this.getTreatyInfo()
		}
	}
</script>

<style scoped lang="scss">
	.treatyBussManager{
		.switchState{
			margin: 0 52rpx;
			display: flex;
			view{
				margin-right: 38rpx;
				font-size: 28rpx;
				white-space: nowrap;
			}
			.switchChoice{
				position: relative;
				color: #b8393c;
			}
			.switchChoice::after{
				content: '';
				position: absolute;
				left: 0;
				top: 50rpx;
				width: 100%;
				height: 4rpx;
				background-color: #b8393c;
				border-radius: 2rpx;
			}
		}
		.recordArea{
			// display: flex;
			// justify-content: space-between;
			margin-top: 30rpx;
		}
		.recordArea>view{
			background-color: #f7f7f7;
			display: flex;
			justify-content: space-between;
			padding: 30rpx 30rpx;
			.flexArea{
				display: flex;
				.areaLft{
					display: flex;
					flex-direction: column;
					.areaName{
						color: #b8393c;
					}
					.areaImg{
						margin-top: 25rpx;
						width: 158rpx;
						height: 158rpx;
						background-color: #fff;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					image{
						width: 80%;
						height: 80%;
					}
				}
				.areaMid{
					margin-left: 30rpx;
					.name{
						font-size: 30rpx;
						line-height: 30rpx;
						color: $c3;
					}
					.itemName{
						margin-top: 20rpx;
						font-size: 26rpx;
						line-height: 26rpx;
						color: $c6;
					}
					.totalPrice{
						margin-top: 50rpx;
						font-size: 28rpx;
						line-height: 28rpx;
						color: $c9;
					}
					.time{
						margin-top: 30rpx;
						color: $c6;
						font-size: 24rpx;
						line-height: 24rpx;
					}
				}
			}
			.areaRgt{
				margin-right: 0;
				.state{
					color: #b8393c;
					font-size: 24rpx;
					line-height: 24rpx;
				}
				.price{
					margin-top: 30rpx;
					color: $c6;
					font-size: 22rpx;
				}
				.amount{
					margin-top: 20rpx;
					color: $c9;
					font-size: 28rpx;
					line-height: 28rpx;
				}
				.shopState{
					margin-top: 38rpx;
					padding: 12rpx 0;
					border: 1px solid #b8393c;
					border-radius: 24rpx;
					text-align: center;
					font-size: 24rpx;
					line-height: 24rpx;
					color: #b8393c;
				}
			}
		}
	}
</style>
