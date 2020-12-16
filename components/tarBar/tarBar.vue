<template>
	<view class="tarbar">
		<view @click="switchBarEvent(index)" class="barList" v-for="(item, index) in barList" :key="index">
			<text class="i-check a"></text>
			<text>{{item.text}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				indexOn: 0,
				imgSrc: '../../static/icon/home.png',
				barList: [
					{
						"text": "首页",
						"pagePath": "@/pages/index/index",
						"iconPath": "../../static/icon/home.png",
						"selectedIconPath": "../../static/icon/homeSelect.png"
					},
					{
						"text": "行情",
						"pagePath": "pages/quotation/quotation",
						"iconPath": "../../static/icon/quotation.png",
						"selectedIconPath": "../../static/icon/quotationSelect.png"
					},
					{
						"text": "交易",
						"pagePath": "pages/transac/transac",
						"iconPath": "../../static/icon/transac.png",
						"selectedIconPath": "../../static/icon/transacSelect.png"
					},
					{
						"text": "资产",
						"pagePath": "pages/assets/assets",
						"iconPath": "../../static/icon/assets.png",
						"selectedIconPath": "../../static/icon/assetsSelect.png"
					},
					{
						"text": "我的",
						"pagePath": "pages/my/my",
						"iconPath": "../../static/icon/my.png",
						"selectedIconPath": "../../static/icon/mySelect.png"
					}]
			}
		},
		onLoad() {

		},
		methods: {
			switchBarEvent(index){
				this.indexOn = index
			}
		},
		created() {

		}
	}
</script>

<style scoped lang="scss">
	.tarbar{
		width: 100%;
		padding-top: 50rpx;
		position: fixed;
		bottom: 0;
		background-color: #303030;
		display: flex;
		.barList{
			width: 100%;
			display: flex;
			justify-content: space-between;
			justify-content: center;
			flex-direction: column;
			text-align: center;
			image{
				text-align: center;
				margin: 0 auto;
				width: 48rpx;
				height: 48rpx;
			}
			text{
				color: #999;
			}
			.a:before{
				color: #fff;
			}
		}
	}
</style>
