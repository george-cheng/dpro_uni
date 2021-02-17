<template>
	
	<view class="holeRedPackage" @click="hideEvent()" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
		<view class="holeRedPackageBg" :style="{height: areaH + 'px', width: areaW + 'px'}"></view>
		<view class="redTit">
			<view class="redTxt">虫洞剩余({{wormHoleInfo.coin_name}})</view>
			<view class="redTxtNum">{{wormHoleInfo.total_quantity}}</view>
		</view>
		<view class="holeRed">
			<view class="holeRedArea" v-for="(item, index) in packagePos" v-if="index < dayReceive" :key="index">
				<view :animation="animationData">
					<image  @click.stop="isClick && redPackageEvent(item, index)" :style="{top: item.top + 'rpx', left: item.left + 'rpx'}" src="../../static/images/redPackage.png" mode="aspectFit"></image>
				</view>
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
			<view class="redInfoClose i-closeRgt" @click.stop="redInfoCloseEvent"></view>
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
				<view class="redShowRecord" @click.stop="redShowRecordEvent">已存入红包账户，可查询</view>
			</view>
		</view>
		<view class="redInvitaArea" v-if="isRedInvitaArea">
			<view class="redInfoClose i-closeRgt" @click.stop="invitaCloseEvent"></view>
			<view class="invitaImg">
				<image src="../../static/images/redInvita.png" mode="aspectFit"></image>
			</view>
			<view class="invitaBtn" @click.stop="invitaBtnEvent">
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
				dayReceive: 10,
				frequency: '',
				redBag: '',
				numSize: '',
				packagePos: [
					{top: '42',left: '102'},{top: '73',left: '327'},{top: '74',left: '534'},
					{top: '217',left: '29'},{top: '197',left: '180'},{top: '217',left: '414'},
					{top: '259',left: '562'},{top: '380',left: '65'},{top: '432',left: '339'},
					{top: '385',left: '487'},
				],
				animationData: {},
				isStop: true,
				timer: null,
				soundUrl: '../../static/redSound.mp3'
			}
		},
		onLoad() {
			this.animation = uni.createAnimation()
			this.timer = setInterval(()=>{
				if(this.isStop){
				this.initAnimationImg()
				this.isStop = false
				}else{
					this.noInitAnimationImg()
					this.isStop = true
				}
			}, 1200)
		},
		onShow() {
			
		},
		onUnload() {
			this.animationData = {}
			if(this.timer){
				clearInterval(this.timer)
			}
		},
		onHide() {
			if(this.timer){
				clearInterval(this.timer)
			}
		},
		onNavigationBarButtonTap(e){
			this.isRedInfoShow = false
			this.isRedInvitaArea = false
			if(e.float == 'right'){
				uni.navigateTo({
					url: '/pages/holeRedPackage/holeRedPackageRecord',
					success: () => {}
				})
			}else{
				uni.reLaunch({
					url: '../index/index',
					success: () => {}
				})
			}
		},
		methods: {
			hideEvent(){
				this.isRedInfoShow = false
				this.isRedInvitaArea = false
			},
			initAnimationImg(){
				this.animation.translateY(10).step({duration: 1000})
				this.animationData = this.animation.export()
			},
			noInitAnimationImg(){
				this.animation.translateY(-10).step({duration: 1000})
				this.animationData = this.animation.export()
			},

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
				uni.reLaunch({
					url: '/pages/my/invitaIncome/invitaIncome'
				})
			},
			redPackageSound(){
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.src = this.soundUrl;
			},
			redPackageEvent(item, index){
				this.isClick = false
				this.ajaxJson({
					url: '/api/v1/wormhole/openRedBag',
					method: 'POST',
					call: (data)=>{
						this.isClick = true
						if(data.code == 200){
							this.redPackageSound()
							this.redBag = data.data
							this.initGetWormHole()
							this.initWormHole()
							this.isRedInfoShow = true
							this.packagePos.splice(index, 1)
						}else if(data.code == 1041){
							this.isRedInvitaArea = true
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
							this.redWallet = data.data
							this.dayReceive = data.data.day_receive
							if(this.dayReceive == 0){
								this.dayReceive = 10
								this.packagePos = [
									{top: '63',left: '65'},{top: '41',left: '318'},{top: '77',left: '587'},
									{top: '162',left: '211'},{top: '123',left: '431'},{top: '244',left: '414'},
									{top: '295',left: '293'},{top: '332',left: '52'},{top: '385',left: '211'},
									{top: '368',left: '562'},
								]
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
			this.initAnimationImg()

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
			background-image: url('/static/images/holeRedBg.gif');
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
				view{
				width: 50rpx;
				height: 66rpx;
				position: absolute;
				image{
					width: 100%;
					height: 100%;
				}
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
				top: 160rpx;
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
					margin-top: 50rpx;
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
