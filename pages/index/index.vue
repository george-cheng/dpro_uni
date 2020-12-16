<template>
	<view class="home mainBox">
		<swiper indicator-dots circular autoplay interval="3000">
			<swiper-item v-for="item in swipers" :key="item.id">
				<image :src="url + item.image_url"></image>
			</swiper-item>
		</swiper>

		<swiper class="limitp-hg" vertical="true" autoplay="true" circular="true" interval="3000">
			<swiper-item v-for="(item, index) in msg" :key="index">
				<navigator class="scrool-list-item"><span class="title">公告：</span>{{item.title}}</navigator>
			</swiper-item>
		</swiper>

		<view class="content">
			<view v-for="(item, index) in moneyData" :key="item.fid" v-if="index < 3" @click="moneyDataEvent(item)">
				<image class="image" :src="url + item.furl"></image>
				<text class="kind">{{item.fShortName}} / {{item.group}}</text>
				<text class="money">{{item.lastDealPrize}}</text>
				<text class="per" :style="{color: parseFloat(item.fupanddown) > 0 ? '#3ba987' : '#bd3a3b'}">{{item.fupanddown}}%</text>
				<text class="cny"> ≈ {{accMul(item.lastDealPrize, usdtRate).toFixed(2)}} CNY</text>
			</view>
		</view>
		
		<view class="info">
			<!-- <navigator url="../transac/transac?num=1" open-type="switchTab"> -->
				<view class="quickMoney" @click="quickEvent">
					<text>快捷买币</text>
					<text>支持btc/usdt/eth等</text>
					<view class="image">
						<image src="../../static/images/quickMoney.png"></image>
					</view>
				</view>
			<!-- </navigator> -->
			<view class="rgt">
				<view class="cooTran">
					<image src="../../static/images/cooTran.png"></image>
					<text>合约交易</text>
				</view>
				<view class="helpCen">
					<image src="../../static/images/helpCen.png"></image>
					<text>帮助中心</text>
				</view>
			</view>
		</view>
		
		<view class="invita">
			<view class="invitaCon">
				<view class="lft">
					<image src="../../static/icon/assets.png"></image>
					<text>邀请好友注册即送10 USTD</text>
				</view>
				<view class="invitaBtn" v-if="false">
					<button class="btnTxt">去邀请</button>
				</view>
			</view>
		</view>
		
		<view class="upMarket">
			<text class="marketTit">涨幅榜</text>
			<view class="marketCon">
				<view class="" v-for="(item, index) in market" :key="item.fid" v-if="index < 10">
					<view class="marketImg">
						<image :src="url + item.furl" mode=""></image>
						<text>{{item.fShortName}} / {{item.group}}</text>
					</view>
					<text class="money">{{item.lastDealPrize}}</text>
					<text :style="{color: parseFloat(item.fupanddown)>0?'#3ba987':'#bd3a3b'}">{{item.fupanddown}}%</text>
				</view>
			</view>
		</view>
		
		<uni-popup ref="popup" type="dialog">
				<uni-popup-dialog type="center" :title="!isProgressFile?'更新信息':'下载进度'" :isButton="!isProgressFile" :before-close="true" :duration="2000" :isContent="false" :isCancel="isCancel" @confirm="upDateConfirm" @close="upDateClose">
					<view class="upDate">
						<rich-text :nodes="updatetips" v-if="!isProgressFile"></rich-text>
						<text class="downProgress" v-if="isProgressFile">{{progressFile}} %</text>
					</view>
				</uni-popup-dialog>
		</uni-popup>
		
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	export default {
	components: { uniPopup, uniPopupDialog },
		data() {
			return {
				swipers: [],
				url: 'https://dpro-main.oss-cn-hongkong.aliyuncs.com/',
				msg: [],
				market: [],
				rate: [],
				usdtRate: '',
				moneyData: [],
				
				version: [],
				androidVersion: [],
				versionCode: '',
				editionNum: '',
				updatetips: '',
				updataUrl: '',
				isCancel: true,
				progressFile: '0',
				isProgressFile: false
			}
		},
		
		onLoad() {
			
		},
		onHide() {
			this.$refs.popup.close()
		},
		methods: {
			getMsg(){
				let data = {page: 1,pageSize: 1,type: 1,}
				this.ajaxJson({
					url: '/api/v1/articleList',
					method: 'POST',
					data: data,
					call: (res)=>{
						this.msg = res.data.rows
					}
				})
			},
			getMarket(){
				this.ajaxJson({
					url: '/api/v2/market/coins/increase',
					call: (res)=>{
						this.market = res.dataMap.USDT
					}
				})
			},
			getMoneyData(){
				this.ajaxJson({
					url: '/api/v2/market/coins',
					call: (res)=>{
						this.moneyData = res.dataMap.USDT
					}
				})
				uni.getStorage({
					key: 'rate',
					success: (res)=>{
						this.rate = res.data
						this.usdtRate = this.rate.usdt
					},
				})
			},
			getImg(){
				let data = {via: 'app'}
				this.ajaxJson({
					url: '/api/v1/config/banner',
					data: data,
					call: (res)=>{
						this.swipers = res.data
					}
				})
			},
			getExchangeRate(){
				this.ajaxJson({
					url: '/api/v2/market/getUsdtPrice',
					call: (res)=>{
						this.rate = res.data
						uni.setStorage({
							key: 'rate',
							data: this.rate,
							success: function () {
								
							}
						})
					}
				})
			},
			moneyDataEvent(item){
				uni.switchTab({
					url: '/pages/transac/transacMain',
					success: () => {
						uni.setStorage({
							key: 'moneyData',
							data: item
						})
					}
				})
			},
			quickEvent(){
				uni.switchTab({
					url: '../transac/transacMain',
					success: () => {
						uni.setStorage({
							key: 'quickIndex',
							data: 2
						})
					}
				})
			},
			getVersion(){
				this.ajaxJson({
					url: '/api/v1/appVersion',
					call: (data)=>{
						if(data.code == 200){
							this.version = data.data
							for(let i in this.version){
								if(this.version[i].type === 'android'){
									this.androidVersion = this.version[i]
								}
							}
							this.editionNum = this.androidVersion.edition  //140
							
							if(this.editionNum > this.versionCode){
								this.$refs.popup.open()
								this.updatetips = this.androidVersion.updatetips
								this.updataUrl = this.androidVersion.downurl
								uni.hideTabBar({})
								if(this.androidVersion.forceupdate == 1){    //强制更新
									this.isCancel = false
								}
							}
						}
					}
				})
			},
			upDateClose(){
				uni.showTabBar({})
				this.$refs.popup.close()
			},
			upDateConfirm(){
				this.isProgressFile = true
				const downloadTask  =  uni.downloadFile({
					url: this.updataUrl,
					success: (res) => {
						uni.saveFile({
							tempFilePath: res.tempFilePath,
							success: (res) => {
								uni.openDocument({
									filePath: res.savedFilePath,
								})
							}
						})
						uni.showToast({
							title: '下载完成',
							
						})
					}
				})
				let progress
				let totalBytesWritten
				let totalBytesExpectedToWrite
				downloadTask.onProgressUpdate((res)=>{
					progress = res.progress
					totalBytesWritten = res.totalBytesWritten
					totalBytesExpectedToWrite = res.totalBytesExpectedToWrite
				})
				let downLoadTime
				downLoadTime = setInterval(()=>{
					this.progressFile = parseInt((totalBytesWritten/totalBytesExpectedToWrite) * 100)
					if(this.progressFile >= 100){
						clearInterval(downLoadTime)
					}
				}, 1000)
			}
		},
		created() {
			this.getVersion()
			
			plus.runtime.getProperty(plus.runtime.appid,(wgtinfo)=>{
				this.versionCode = wgtinfo.versionCode
			})
			
			this.getExchangeRate()
			this.getMsg()
			this.getImg()
			this.getMarket()
			this.getMoneyData()
		}
	}
