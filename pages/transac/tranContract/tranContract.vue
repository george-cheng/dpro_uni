<template>
	<view class="tranContract mainBox" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
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
				:isClick = 'isClick'
			></my-turn-table-draw>
		</view>
		
		<view class="turnTabArea" v-if="isTrunTabArea">
			<view class="turnTabClose i-closeRgt" @click.stop="turnTabCloseEvent()"></view>
			<view class="turnTabImg">
				<image src="../../../static/images/turnTabImg.png" mode="aspectFit"></image>
			</view>
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
				dedAmountTit: [
					{'dedAmount': '100','dedAmountName': '100区'},
					{'dedAmount': '300','dedAmountName': '300区'},
					{'dedAmount': '500','dedAmountName': '500区'}
				],
				dedAmount: '100',
				dedChoiceOn: '0',
				getIndex: 0,
				isClick: true,
				isTrunTabArea: true
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
								prizeListArr.push('',{
									name: this.dedAmountList[i].name, 
									logo:this.dedAmountList[i].logo, 
									ded_amount:this.dedAmountList[i].ded_amount,
									out_mult: this.dedAmountList[i].out_mult,
									id: this.dedAmountList[i].id
								})
							}
							this.prizeList = prizeListArr
							console.log(this.prizeList)
						}
					}
				})
				this.trunTableEvent()
			},
			trunTableEvent(){
				this.ajaxJson({
					url: '/api/v1/treatyType/turntable',
					method: 'POST',
					data: { dedAmount: this.dedAmount },
					call: (data)=>{
						let trunTableId = 6
						for(let i in this.prizeList){
							if(this.prizeList[i].id == trunTableId){
								this.getIndex = parseInt(i)
							}
						}
						
						return
						if(data.code == 200){
							let trunTableId = data.data.id							
							for(let i in this.prizeList){
								if(this.prizeList[i].id == trunTableId){
									this.getIndex = parseInt(i)
								}
							}
						}else if(data.code == 500){
							this.targetIndex = 0
							uni.showToast({
								icon: 'none',
								title: data.msg,
								success: () => {}
							})
						}else{
							this.isClick = false
							this.tipMsg = data.msg
							uni.showToast({
								icon: 'none',
								title: data.msg,
								success: () => {}
							})
						}
					}
				})
			},
			 befoterClick(data) {
				 
				 if(this.isClick){
				 
			    if(data.type == 'start') {
			      console.log('开始抽奖')
			      // 获取中奖单位下标
			      // let _n = Math.floor(Math.random() * this.prizeList.length)
						// console.log(_n + '111')
			   //    console.log('选中商品项：' + _n)
			   //    console.log('选中商品名：' + this.prizeList[_n].name)
			      // this.targetIndex = _n
						// _n = this.targetIndex
						

						
						this.$nextTick(()=>{
							this.trunTableEvent()
						})
							this.targetIndex = this.getIndex
						
						console.log(this.targetIndex)
						data.callback && data.callback(this.getIndex)
			    }
					}else{
						uni.showToast({
							icon: 'none',
							title: this.tipMsg,
							success: () => {
								
							}
						})
					}
			  },
			 afterClick(data) {
			    if(data.type == 'end') {
			      data.callback && data.callback()
			    }
			  },
				turnTabCloseEvent(){
					this.isTrunTabArea = false
				}
		},
		created() {

				this.dedAmountEvent()
				// this.trunTableEvent()
				this.$nextTick(()=>{
					
				// this.$refs.raffleWheel.setView()
				})
		}
	}
</script>

<style scoped lang="scss">
	
	.turnTabArea{
		position: absolute;
		top: 220rpx;
		width: 100%;
		.turnTabClose{
			position: absolute;
			top: 0;
			right: 0;
		}
		.turnTabImg{
			display: flex;
			justify-content: center;
			
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
				padding: 16rpx 40rpx;
				background-color: #38a987;
				color: #fff;
				border-radius: 6rpx;
			}
			.dedChoice{
				background-color: #af1416;
			}
		}
		.widthDraw{
			margin-top: 150rpx;
		}
	}
</style>
