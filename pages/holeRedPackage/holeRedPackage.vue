<template>
	
	<view class="holeRedPackage" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
		<view class="holeRedPackageBg" :style="{height: areaH + 'px', width: areaW + 'px'}"></view>
		<view class="redTit">
			<view class="redTxt">虫洞剩余({{wormHoleInfo.coin_name}})</view>
			<view class="redTxtNum">{{wormHoleInfo.total_quantity}}</view>
		</view>
		<view class="holeRed">
			<view class="holeRedArea" v-for="(item, index) in packagePos" v-if="index < numSize" :key="index">
				<image @click="redPackageEvent(item, index)" :style="{top: item.top + 'rpx', left: item.left + 'rpx'}" src="../../static/images/redPackage.png" mode="aspectFit"></image>
			</view>
			<view class="holeRedInfo">
				<view class="holeInfoTotal">
					<text class="infoTxt">虫洞累计吞噬({{wormHoleInfo.coin_name}})</text>
					<text class="infoNum">{{wormHoleInfo.quantity_received}}</text>
				</view>
				<view class="holeInfoUse">
					<text class="infoTxt">可用余额({{wormHoleInfo.coin_name}})</text>
					<text class="infoNum">{{redWallet.total}}</text>
				</view>
			</view>
		</view>
		<view class="redPackageInfo">
			<text>可领取个数：{{redWallet.day_receive}}个</text>
			<text>已领取总个数：{{redWallet.number_received}}个</text>
			<text>已领取总数量：{{redWallet.quantity_received}} {{wormHoleInfo.coin_name}}</text>
		</view>
		<view class="redInfoShow" v-if="isRedInfoShow">
			<view class="redInfoClose i-closeRgt" @click="redInfoCloseEvent"></view>
			<view class="redShowImg">
				<image src="../../static/images/redTip.png" mode="aspectFit"></image>
			</view>
			<view class="redShowTxt">
				<view class="redTxtInfo">
					<view class="infoLft">
						<view class="redInfoTxt">币种</view>
						<view class="redInfoCon">{{wormHoleInfo.coin_name}}</view>
					</view>
					<view class="infoRgt">
						<view class="redInfoTxt">数量</view>
						<view class="redInfoCon">{{redBag.receive_amount}}</view>
					</view>
				</view>
				<view class="redShowRecord" @click="redShowRecordEvent">已存入红包账户，可查询</view>
			</view>
		</view>
		<view class="redInvitaArea" v-if="isRedInvitaArea">
			<view class="redInfoClose i-closeRgt" @click="invitaCloseEvent"></view>
			<view class="invitaImg">
				<image src="../../static/images/redInvita.png" mode="aspectFit"></image>
			</view>
			<view class="invitaBtn" @click="invitaBtnEvent">
				<image src="../../static/images/redInvitaBtn.png" mode="aspectFit"></image>
			</view>
		</view>
		
	</view>

</template>

