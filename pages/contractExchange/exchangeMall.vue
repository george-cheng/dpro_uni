<template>
	<view class="exchangeMall mainBox" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
		<swiper indicator-dots circular autoplay interval="3000">
			<swiper-item v-for="item in swipers" :key="item.id">
				<image :src="url + item.image_url"></image>
			</swiper-item>
		</swiper>
		<view class="switchBtn">
			<view class="" :class="{'platformArea': switchOn != 1}" @click="platformAreaEvent()">平台区</view>
			<view class="" :class="{'bussArea': switchOn == 1}" @click="bussAreaEvent()">商家区</view>
		</view>
		<view class="operaArea">
			<view class="searchArea">
				<view class="searchIcon i-search"></view>
				<input type="text" v-model="name" placeholder="IPFS服务器" confirm-type="search" @confirm="searchEvent()">
			</view>
			<!-- <view class="add i-plus" @click="addGoodEvent()" v-if="isAdd"></view> -->
		</view>
		<view class="goodsList">
			<view v-for="(item, index) in goodList" :key="index" @click="goodListDetailEvent(item)">
				<view class="lftImg">
					<image :src="url + item.desc_diagram" mode="aspectFit"></image>
				</view>
				<view class="rgtInfo">
					<view class="infoName">{{item.name}}</view>
					<view class="infoRemarks">{{item.remarks}}</view>
					<view class="infoMoney">{{item.price}} USDT</view>
					<view class="infoBtn">兑换</view>
				</view>
			</view>
		</view>
		
		<view class="add i-plus" @click="addGoodEvent()" v-if="isAdd"></view>
		
		
	</view>
</template>

<script>
	import { unimixin } from '../../utils/unimixin.js'
	export default {
		mixins: [ unimixin ],
		data(){
			return{
				swipers: [],
				switchOn: 0,
				regionType: '1',
				name: '',
				isAdd: false,
				goodList: []
			}
		},
		onLoad(options) {
			if(uni.getStorageSync('regionType')){
				this.regionType = uni.getStorageSync('regionType')
			}
			if(uni.getStorageSync('switchOn')){
				this.switchOn = uni.getStorageSync('switchOn')
			}
			if(options.switchOn){
				this.switchOn = options.switchOn
			}
			if(options.regionType){
				this.regionType = options.regionType
			}
			if(this.regionType == 2){
				this.isAdd = true
			}else{
				this.isAdd = false
			}
		},
		onNavigationBarButtonTap(e) {
			if(e.float == 'left') {
				uni.reLaunch({
					url: '/pages/index/index',
					success: () => {}
				})
			}else{
				uni.reLaunch({
					url: '/pages/contractExchange/exchangeMallRecord',
					success: () => {}
				})
			}
		},
		onReachBottom() {
			
			if(this.page >= this.pageNum){
				this.page = this.pageNum
				console.log(1111)
			}else{
				this.page += 1
				this.getGoodList()
			}
		},
		methods: {
			touchEnd(e){
				if(this.changeY > 50){
					this.initSwipersImg()
					this.getGoodList()
					this.paddingTop = 0
				}
			},
			addGoodEvent(){
				uni.reLaunch({
					url: '/pages/contractExchange/addShopGood',
					success: () => {}
				})
			},
			goodListDetailEvent(item){
				uni.setStorageSync('regionType', this.regionType)
				uni.setStorageSync('switchOn', this.switchOn)
				uni.reLaunch({
					url: '/pages/contractExchange/goodsDetail?gid=' + item.gid ,
					success: () => {}
				})
			},
			platformAreaEvent(){
				this.switchOn = 0
				this.regionType = '1'
				this.getGoodList()
				this.isAdd = false
			},
			bussAreaEvent(){
				this.switchOn = 1
				this.regionType = '2'
				this.getGoodList()
				this.isAdd = true
			},
			getGoodList(){
				this.ajaxJson({
					url: '/api/v1/treatyCashGoods/list',
					data: { page: this.page, pageSize: this.pageSize, regionType: this.regionType },
					call: (data)=>{
						if(data.code == 200){
							this.pageTotal = data.data.total
							this.goodList = [...this.goodList, ...data.data.rows]
						}else{
							this.goodList = []
						}
					}
				})
			},
			initSwipersImg(){
				this.ajaxJson({
					url: '/api/v1/config/banner',
					data: {via: 'treaty_shop'},
					call: (res)=>{
						this.swipers = res.data
					}
				})
			},
			searchEvent(){
				this.ajaxJson({
					url: '/api/v1/treatyCashGoods/list',
					data: { page: '1', pageSize: '10', regionType: this.regionType, name: this.name},
					call: (data)=>{
						if(data.code == 200){
							this.goodList = data.data.rows
						}else{
							uni.showToast({
								icon: 'none',
								title: '未查询到商品'
							})
						}
					}
				})
			}
		},
		created() {
			this.initSwipersImg()
			this.getGoodList()
		}
	}
</script>

<style scoped lang="scss">
	.add{
		position: fixed;
		bottom: 150rpx;
		right: 30rpx;
	}
	.add::before{
		font-size: 70rpx;
		color: #b8393c;
	}
	.exchangeMall{
		
		swiper {
			width: 690rpx;
			height: 350rpx;
			margin: 0 30rpx;
			image {
				border-radius: 18rpx;
				width: 100%;
				height: 100%;
			}
		}
		.limitp-hg {
			width: 100%;
			height: 60rpx;
			line-height: 60rpx;
			color: $c3;
			background-color: #fff;
			.scrool-list-item {
				font-size: 24rpx;
				text-align: center;
				.title {
					font-size: 32rpx;
				}
			}
		}
		
		
		.switchBtn{
			margin: 16rpx 30rpx 0;
			background-color: #f7f7f7;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 82rpx;
			border-radius: 40rpx;
			view{
				width: 345rpx;
				height: 82rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 40rpx;
				color: #666;
			}
			.platformArea{
				background-color: #49d9ad;
				color: #fff;
			}
			.bussArea{
				background-color: #b8393c;
				color: #fff;
			}
		}
		
		.operaArea{
			margin: 16rpx 30rpx 0;
			display: flex;
			justify-content: space-between;
			.searchArea{
				width: 100%;
				font-size: 24rpx;
				border: 1px solid #d9d9d9;
				border-radius: 16rpx;
				display: flex;
				align-items: center;
				.searchIcon{
					margin-left: 10rpx;
				}
				input{
					padding: 8rpx 0;
					width: 100%;
					text-indent: 0.5em;
					font-size: 24rpx;
				}
			}
			
		}
		.goodsList>view{
			background-color: #f2f2f2;
			display: flex;
			align-items: center;
			margin: 16rpx 30rpx 0;
			padding: 30rpx 0;
			.lftImg{
				width: 340rpx;
				height: 340rpx;
				margin: 0 35rpx;
				image{
					margin-top: 30rpx;
					width: 280rpx;
					height: 280rpx;
				}
			}
			.rgtInfo{
				padding-right: 10rpx;
			}
			.infoName{
				font-size: 30rpx;
				line-height: 30rpx;
			}
			.infoRemarks{
				font-size: 26rpx;
				margin-top: 20rpx;
			}
			.infoMoney{
				margin-top: 20rpx;
				color: #b8393c;
			}
			.infoBtn{
				margin-top: 10rpx;
				width: 300rpx;
				padding: 5rpx 0;
				color: #fff;
				background-color: #49d9ad;
				text-align: center;
			}
		}
	}
</style>
