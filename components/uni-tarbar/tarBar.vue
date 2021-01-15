<template>
	<view class="tarbar">
		<view @click="switchBarEvent(item, index)" class="barList" v-for="(item, index) in barList" :key="index">
			<view class="barImg">
				<image :src="switchOn == item.id ? item.selectedIconPath : item.iconPath" mode="aspectFit"></image>
			</view>
			<text class="tabTit" :class="switchOn == item.id ? 'tabTxtChoice' : 'tabTxt'">{{item.text}}</text>
		</view>
	</view>
</template>

<script>
	import { unimixin } from '../../utils/unimixin.js'
	export default {
		mixins: [ unimixin ],
		props: [
			'switchOn'
		],
		data(){
			return{
				swtichOn: '0',
				barList: [
					{	
						"id": '0',
						"text": "首页",
						"pagePath": "/pages/index/index",
						"iconPath": "../../static/icon/home.png",
						"selectedIconPath": "../../static/icon/homeSelect.png"
					},
					{
						"id": '1',
						"text": "行情",
						"pagePath": "/pages/quotation/quotation",
						"iconPath": "../../static/icon/quotation.png",
						"selectedIconPath": "../../static/icon/quotationSelect.png"
					},
					{
						"id": '2',
						"text": "交易",
						"pagePath": "/pages/transac/transacMain?choiceOn=0",
						"iconPath": "../../static/icon/transac.png",
						"selectedIconPath": "../../static/icon/transacSelect.png"
					},
					{
						"id": '3',
						"text": "资产",
						"pagePath": "/pages/assets/assets",
						"iconPath": "../../static/icon/assets.png",
						"selectedIconPath": "../../static/icon/assetsSelect.png"
					},
					{
						"id": '4',
						"text": "我的",
						"pagePath": "/pages/my/my",
						"iconPath": "../../static/icon/my.png",
						"selectedIconPath": "../../static/icon/mySelect.png"
					}]
			}
		},
		methods: {
			switchBarEvent(item, index){
				this.$emit('tabEvent')
				uni.reLaunch({
					url: item.pagePath,
					success: () => {}
				})
				this.swtichOn = index
			}
		},
		created() {

		}
	}
</script>

<style scoped lang="scss">
	.tarbar{
		width: 100%;
		position: fixed;
		bottom: 0;
		display: flex;
		background-color: #fff;
		border-top: 1px solid #f7f7f7;
		.barList{
			width: 100%;
			display: flex;
			justify-content: space-between;
			justify-content: center;
			flex-direction: column;
			text-align: center;
			.barImg{
				width: 38rpx;
				height: 38rpx;
				margin: 0 auto;
				margin-top: 15rpx;
			}
			image{
				width: 100%;
				height: 100%;
			}
			.tabTit{
				font-size: 26rpx;
				line-height: 30rpx;
				margin: 8rpx auto 10rpx;
				margin-bottom: 15rpx;
				padding-bottom: 8rpx;
			}
			.tabTxt{
				color: #999;
			}
			.tabTxtChoice{
				color: #f00;
			}
		}
	}
</style>
