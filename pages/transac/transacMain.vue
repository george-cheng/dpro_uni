<template>
	<view>
	<view class="transacMain mainBox">
		<view class="tranTit">
			<view class="" v-for="(item, index) in tranNavList" :key="index" @click="tranNavEvent(item, index)" :class="{choiceTran: choiceOn == index}">{{item.name}}</view>
		</view>
	</view>
	
	<template v-if="choiceOn == 0">
			<transac :moneyData="moneyData" :quotatList="quotatList"></transac>
	</template>
	
	<template v-if="choiceOn == 1">
			<tranContract></tranContract>
	</template>
	

	<template v-if="choiceOn == 2">
		<tranLegal />
	</template>

	</view>
</template>
<script>
	
	import transac from './transac'
	import tranLegal from './tranLegal'
	import tranContract from './tranContract/tranContract'
	
	export default {
		components: { transac, tranLegal, tranContract },
		
		data(){
			return{
				choiceOn: 0,
				tranNavList: [{name: '币币交易'},{name: '合约交易'},{name: '法币交易'}],
				moneyData: [],
				quotatList: [],
			}
		},
		onLoad(options) {
			
		},
		onShow(){
			uni.getStorage({
				key: 'quickIndex',
				success: (data)=>{
					this.choiceOn = data.data
				}
			})
			uni.getStorage({
				key: 'moneyData',
				success: (data) => {
					this.moneyData = data.data
				}
			}),
			uni.getStorage({
				key: 'quotatList',
				success: (data) => {
					this.quotatList = data.data
				}
			})
		},
		onHide() {
			// uni.removeStorage({
			// 	key: 'quickIndex'
			// }),
			uni.removeStorage({
				key: 'moneyData'
			}),
			uni.removeStorage({
				key: 'quotatList'
			})
		},
		onTabItemTap(e) {
			if(e.index == 2){
				this.choiceOn = 0
			}
		},
		methods: {
			tranNavEvent(item, index){
				this.choiceOn = index
			}
		},
		created() {
			
		}
	}
</script>

<style scoped lang="scss">

	.transacMain{
		.tranTit{
			display: flex;
			justify-content: space-between;
			margin: 0 100rpx;
			view{
				color: #7E7C8A;
				font-size: 28rpx;
				line-height: 56rpx;
			}
			view.choiceTran{
				position: relative;
			}
			view.choiceTran:after{
				content: '';
				display: inline-block;
				position: absolute;
				text-align: center;
				left: 0;
				bottom: 0;
				width: 100%;
				height: 6rpx;
				border-radius: 2rpx;
				background-color: #fff;
			}
		}
	}

</style>
