<template>
	<view class="home mainBox" :style="{paddingTop: paddingTop + 'rpx'}" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
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
			<view v-for="(item, index) in moneyDataList" :key="item.fid" v-if="index < 3" @click="moneyDataEvent(item)">
				<image class="image" :src="url + item.furl" v-if="false"></image>
				<text class="kind">{{item.fShortName}} / {{item.group}}</text>
				<text class="money">{{item.lastDealPrize}}</text>
				<text class="per" :style="{color: parseFloat(item.fupanddown) > 0 ? '#3ba987' : '#bd3a3b'}">{{parseFloat(item.fupanddown) > 0 ?  '+' + item.fupanddown : item.fupanddown}}%</text>
				<text class="cny"> ≈ {{accMul(item.lastDealPrize, usdtRate).toFixed(2)}} CNY</text>
			</view>
		</view>
		
		<view class="info">
			<view>
				<view class="quickMoney" @click="tranAssetsMain('2')">
					<view class="textQuickMoney">
						<text class="colorRed">快捷买币</text>
						<text>支持USDT</text>
					</view>
					<view class="image">
						<image src="../../static/images/payMethod.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="contractExchange" @click="contractExchangeEvent">
					<image src="../../static/images/contractExchange.png" mode="aspectFit"></image>
					<text class="colorRed">合约兑换</text>
				</view>
			</view>
			<view class="rgt">
				<view class="cooTran" @click="tranAssetsMain('1')">
					<image src="../../static/images/cooTran.png" mode="aspectFit"></image>
					<text class="colorRed">合约交易</text>
				</view>
				<view class="redPackage" @click="redPackageEvent">
					<image src="../../static/images/redPackage.png" mode="aspectFit"></image>
					<text class="colorRed">红包</text>
				</view>
			</view>
		</view>
		
		<view class="invita" @click="invitaEvent" >
			<view class="invitaCon">
				<view class="lft">
					<image src="../../static/images/invita.png" mode="aspectFit"></image>
					<text class="colorRed">邀请好友送红包</text>
				</view>
				<view class="invitaBtn" v-if="false">
					<button class="btnTxt">去邀请</button>
				</view>
			</view>
		</view>
		
		<view class="upMarket">
			<text class="marketTit">涨幅榜</text>
			<view class="marketCon">
				<view class="" v-for="(item, index) in market" :key="item.fid" v-if="index < 10" @click="marketEvent(item)">
					<view class="marketImg">
						<image :src="url + item.furl" mode="aspectFit"></image>
						<text>{{item.fShortName}} / {{item.group}}</text>
					</view>
					<text class="money">{{item.lastDealPrize}}</text>
					<text :style="{color: parseFloat(item.fupanddown)>0?'#3ba987':'#bd3a3b'}">{{parseFloat(item.fupanddown) > 0 ?  '+' + item.fupanddown : item.fupanddown}}%</text>
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

		<unitabbar :switchOn = "0"></unitabbar>
		
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import unitabbar from '../../components/uni-tarbar/tarBar.vue'
	
	import { unimixin } from '../../utils/unimixin.js'
	import { accAdd, accMul, getRandom } from '@/utils/common.js'
	export default {
	components: { uniPopup, uniPopupDialog, unitabbar },
	mixins: [ unimixin ],
		data() {
			return {
				swipers: [],
				
				msg: [],
				market: [],
				rate: [],
				usdtRate: '',
				moneyData: [],
				
				version: [],
				androidVersion: [],
				iosVersion: [],
				versionCode: '',
				editionNum: '',
				iosEditionNum: '',
				updatetips: '',
				iosUpdatetips: '',
				updataUrl: '',
				iosUpdataUrl: '',
				isCancel: true,
				progressFile: '0',
				isProgressFile: false,
				platform: '',
				
				isIos: false,
			}
		},
		
		onLoad() {
			
		},
		onShow() {
			this.getSystemInfo()
			plus.runtime.getProperty(plus.runtime.appid,(wgtinfo)=>{
				this.versionCode = wgtinfo.versionCode
			})
			this.getVersion()
		},
		onHide() {
			this.$refs.popup.close()
		},

		methods: {
			touchEnd(e){
				if(this.changeY > 50){
					this.getExchangeRate()
					this.getMsg()
					this.getImg()
					this.getMarket()
					this.getMoneyData()
					
					this.paddingTop = 0
				}
			},
			/* 虫洞红包 */
			redPackageEvent(){
				uni.reLaunch({
					url: '/pages/holeRedPackage/holeRedPackage',
					success: () => {}
				})
			},
			/* 合约兑换 */
			contractExchangeEvent(){
				// uni.reLaunch({
				// 	url: '/pages/contractExchange/exchangeMall',
				// 	success: () => {}
				// })
				uni.showToast({
					icon: 'none',
					title: '此功能暂未开放',
					success: () => {}
				})
			},
			/* 邀请好友 */
			invitaEvent(){
				uni.reLaunch({
					url: '/pages/my/invitaIncome/invitaIncome?category=2',
					success: () => {}
				})
			},
			/* 涨幅榜跳转到K线图 */
			marketEvent(item){
				uni.reLaunch({
					url: '/pages/klineDiagram/klineDiagram?symbol=' + item.fid  + '&category=2',
					success: () => {}
				})
			},
			getMsg(){
				let data = {type: '1',}
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
							success: function () {}
						})
					}
				})
			},
			moneyDataEvent(item){
				uni.reLaunch({
					// url: '/pages/transac/transacMain?transacInfo=' + encodeURIComponent(JSON.stringify(item)) + '&choiceOn=0',
					url: '/pages/klineDiagram/klineDiagram?symbol=' + item.fid + '&category=2',
					success: () => {}
				})
			},

			tranAssetsMain(index){
				uni.reLaunch({
					url: '../transac/transacMain?choiceOn=' + index,
					success: () => {}
				})
			},
			getVersion(){
				this.ajaxJson({
					url: '/api/v1/appVersion',
					call: (data)=>{
						if(data.code == 200){
							this.version = data.data
							if(this.platform == 'ios'){
								for(let i in this.version){
									if(this.version[i].type == this.platform){
										this.iosVersion = this.version[i]
										this.iosEditionNum = this.iosVersion.edition  //140
										if(this.versionCode < this.iosEditionNum){
											this.$refs.popup.open()
											this.updatetips = this.iosVersion.updatetips
											this.updataUrl = this.iosVersion.downurl
											uni.hideTabBar({})
											this.isIos = true
											if(this.iosVersion.forceupdate == 1){    //强制更新
												this.isCancel = false
											}
										}
									}
								}
							}else{
								for(let i in this.version){
									if(this.version[i].type == this.platform){
										this.androidVersion = this.version[i]
										this.editionNum = this.androidVersion.edition  //140
										if(this.versionCode < this.editionNum){
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
				
				if(this.isIos){
					plus.runtime.openURL('https://testflight.apple.com/join/kwKrlMr4')
				}else{
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
			getSystemInfo(){
				uni.getSystemInfo({
					success: (res) => {
						this.platform = res.platform
					}
				})
			},
			moneyDataSord(a,b){
				return a.fid - b.fid
			},
			getUserInfo(){
				this.ajaxJson({
					url: '/api/v1/session',
					call: (data)=>{
						if(data.code == 200){
							uni.setStorage({
								key: 'userInfo',
								data: data.data
							})
						}
					}
				})
			},
			getFrontSession(){
				this.ajaxJson({
					url: '/api/v1/frontSession',
					call: (data)=>{
						uni.setStorage({
							key: 'userSession',
							data: data.data
						})
					}
				})
			}
		},
		computed:{
			moneyDataList() {
				return this.moneyData.sort(this.moneyDataSord)
			}
		},
		created() {
			this.getUserInfo()
			this.getExchangeRate()
			this.getMsg()
			this.getImg()
			this.getMarket()
			this.getMoneyData()
			this.getFrontSession()
		}
	}
</script>

<style lang="scss">
	.colorRed{
		color: #b8393c !important;
	}
	.home {
		background-color: #f7f7f7;
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
			background-color: #fff;
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
			// background-color: #f7f7f7;
			view {
				display: flex;
				flex-wrap: wrap;
				flex-direction: column;
				text-align: center;
				justify-content: center;
				padding-top: 30rpx;
				.image {
					margin: 0 auto;
					width: 56rpx;
					height: 56rpx;
				}
				.kind{
					margin-top: 22rpx;
					color: #999;
					font-size: 24rpx;
					line-height: 24rpx;
				}
				.money{
					margin-top: 20rpx;
					color: #BD3A3B;
					font-size: 28rpx;
					line-height: 28rpx;
				}
				.per{
					margin-top: 15rpx;
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
				padding-top: 20rpx;
				width: 368rpx;
				height: 96rpx;
				display: flex;
				justify-content: space-between;
				background-color: #fff;
				text:first-child{
					color: #ccc;
					font-weight: 400;
					font-size: 28rpx;
					line-height: 28rpx;
				}
				text:nth-child(2){
					color: #8C8C8C;
					font-weight: 400;
					font-size: 24rpx;
					line-height: 24rpx;
					margin-top: 20rpx;
				}
				.image{
					padding: 0 30rpx;
					width: 110rpx;
					height: 110rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.textQuickMoney{
					padding: 0 30rpx;
					display: flex;
					flex-direction: column;
				}
			}
			.contractExchange{
				width: calc( 100% - 380)rpx;
				height: 115rpx;
				margin-top: 10rpx;
				display: flex;
				align-items: center;
				background-color: #fff;
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
			.rgt{
				.cooTran{
					width: calc( 100% - 380)rpx;
					height: 115rpx;
					margin-bottom: 12rpx;
					display: flex;
					align-items: center;
					background-color: #fff;
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
				.redPackage{
					width: 370rpx;
					height: 113rpx;
					display: flex;
					align-items: center;
					background-color: #fff;
					text{
						font-size: 28rpx;
						line-height: 28rpx;
						font-family: PingFangSC;
						font-weight: 400;
						color: #ccc;
					}
					image{
						margin-left: 50rpx;
						margin-right: 54rpx;
						width: 48rpx;
						height: 53rpx;
					}
				}
			}
		}
		.invita{
			margin: 12rpx 0;
			height: 130rpx;
			background-color: #fff;
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
						color: #999;
						font-size: 26rpx;
						line-height: 26rpx;
					}
				}
			}		
		}
		.upMarket{
			margin-top: 12rpx;
			padding: 0 36rpx;
			background-color: #fff;
			.marketTit{
				height: 105rpx;
				font-size: 30rpx;
				line-height: 105rpx;
				color: #999;
			}
			.marketCon{
				view{
					height: 116rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-top: 1px solid #f7f7f7;
					.marketImg{
						width: 33%;
						display: flex;
						align-items: center;
						justify-content: flex-start;
						color: #999;
						border: none;
						text{
							font-size: 28rpx;
							line-height: 26rpx;
							margin-left: 20rpx;
							white-space: nowrap;
							span{
								font-size: 28rpx;
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
						color: #999;
					}
				}
			}
		}

	}
</style>
