<template>
	<view class="tranContract " @click="hideEvent()" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
		<view class="tractCon">
			<view class="dedAmount" :class="{dedChoice: dedChoiceOn == index}" v-for="(item, index) in dedAmountTit" :key="index" @click="dedAmountEvent(item, index)">
				<view>{{item.dedAmountName}}</view>
			</view>
			
		</view>
		<view class="widthDraw">
			<my-turn-table-draw ref="raffleWheel"
				:width="boxData.width"
				:height="boxData.height"
				:prizeList="prizeList"
				:targetIndex="targetIndex"
				@befoterClick="befoterClick"
				@afterClick="afterClick"
			></my-turn-table-draw>
			<view class="widthDrawBasicImg">
				<image src="../../../static/turnBasic.png" mode="aspectFit"></image>
			</view>
		</view>

		
		<view class="turnTabArea" v-if="isTrunTabArea">
			<view class="turnTabClose i-closeRgt" ></view>
			<view class="turnTabImg">
				<image src="../../../static/images/turnTabImg.png" mode="aspectFit"></image>
			</view>
			<view class="turnTabTip">{{isFail ? '还差一点！恭喜获得' : '手气不错！恭喜获得'}}</view>
			<view class="turnTabWinArea">
				<view class="areaName">
					<view class="areaMameLft areaLft">{{isFail ? '币种名称' : '合约名称'}}</view>
					<view class="areaMameRgt areaRgt">{{isFail ? failName : winData.name}}</view>
				</view>
				<view class="areaStandard" v-if="!isFail">
					<view class="areaStandardLft areaLft">标准</view>
					<view class="areaStandardRgt areaRgt">{{winData.ded_amount}}</view>
				</view>
				<view class="areaTotalOutPut">
					<view class="areaTotalOutPutLft areaLft">{{isFail ? '数量' : '总产量'}}</view>
					<view class="areaTotalOutPutRgt areaRgt">{{isFail ? accMul(dedAmount, 0.01) + 'USD' : accMul(winData.ded_amount, winData.out_mult)}}</view>
				</view>
			</view>
			
			<view class="turnTabBtmTip">{{isFail ? '抢购已进入资产账户中，可查询' : '抢购' + winData.name + '已进入资产账户中，可查询'}}</view>
			
		</view>
		
		<view class="tractBtn">
			<view @click="tranctBtnEvent(1 ,'合约资产')">合约资产</view>
			<view @click="tranctBtnEvent(2, '抢购收益')">释放收益</view>
			<view @click="tranctBtnEvent(3, '分享收益')">分享收益</view>
		</view>
		
	</view>
</template>

<script>
	import {unimixin} from '../../../utils/unimixin.js'
	import { accMul, accAdd} from '../../../utils/common.js'
	import myTurnTableDraw from '../../../components/my-turntable-draw/my-turntable-draw.vue'
	
	export default {
		mixins: [ unimixin ],
		components: { myTurnTableDraw },
		data(){
			return{
				dedAmountList: [],
				prizeList: [],
				tipMsg: '',
				boxData: {
					height: '',
					width: '',
				},
				targetIndex: 0,
				getTargetIndex: 0,
				dedAmountTit: [
					{'dedAmount': '100','dedAmountName': '100区'},
					{'dedAmount': '300','dedAmountName': '300区'},
					{'dedAmount': '500','dedAmountName': '500区'}
				],
				dedAmount: '100',
				dedChoiceOn: '0',
				getIndex: 0,
				isTrunTabArea: false,
				isTurnStart: true,
				isWin: false,
				winTip: '',
				turnTabBtmTip: '',
				isFail: false,
				failName: 'USD',
				winData: '',
			}
		},
		onLoad() {
		},
		onReachBottom(){
			if(this.page>=this.pageNum){
				this.page = this.pageNum
			}else{
				this.page += 1
				this.dedAmountEvent()
			}
		},

		methods: {
			touchEnd(e){
				if(this.changeY > 50){
					this.page = 1
					this.dedAmountEvent()
					this.paddingTop = 0
				}
			},
			dedAmountEvent(item, index){
				if(item){
					this.dedChoiceOn = index
					this.dedAmount = item.dedAmount
				}
				this.ajaxJson({
					url: '/api/v1/treatyType/byDedAmount',
					data: {dedAmount: this.dedAmount},
					call: (data)=>{
						if(data.code == 200){
							this.dedAmountList = data.data.rows
							let prizeListArr = []
							for(let i in this.dedAmountList){
								prizeListArr.push(
								{name: accMul(this.dedAmount, 0.01) + 'USDT',bg:'#fa2228',color: '#fff',isEmpty: true},
								{
									name: this.dedAmountList[i].name, 
									logo:this.dedAmountList[i].logo, 
									ded_amount:this.dedAmountList[i].ded_amount,
									out_mult: this.dedAmountList[i].out_mult,
									id: this.dedAmountList[i].id,
									isEmpty: false
								})
							}
							this.prizeList = prizeListArr
						}
					}
				})
			},
			
			befoterClick(data) {
				if(data.type == 'start') {
					this.ajaxJson({
						url: '/api/v1/treatyType/turntable',
						method: 'POST',
						data: { dedAmount: this.dedAmount },
						call: (data)=>{
							if(data.code == 200){
								for(let i in this.prizeList){
									let turnTabId = data.data.id
									if(this.prizeList[i].id == turnTabId){
										this.getTargetIndex = parseInt(i)
										this.isTurnStart = true
									}
									this.isWin = true
									this.isFail = false
								}
								this.winData = data.data
							}else if(data.code == 500){
								this.isFail = true
								this.isWin = true
								this.isTurnStart = true
								this.getTargetIndex = 0
								this.tipMsg = data.msg
								this.targetIndex = 1
								data.callback && data.callback(this.targetIndex)
							}else{
								uni.showToast({
									icon: 'none',
									title: data.msg,
									success: () => {}
								})
								this.isTurnStart = false
							} 
						}
					})
				}else{
					uni.showToast({
						icon: 'none',
						title: '失败',
						success: () => {}
					})
				}
				
				setTimeout(()=>{
					if(this.isTurnStart){
						this.targetIndex = this.getTargetIndex
						data.callback && data.callback(this.targetIndex)
					}
				},500)
			},
			afterClick(data) {
				if(data.type == 'end') {
					if(this.isWin){
						this.isTrunTabArea = true
					}
					this.dedAmountEvent()
					data.callback && data.callback()
				}
			},
			turnTabCloseEvent(){
				this.isTrunTabArea = false
			},
			hideEvent(){
				this.isTrunTabArea = false
			},
			tranctBtnEvent(index, item){
				if(index == 1){
					uni.navigateTo({
						url: '/pages/transac/tranContract/tranAssets?tranIndex=' + '1',
						success: () => {}
					})
				}else if(index == 2){
					uni.navigateTo({
						url: '/pages/transac/tranContract/tranAssets?tranIndex=' + '2',
						success: () => {}
					})
				}else{
					uni.navigateTo({
						url: '/pages/transac/tranContract/transAssetsShare',
						success: () => {}
					})
				}
			}
		},
		created() {
			this.dedAmountEvent()
		}
	}