<script>
	import { accAdd, accMul , checkHz} from '../../utils/common.js'
	import { unimixin } from '../../utils/unimixin.js'
	export default {
		mixins: [unimixin],
		data(){
			return{
				hz: '',
				areaH: '',
				areaW: '',
				wormHoleInfo: '',
				redWallet: '',
				isRedInfoShow: false,
				isRedInvitaArea: false,
				packageLen: 0,
				frequency: '',
				numSize: '',
				packagePos: [
					
				]
			}
		},
		onLoad() {

		},
		onNavigationBarButtonTap(e){
			if(e.float == 'right'){
				uni.navigateTo({
					url: '/pages/holeRedPackage/holeRedPackageRecord',
					success: () => {}
				})
			}
		},
		methods: {
			touchEnd(e){
				if(this.changeY > 50){
					this.initImgSize()
					this.initWormHole()
					this.initGetWormHole()
					this.paddingTop = 0
				}
			},
			/* 跳转红包记录 */
			redShowRecordEvent(){
				uni.navigateTo({
					url: '/pages/holeRedPackage/holeRedPackageRecord'
				})
			},
			/*  关闭已领取的红包弹框  */
			redInfoCloseEvent(){
				this.isRedInfoShow = false
				this.initWormHole()
			},
			/* 关闭邀请弹框 */
			invitaCloseEvent(){
				this.isRedInvitaArea = false
			},
			/* 邀请 */
			invitaBtnEvent(){
				uni.navigateTo({
					url: '/pages/my/invitaIncome/invitaIncome'
				})
			},
			redPackageEvent(item, index){
				this.ajaxJson({
					url: '/api/v1/wormhole/openRedBag',
					method: 'POST',
					call: (data)=>{
						if(data.code == 200){
							this.redBag = data.data
							this.isRedInfoShow = true
							this.packagePos.splice(index, 1)
							this.initGetWormHole()
						}else if(data.code == 1041){
							uni.showToast({
								image: '/static/images/wrong.png',
								title: data.msg
							})
						}else{
							uni.showToast({
								image: '/static/images/wrong.png',
								title: data.msg
							})
						}
					}
				})
			},
			initWormHole(){
				this.ajaxJson({
					url: '/api/v1/wormhole/wallet',
					call: (data)=>{
						if(data.code == 200){
							this.packageLen = data.data.day_receive 
							this.frequency = parseInt(this.packageLen / 10)
							this.numSize = parseInt(this.packageLen) % 10
							if(this.frequency != 0){
								if(this.numSize == 0){
									this.numSize = 10
									this.packagePos = [{top: '18',left: '150'},{top: '18',left: '396'},{top: '54',left: '320'},{top: '157',left: '76'},{top: '165',left: '258'},{top: '157',left: '486'},{top: '273',left: '137'},{top: '308',left: '290'},{top: '308',left: '557'},{top: '236',left: '372'}]
								}else{
									this.packagePos = [{top: '18',left: '150'},{top: '18',left: '396'},{top: '54',left: '320'},{top: '157',left: '76'},{top: '165',left: '258'},{top: '157',left: '486'},{top: '273',left: '137'},{top: '308',left: '290'},{top: '308',left: '557'},{top: '236',left: '372'}]
								}
							}
							this.redWallet = data.data
							let surplus = accAdd(this.redWallet.total_receive, accMul(this.redWallet.day_receive, -1))
							if(surplus >= this.redWallet.total_receive){
								this.initGetWormHole()
								this.isRedInvitaArea = true
							}
							if(surplus >= 30){
								uni.showToast({
									icon: 'none',
									title: '已达到当日30次上限'
								})
							}
						}else{
							uni.showToast({
								image: '/static/images/wrong.png',
								title: data.msg
							})
						}
					}
				})
			},
			initGetWormHole(){
				this.ajaxJson({
					url: '/api/v1/wormhole',
					call: (data)=>{
						if(data.code == 200){
							this.wormHoleInfo = data.data
						}
					}
				})
			},
			initImgSize(){
				uni.getSystemInfo({
					success: (data) => {
						this.areaH = accAdd(data.safeArea.height, accMul(data.windowTop, -1))
						this.areaW = data.screenWidth
					}
				})
			}
		},
		created() {
			this.initImgSize()
			this.initWormHole()
			this.initGetWormHole()
		}
	}
</script>

<style scoped lang="scss">
	.redInfoClose::before{
		position: absolute;
		right: 0;
		top: -40rpx;
		color: #fff;
		font-size: 48rpx;
	}
	.holeRedPackage{
		// position: relative;
		display: flex;
		justify-content: center;
		.redTit{
			position: absolute;
			top: 55rpx;
			left: 0;
			right: 0;
			margin: 0 auto;
			text-align: center;
			display: flex;
			justify-content: center;
			flex-direction: column;
			font-size: 30rpx;
			.redTxt{color: #fff;}
			.redTxtNum{
				margin-top: 10rpx;
				color: #999;
			}
		}
		.holeRedPackageBg{
			background-image: url('/static/images/holeRedBg.jpg');
			background-size: cover;
			background-position: center center;
			background-repeat: no-repeat;
		}
		.holeRed{
			position: absolute;
			top: 160rpx;
			right: 0;
			left: 0;
			margin: auto;
			width: 660rpx;
			height: 510rpx;
			.holeRedArea{
				width: 50rpx;
				height: 66rpx;
				position: absolute;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.holeRedInfo{
				position: absolute;
				top: 640rpx;
				width: 100%;
				display: flex;
				justify-content: space-between;
				.holeInfoTotal, .holeInfoUse{
					display: flex;
					flex-direction: column;
					font-size: 30rpx;
					.infoTxt{
						color: #fff;
					}
					.infoNum{
						margin-top: 12rpx;
						color: #999;
					}
				}
			}
		}
		.redPackageInfo{
			position: absolute;
			top: 930rpx;
			margin: auto;
			display: flex;
			flex-direction: column;
			text-align: center;
			color: #999;
			font-size: 30rpx;
			line-height: 30rpx;
			text{
				margin-bottom: 20rpx;
				border: 1px solid #999;
				padding: 18rpx 80rpx;
				border-radius: 6px;
			}
		}

		.redInfoShow{
			position: absolute;
			top: 220rpx;
			.redShowImg{
				image{
					
				}
			}
			.redShowTxt{
				position: absolute;
				top: 140rpx;
				left: 0;
				right: 0;
				margin: auto;
				width: 266rpx;
				.redTxtInfo{
					display: flex;
					justify-content: space-between;
					.infoLft, .infoRgt{
						font-size: 24rpx;
						.redInfoTxt{
							color: #d91e12;
						}
						.redInfoCon{
							color: #000;
						}
					}
				}
				.redShowRecord{
					margin-top: 30rpx;
					font-size: 24rpx;
				}
			}
		}
		.redInvitaArea{
			position: absolute;
			top: 180rpx;
			.invitaImg{
				
			}
			.invitaBtn{
				width: 316rpx;
				height: 100rpx;
				margin: 70rpx auto 0;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>
