<template>
	<view class="transfer mainBox">
		<view class="transferTotal">可用余额：{{total}} DPC</view>
		<view class="transferIpt">
			<input type="number" v-model="amount" placeholder="请输入兑换数量" @input="amountCalc">
		</view>
		<view class="transferRate">
			<view class="transferExchange">DPC：{{lastDealPrize}}</view>
			<view class="transferResult" v-if="amount">≈ {{transferResult}}</view>
		</view>
		<view class="transferBtn">
			<button type="default" @click="transferEvent">兑换</button>
		</view>
		
	</view>
</template>

<script>
	import { checkNum, accMul } from '../../utils/common.js'
	export default {
		data(){
			return{
				amount: '',
				id: '',
				total: '',
				lastDealPrize: '',
				transferResult: '0',
			}
		},
		onLoad(options) {
			this.id = options.id
			this.total = options.total
			this.lastDealPrize = options.lastDealPrize
		},
		methods: {
			amountCalc(){
				this.transferResult = accMul(this.lastDealPrize, this.amount).toFixed(2)
			},
			transferEvent(){
				if(checkNum(this.amount)){
					uni.showToast({
						image: '../../static/images/wrong.png',
						title: '兑换数量输入不正确，请重新输入',
						success: () => {
							this.amount = ''
						}
					})
				}else{
					this.ajaxJson({
						url: '/api/v1/convertUsd',
						method: 'POST',
						data: {fvid: this.id, amount: this.amount},
						call: (data)=>{
							if(data.code == 200){
								uni.showToast({
									title: data.msg,
									success: () => {
										uni.reLaunch({
											url: '/pages/assets/assets'
										})
									}
								})
							}else{
								uni.showToast({
									image: '../../static/images/wrong.png',
									title: data.msg
								})
							}
						}
					})
				}
			}
		},
		created() {

		}
	}
</script>

<style scoped lang="scss">
	.transfer{
		
		.transferTotal{
			margin: 20rpx 50rpx;
			color: #999;
			font-size: 24rpx;
		}
		
		.transferRate{
			display: flex;
			justify-content: space-between;
			margin: 20rpx 50rpx;
			color: #999;
			font-size: 24rpx;
		}
		.transferIpt{
			input{
				margin: 20rpx auto 0;
				width: 640rpx;
				height: 80rpx;
				border: 1px solid #676869;
				border-radius: 6px;
				color: #999;
			}
		}
		.transferBtn{
			margin: 50rpx 80rpx;
			button{
				font-size: 24rpx;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				white-space: nowrap;
				background-color: #ED6B58;
				color: #fff;
			}
		}
	}
</style>