</script>

<style scoped lang="scss">
	
	.turnTabArea{
		position: absolute;
		top: 120rpx;
		width: 100%;
		.turnTabClose{
			position: absolute;
			top: 60rpx;
			right: 20rpx;
			z-index: 9;
		}
		.turnTabImg{
			display: flex;
			justify-content: center;
		}
		.turnTabTip{
			position: absolute;
			top: 0;
			right: 50%;
			left: 50%;
			margin: auto;
			white-space: nowrap;
			display: flex;
			justify-content: center;
			margin-top: 85rpx;
			color: #ff0000;
			font-size: 36rpx;
		}
		.turnTabWinArea{
			// white-space: nowrap;
			// display: flex;
			// justify-content: center;
			position: absolute;
			top: 120rpx;
			right: 0;
			left: 0;
			white-space: nowrap;
			margin: auto;
			margin-top: 10rpx;
			width: 300rpx;
			.areaName, .areaStandard, .areaTotalOutPut{
				display: flex;
				justify-content: space-between;
				margin: 5rpx 0;
			}
			.areaLft{
				font-size: 22rpx;
				color: #333;
			}
			.areaRgt{
				font-size: 22rpx;
				color: #be1200;
			}
		}
		.turnTabBtmTip{
			position: absolute;
			right: 0;
			left: 0;
			top: 280rpx;
			white-space: nowrap;
			margin: auto;
			display: flex;
			justify-content: center;
			font-size: 22rpx;
			color: #001375;
		}
	}
	
	.turnTabClose::before{
		position: absolute;
		right: 76rpx;
		top: -40rpx;
		color: #000;
		font-size: 48rpx;
	}
	.tranContract{
		position: relative;
		.tractCon{
			margin: 58rpx 75rpx 0;
			display: flex;
			justify-content: space-between;
			.dedAmount{
				padding: 16rpx 42rpx;
				background-color: #38a987;
				color: #fff;
				border-radius: 6rpx;
			}
			.dedChoice{
				background-color: #af1416;
			}
		}
		.widthDraw{
			margin-top: 30rpx;
			position: relative;
			.widthDrawBasicImg{
				position: absolute;
				z-index: -1;
				top: 240rpx;
				right: 0;
				left: 0;
				margin: auto;
				text-align: center;
			}
		}
		
	}
	
	.tractBtn{
		position: fixed;
		z-index: 9;
		bottom: 140rpx;
		display: flex;
		justify-content: center;
		width: 100%;
		font-size: 20rpx;
		view{
			background-color: #BD3A3B;
			color: #fff;
			display: flex;
			width: 100%;
			margin: 0 30rpx;
			flex-wrap: nowrap;
			justify-content: center;
			font-size: 26rpx;
			padding: 15rpx 12rpx;
			border-radius: 4rpx;
			white-space: nowrap;
		}

	}
	
</style>
