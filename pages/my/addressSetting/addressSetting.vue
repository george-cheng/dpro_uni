<template>
	<view class="addressSetting">
		<view class="addressArea">
			<uni-swipe-action>
				<uni-swipe-action-item v-for="(item, index) in addressInfo" :key="index" :right-options="operaList"  @change="swipeChange($event, index)" @click="swipeClick($event, item)">
					<view class="addressAreaList" @click="getAddressEvent(item)">
						<view class="areaLft">
							<view class="area">{{item.area}}</view>
							<view class="fullAddress">{{item.full_address}}</view>
							<view class="personInfo">
								{{item.name}} &nbsp; {{item.phone.toString().replace(/(\d{3})\d{4}(\d{4})/g, '$1****$2')}}
							</view>
						</view>
						<view class="areaRgt">
							<view class="rgtEdit i-edit" @click.stop="addressEdit(item)"></view>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>
		<view class="addAddressBtn" @click="addAddressEvent()">
			<view>添加收货地址</view>
		</view>
	</view>
</template>

<script>
	
	import { uniSwipeAction } from '../../../components/uni-swipe-action/uni-swipe-action.vue'
	import { uniSwipeActionItem } from '../../../components/uni-swipe-action-item/uni-swipe-action-item.vue'
	
	export default {
		data(){
			return{
				addressInfo: [],
				category: '',
				gid: '',
				operaList: [{
					icon: 'i-delete',
					style: {
						iconColor: '#fff',
						backgroundColor: '#b8393c'
					}
				}]
			}
		},
		onLoad(options) {
			this.category = options.category
			this.gid = options.gid
		},
		onNavigationBarButtonTap(e) {
			if(e.float == 'left') {
				if(this.category == 1){
					uni.reLaunch({
						url: '/pages/contractExchange/exchangeOpera?gid=' + this.gid,
						success: () => {}
					})
				}else{
					uni.reLaunch({
						url: '/pages/my/my',
						success: () => {}
					})
				}
			}
		},
		methods: {
			addressEdit(item){
				uni.reLaunch({
					url: '/pages/my/addressSetting/editAddress?id=' + item.id + '&category=' + this.category+ '&gid=' + this.gid,
					success: () => {}
				})
			},
			addAddressEvent(){
				uni.reLaunch({
					url: '/pages/my/addressSetting/addAddress?category=' + this.category+ '&gid=' + this.gid,
					success: () => {}
				})
			},
			initAddress(){
				this.ajaxJson({
					url: '/api/v1/receiveAddress/list',
					data: { page: '1', pageSize: '10' },
					call: (data)=>{
						if(data.code == 200){
							this.addressInfo = data.data.rows
						}else{
							this.addressInfo = []
						}
					}
				})
			},
			swipeClick(e, item){
				this.ajaxJson({
					url: '/api/v1/receiveAddress/remove',
					method: 'POST',
					data: { id: item.id },
					call: (data)=>{
						if(data.code == 200){
							uni.showToast({
								title: data.msg,
								success: () => {}
							})
							this.initAddress()
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
			swipeChange(e, index) {
				
			},
			getAddressEvent(item){
				if(this.category == 1){
					uni.reLaunch({
						url: '/pages/contractExchange/exchangeOpera?id=' + item.id + '&gid=' + this.gid,
						success: () => {}
					})
				}
			}
		},
		created() {
			this.initAddress()
		}
	}
</script>

<style scoped lang="scss">
	.addressSetting{
		margin-top: 30rpx;
		.addressArea>view>.uni-swipe{
			margin-bottom: 20rpx;
		}
		.addressAreaList{
			background-color: #f7f7f7;
			padding: 20rpx 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.areaLft{
				width: 550rpx;
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
			.areaRgt{
				margin-left: 110rpx;
				.rgtEdit:before{
					color: #666;
				}
			}
		}
		.addAddressBtn{
			position: fixed;
			bottom: 30rpx;
			left: 0;
			right: 0;
			margin: auto;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 600rpx;
			height: 80rpx;
			color: #fff;
			border-radius: 6rpx;
			background-color: #b8393c;

		}
	}
</style>
