<template>
	<view class="goodsDetail">
		<view class="goodsImg">
			<image :src="url + goodsDetail.desc_diagram" mode="aspectFit"></image>
		</view>
		<view class="detailInfo">
			<view class="goodsPrice">{{goodsDetail.price}} USDT</view>
			<rich-text class="synopsis" :nodes="goodsDetail.synopsis"></rich-text>
		</view>
		<view class="content">
			<view class="contentTit"></view>
			<rich-text class="contentImg" :nodes="goodsDetail.content"></rich-text>
		</view>
		<view class="goodExchange" @click="exchangeEvent()">
			<view>立即兑换</view>
		</view>
	</view>
</template>

<script>
	import { unimixin } from '../../utils/unimixin.js'
	export default {
		mixins: [ unimixin ],
		data(){
			return{
				gid: '',
				goodsDetail: ''
			}
		},
		onLoad(options) {
			this.gid = options.gid
		},
		onNavigationBarButtonTap(e) {
			if(e.float == 'left') {
				uni.reLaunch({
					url: '/pages/contractExchange/exchangeMall',
					success: () => {}
				})
			}
		},
		methods: {
			exchangeEvent(){
				uni.reLaunch({
					url: '/pages/contractExchange/exchangeOpera?gid=' + this.gid,
					success: () => {}
				})
			},
			getGoodsDetail(){
				this.ajaxJson({
					url: '/api/v1/treatyCashGoods/byId',
					data: { gid: this.gid },
					call: (data)=>{
						this.goodsDetail = data.data
						console.log(this.goodsDetail)
					}
				})
			}
		},
		created() {
			this.getGoodsDetail()
		}
	}
</script>

<style scoped lang="scss">
	.goodsDetail{
		.goodsImg{
			width: 750rpx;
			height: 690rpx;
			background-color: #f7f7f7;
			display: flex;
			align-items: center;
			text-align: center;
			image{

				margin: 0 auto;
			}
		}
		.detailInfo{
			margin: 25rpx 30rpx 0;
			.goodsPrice{
				color: #b8393c;
				margin-bottom: 10rpx;
			}
			.synopsis{
			}
		}
		.content{
			margin-top: 20rpx;
			padding-bottom: 98rpx;
			.contentImg{
				width: 750rpx;
				margin: 0 auto;
				// display: flex;
				// justify-content: center;
				image{
					width: 750rpx;
					margin: 0 auto;
				}
			}
		}
		.goodExchange{
			position: fixed;
			z-index: 9;
			width: 100%;
			height: 98rpx;
			bottom: 0;
			background-color: #fff;
			border-top: 1px solid #f7f7f7;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			view{
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 30rpx;
				width: 200rpx;
				height: 70rpx;
				background-color: #b8393c;
				color: #fff;
				border-radius: 6rpx;
			}
		}
	}
</style>