</script>

<style lang="scss">
	.home {
		.upDate{
			margin: 0 20rpx;
			.downProgress{
				display: flex;
				justify-content: center;
				margin: 20rpx 0;
				padding-bottom: 20rpx;
			}
		}
		swiper {
			width: 750rpx;
			height: 350rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.limitp-hg {
			width: 100%;
			height: 60rpx;
			line-height: 60rpx;
			color: #8C8C8C;
			background-color: #303030;
			.scrool-list-item {
				font-size: 24rpx;
				text-align: center;
				.title {
					font-size: 32rpx;
					color: #ccc;
				}
			}
		}
		.content {
			display: flex;
			justify-content: space-around;
			view {
				display: flex;
				flex-wrap: wrap;
				flex-direction: column;
				text-align: center;
				justify-content: center;
				padding-top: 50rpx;
				.image {
					margin: 0 auto;
					width: 56rpx;
					height: 56rpx;
				}
				.kind{
					margin-top: 22rpx;
					color: #FFFFFF;
					font-size: 24rpx;
					line-height: 24rpx;
				}
				.money{
					margin-top: 30rpx;
					color: #BD3A3B;
					font-size: 28rpx;
					line-height: 28rpx;
				}
				.per{
					margin-top: 20rpx;
					color: #13134A;
					font-size: 24rpx;
					line-height: 24rpx;
				}
				.cny{
					margin-top: 24rpx;
					margin-bottom: 50rpx;
					color: #666666;
					font-size: 24rpx;
					line-height: 24rpx;
				}
			}
		}
		.info{
			display: flex;
			justify-content: space-between;
			.quickMoney{
				width: 368rpx;
				height: 240rpx;
				background-color: #303030;
				display: flex;
				flex-direction: column;
				margin-right: 12rpx;
				text{
					margin-left: 36rpx;
				}
				text:first-child{
					margin-top: 32rpx;
					color: #ccc;
					font-weight: 400;
					font-size: 28rpx;
					line-height: 28rpx;
				}
				text:nth-child(2){
					margin-top: 22rpx;
					color: #8C8C8C;
					font-weight: 400;
					font-size: 24rpx;
					line-height: 24rpx;
				}
				.image{
					margin-left: 232rpx;
					width: 110rpx;
					height: 82rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
			.rgt{
				.cooTran{
					width: calc( 100% - 380)rpx;
					height: 115rpx;
					background-color: #303030;
					margin-bottom: 12rpx;
					display: flex;
					align-items: center;
					text{
						font-size: 28rpx;
						line-height: 28rpx;
						font-weight: 400;
						color: #ccc;
					}
					image{
						margin-left: 42rpx;
						margin-right: 45rpx;
						width: 62rpx;
						height: 69rpx;
					}
				}
				.helpCen{
					width: 370rpx;
					height: 113rpx;
					background-color: #303030;
					display: flex;
					align-items: center;
					text{
						font-size: 28rpx;
						line-height: 28rpx;
						font-family: PingFangSC;
						font-weight: 400;
						color: #ccc;
					}
					image{
						margin-left: 42rpx;
						margin-right: 45rpx;
						width: 59rpx;
						height: 65rpx;
					}
				}
			}
		}
		.invita{
			margin: 12rpx 0;
			height: 130rpx;
			background-color: #303030;
			.invitaCon{
				margin: 0 30rpx;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: space-around;
				.lft{
					display: flex;
					align-items: center;
					image{
						width: 60rpx;
						height: 53rpx;
					}
					text{
						margin-left: 24rpx;
						font-size: 28rpx;
						line-height: 28rpx;
						font-weight: 400;
						color: #8C8C8C;
					}
				}
				.invitaBtn{
					display: flex;
					justify-content: flex-end;
					.btnTxt{
						width: 150rpx;
						height: 70rpx;
						background-color: #BD3A3B;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #fff;
						font-size: 26rpx;
						line-height: 26rpx;
					}
				}
			}		
		}
		.upMarket{
			margin-top: 12rpx;
			background-color: #303030;
			padding: 0 36rpx;
			.marketTit{
				height: 105rpx;
				font-size: 30rpx;
				line-height: 105rpx;
				color: #FDFFFE;
			}
			.marketCon{
				view{
					height: 116rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-top: 1px solid #383838;
					.marketImg{
						width: 33%;
						display: flex;
						align-items: center;
						justify-content: flex-start;
						color: #fff;
						text{
							font-size: 26rpx;
							line-height: 26rpx;
							margin-left: 20rpx;
							white-space: nowrap;
							span{
								font-size: 20rpx;
								line-height: 20rpx;
							}
						}
						image{
							width: 62rpx;
							height: 62rpx;
						}
					}
					.money{
						width: 33%;
						color: #fff;
					}
				}
			}
		}
	}
</style>
