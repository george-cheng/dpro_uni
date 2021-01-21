<template>
	<view class="exchangeOpera">
		<view class="addressArea" @click="choiceAddressEvent()">
			<view class="addressInfo">
				<view class="area" v-if="isAddress">{{addressInfo.area}}</view>
				<view class="fullAddress" v-if="isAddress">{{addressInfo.full_address}}</view>
				<view class="personInfo" v-if="isAddress">
					{{addressInfo.name}} &nbsp; {{addressInfo.phone.toString().replace(/(\d{3})\d{4}(\d{4})/g, '$1****$2')}}
				</view>
			</view>
			<view class="addressChoice" v-if="true">
				<view class="i-rgtArrow"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				gid: '',
				addressInfo: '',
				isAddress: true,
			}
		},
		onLoad(options) {
			this.gid = options.gid
		},
		onNavigationBarButtonTap(e) {
			if(e.float == 'left') {
				uni.reLaunch({
					url: '/pages/contractExchange/goodsDetail?gid=' + this.gid,
					success: () => {}
				})
			}
		},
		methods: {
			getGoodsDetailInfo(){
				this.ajaxJson({
					url: '/api/v1/treatyCashGoods/byId',
					data: { gid: this.gid },
					call: (data)=>{
						if(data.code == 200){
							this.detailInfo = data.data
						}
					}
				})
			},
			getTreatyInfo(){
				this.ajaxJson({
					url: '/api/v1/purchTreatyLog/list',
					data: { purchState: '1', activateState: '0',  page: '1', pageSize: '10'},
					call: (data)=>{
						console.log(data)
					}
				})
			},
			getAddressInfo(){
				this.ajaxJson({
					url: '/api/v1/receiveAddress/default',
					call: (data)=>{
						if(data.code == 200){
							this.addressInfo = data.data
						}else{
							this.isAddress = false
						}
					}
				})
			},
			choiceAddressEvent(){
				uni.reLaunch({
					url: '/pages/my/addressSetting/addressSetting?category=1' + '&gid=' + this.gid,
					success: () => {}
				})
			}
		},
		created() {
			this.getTreatyInfo()
			this.getGoodsDetailInfo()
			this.getAddressInfo()
		}
	}
</script>

<style scoped lang="scss">
	.exchangeOpera{
		.addressArea{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 30rpx;
			padding: 20rpx 30rpx;
			background-color: #f7f7f7;
			.addressInfo{
				width: 550rpx;
				height: 200rpx;
				.area{
					font-size: 24rpx;
					color: $c6;
				}
				.fullAddress{
					margin-top: 20rpx;
					font-size: 30rpx;
					color: $c3;
					font-weight: bold;
				}
				.personInfo{
					margin-top: 20rpx;
					font-size: 26rpx;
					color: $c6;
				}
			}
		}
	}
</style>
