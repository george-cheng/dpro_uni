<template>
	<view class="transfer mainBox">
		<view class="transferIpt">
			<input type="number" v-model="amount" placeholder="请输入划转数量">
		</view>
		<view class="transferBtn">
			<button type="default" @click="transferEvent">划转</button>
		</view>
	</view>
</template>

<script>
	import { checkNum } from '../../utils/common.js'
	export default {
		data(){
			return{
				amount: '',
				id: '',
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		methods: {
			transferEvent(){
				if(checkNum(this.amount)){
					uni.showToast({
						image: '../../static/images/wrong.png',
						title: '划转数量输入不正确，请重新输入',
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
										uni.switchTab({
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
		.transferIpt{
			input{
				margin: 20rpx auto 0;
				width: 640rpx;
				height: 80rpx;
				border: 1px solid #676869;
				border-radius: 6px;
				color: #fff;
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
