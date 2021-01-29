<template>
	<view class="bussManager mainBox" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
		<view class="bussManagerArea">
			<view class="managerTit">
				<view :class="{choice: choiceOn == index}" @click="switchManager(item, index)" v-for="(item, index) in managerList" :key="index">{{item}}</view>
			</view>
			<view class="managerIpt">
				<view class="priceIpt">
					<input type="number" v-model="price" :placeholder="priceHolder" @input="calcPrice">
				</view>
				<view class="amountIpt">
					<input type="number" v-model="amount" :placeholder="amountHolder" @input="calcAmount">
				</view>
				<view class="totalIpt">
					<input type="text" v-model="total" disabled :placeholder="totalHolder">
				</view>
			</view>
			<view class="bussTranNotice">《交易须知》</view>
			<view class="bussOpera" @click="bussOperaEvent">
				<button type="default">{{operaTxt}}</button>
			</view>
		</view>
		<view class="bussManagerList">
			<view class="listTit">市场挂单</view>
			<view class="managerList">
				<view class="listArea" v-for="(item, index) in bussManagerList" :key="index">
					<view class="listAreaCon">
						<view><text>类型</text><text>{{item.type == '1' ? '卖出' : '买入'}}</text></view>
						<view><text>数量(USDT)</text><text>{{item.amount}}</text></view>
						<view><text>状态</text><text>{{item.status == '1' ? '挂单中' : '已撤销'}}</text></view>
						<view><text>商家名称</text><text>{{item.buiness_name}}</text></view>
						<view><text>价格(CNY)</text><text>{{item.price}}</text></view>
						<view><text>发布时间</text><text>{{item.create_time}}</text></view>
					</view>
					<view class="cancelOrder" @click="cancelOrderEvent(item)" v-if="item.status == 1">撤销</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { accMul } from '../../../../utils/common.js'
	
	import { unimixin } from '../../../../utils/unimixin.js'
	
	export default {
		mixins: [ unimixin ],
		data(){
			return{
				managerList: ['买入USDT','卖出USDT'],
				choiceOn: 0,
				
				price: '',
				amount: '',
				total: '',
				type: '2',
				
				priceHolder: '买入估价 CNY',
				amountHolder: '买入数量 USDT',
				totalHolder: '金额 CNY',
				operaTxt: '立即买入',
				bussManagerList: [],
			}
		},
		onLoad() {

		},
		onNavigationBarButtonTap(e){
			if(e.float == 'left'){
				uni.reLaunch({
					url: '/pages/my/bussManager/bussManagerSetting',
					success: () => {}
				})
			}else{
				uni.reLaunch({
					url: '/pages/my/bussManager/legalBussManager/legalBussManagerOrder',
					success: () => {}
				})
			}
		},
		methods: {
			
			touchEnd(e){
				if(this.changeY > 50){
					this.getBussManagerList()
					
					this.paddingTop = 0
				}
			},
			

			cancelOrderEvent(item) {
				this.ajaxJson({
					url: '/api/v1/otcTrans/revokeTrans',
					method: 'POST',
					data: {trans_id: item.trans_id},
					call: (data)=>{
						if(data.code == 200){
							uni.showToast({
								title: data.msg,
								success: () => {
									this.getBussManagerList()
								}
							})
						}else{
							uni.showToast({
								image: '/static/images/wrong.png',
								title: data.msg,
								success: () => {}
							})
						}
					}
				})
			},
			bussOperaEvent(){
				if(!this.price || !this.amount){
					uni.showToast({
						image: '/static/images/wrong.png',
						title: '请输入估价或数量',
						success: () => {}
					})
				}else{
					let params = {
						market_id: '1',
						price: this.price,
						amount: this.amount,
						type: this.type,
					}
					this.ajaxJson({
						url: '/api/v1/otcTrans/publishTrans',
						method: 'POST',
						data: params,
						call: (data)=>{
							if(data.code == 200){
								uni.showToast({
									title: data.msg,
									success: () => {
										this.getBussManagerList()
										this.price = ''
										this.amount = ''
										this.total = ''
									}
								})
							}else{
								uni.showToast({
									image: '/static/images/wrong.png',
									title: data.msg,
									success: () => {}
								})
							}
						}
					})
				}
			},
			getBussManagerList(){
				this.ajaxJson({
					url: '/api/v1/otcTrans/transList',
					data: {trans_id: '1'},
					call: (data)=>{
						if(data.code == 200){
							this.bussManagerList = data.data.rows
						}
					}
				})
			},
			calcPrice(){
				this.calcAmount()
			},
			calcAmount(){
				if(this.price && this.amount){
					this.total = accMul(this.price, this.amount)
				}else{
					this.total = ''
				}
			},
			switchManager(itme, index){
				this.choiceOn = index
				this.price = ''
				this.amount = ''
				this.total = ''
				if(this.choiceOn == 0){
					this.priceHolder = '买入估价 CNY'
					this.amountHolder = '买入数量 USDT'
					this.type = '2'
					this.operaTxt = '立即买入'
				}else{
					this.priceHolder = '卖出估价 CNY'
					this.amountHolder = '卖出数量 USDT'
					this.type = '1'
					this.operaTxt = '立即卖出'
				}
			}
		},
		created() {
			this.getBussManagerList()
		}
	}
</script>

<style scoped lang="scss">
	.bussManager{
		.bussManagerArea{
			margin: 0 75rpx;
			.managerTit{
				margin: 60rpx 0 0;
				display: flex;
				font-size: 26rpx;
				view{
					margin-right: 15rpx;
					display: flex;
					align-items: flex-end;
				}
				view:nth-of-type(1){
					color: #3ba987;
				}
				view:nth-of-type(2){
					color: #b8393c;
				}
				view.choice{
					font-size: 40rpx;
				}
			}
			.managerIpt{
				margin-top: 20rpx;
				.priceIpt, .amountIpt, .totalIpt{
					border: 1px solid #999;
					border-radius: 6rpx;
					margin-top: 15rpx;
					input{
						height: 70rpx;
						font-size: 24rpx;
					}
				}
			}
			.bussTranNotice{
				margin-top: 20rpx;
				font-size: 24rpx;
				color: #999;
			}
			.bussOpera{
				margin-top: 20rpx;
				button{
					color: #fff;
					background-color: #3ba987;
				}
			}
		}
		.bussManagerList{
			.listTit{
				margin: 50rpx 30rpx 0;
				font-size: 24rpx;
				color: #999;
			}
			.managerList{
				margin-top: 20rpx;
				.listArea{
					padding-top: 20rpx;
					margin: 0 0 20rpx 0;
					background-color: #f2f2f2;
					.listAreaCon{
						display: flex;
						flex-wrap: wrap;
						justify-content: center;
						view{
							width: calc(calc(100% / 3) - 30rpx);
							display: flex;
							flex-direction: column;
							font-size: 26rpx;
							text-align: left;
							margin-bottom: 15rpx;
							text{
								white-space: nowrap;
							}
							text:nth-of-type(1){
								color: $c6;
							}
							text:nth-of-type(2){
								color: $c3;
							}
						}
					}
					.cancelOrder{
						display: flex;
						justify-content: flex-end;
						padding-right: 30rpx;
						padding-bottom: 20rpx;
						color: #B8393C;
						font-size: 30rpx;
					}
				}
			}
		}
	}
</style>
