<template>
	<view class="addAddress">
		<view class="addAddressArea">
			<view class="areaIpt">
				<view>收货人</view>
				<input class="iptName" type="text" v-model="name" placeholder="请填写收货人姓名">
			</view>
			<view class="areaIpt">
				<view>手机号码</view>
				<input type="number" v-model="phone" @blur="phoneBlurEvent" placeholder="请填写收货人手机号">
			</view>
			<view class="areaIpt">
				<view>所在地区</view>
				<input type="text" v-model="area" placeholder="省市区县、乡镇等">
			</view>
			<view class="areaIpt">
				<view>详细地址</view>
				<input type="text" v-model="full_address" placeholder="街道、楼牌号等">
			</view>
		</view>
		<view class="addressDefault">
			<view class="defaultLft">
				<view class="lftTit">设置默认地址</view>
				<view class="lftTxt">提醒：每次下单会默认推荐使用该地址</view>
			</view>
			<view class="defaultRgt">
				 <view class="uni-list-cell uni-list-cell-pd" style="transform:scale(0.7)">
						<switch :checked="defaultState" @change="switchEvent" />
				</view>
			</view>
		</view>
		<view class="addAddressBtn" @click="isClick && addAddressEvent()">
			<view>修改</view>
		</view>
	</view>
</template>

<script>
	import { checkPhone } from '../../../utils/common.js'
	import { unimixin } from '../../../utils/unimixin.js'
	export default {
		mixins: [ unimixin ],
		data(){
			return{
				id: '',
				gid: '',
				
				name: '',
				phone: '',
				area: '',
				full_address: '',
				default_state: '1',
				defaultState: false,
				
				isValidator: false,
				category: '',
			}
		},
		onLoad(options) {
			this.id = options.id
			this.gid = options.gid
			this.category = options.category
		},
		onNavigationBarButtonTap(e) {
			if(e.float == 'left') {
				uni.reLaunch({
					url: '/pages/my/addressSetting/addressSetting?category=' + this.category+ '&gid=' + this.gid,
					success: () => {}
				})
			}
		},
		methods: {
			addAddressEvent(){
				this.isClick = false
				let params = {
					id: this.id,
					name: this.name,
					phone: this.phone,
					area: this.area,
					full_address: this.full_address,
					default_state: this.default_state,
				}
				this.validator()
				if(this.isValidator){
					this.ajaxJson({
						url: '/api/v1/receiveAddress/update',
						method: 'POST',
						data: params,
						call: (data)=>{
							this.isClick = true
							if(data.code == 200){
								uni.showToast({
									icon: 'none',
									title: data.msg,
									success: () => {}
								})
								setTimeout(()=>{
									uni.reLaunch({
										url: '/pages/my/addressSetting/addressSetting?category=' + this.category+ '&gid=' + this.gid,
										success: () => {}
									})
								},500)
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
			getAddress(){
				this.ajaxJson({
					url: '/api/v1/receiveAddress/byId',
					data: { id: this.id},
					call: (data)=>{
						if(data.code == 200){
							this.name = data.data.name
							this.phone = data.data.phone
							this.area = data.data.area
							this.full_address = data.data.full_address
							let defaultState = this.default_state = data.data.default_state
							if(defaultState == '2'){
								this.defaultState = true
							}else{
								this.defaultState = false
							}
						}
					}
				})
			},
			phoneBlurEvent(){
				if(!checkPhone(this.phone)){
					this.phone = ''
					uni.showToast({
						icon: 'none',
						title: '手机格式有误，请重新填写'
					})
				}else{
					
				}
			},
			switchEvent(e){
				if(e.target.value){
					this.default_state = '2'
				}else{
					this.default_state = '1'
				}
			},
			validator(){
				if(!this.name){
					uni.showToast({
						icon: 'none',
						title: '请输入收货人姓名',
						success: () => {}
					})
					this.isValidator = false
				}else if (!this.phone){
					uni.showToast({
						icon: 'none',
						title: '请填写收货人手机号',
						success: () => {}
					})
					this.isValidator = false
				}else if(!this.area){
					uni.showToast({
						icon: 'none',
						title: '请填写省市区县、乡镇等',
						success: () => {}
					})
					this.isValidator = false
				}else if(!this.full_address){
					uni.showToast({
						icon: 'none',
						title: '请填写街道、楼牌号等',
						success: () => {}
					})
					this.isValidator = false
				}else {
					this.isValidator = true
				}
			},
		},
		created() {
			this.getAddress()
		}
	}
</script>

<style scoped lang="scss">
	.addAddress{
		.addAddressArea{
			margin: 20rpx  0;
			padding: 0 30rpx;
			background-color: #f2f2f2;
			.areaIpt{
				display: flex;
				flex-direction: row;
				padding-top: 20rpx;
				padding-bottom: 20rpx;
				border-bottom: 1px solid #f7f7f7;
				font-size: 30rpx;
				view{
					color: #333;
				}
				input{
					margin-left: 20rpx;
					font-weight: bold;
					color: #333;
					font-size: 26rpx;
				}
				.iptName{
					margin-left: 50rpx;
				}
			}
		}
		.addressDefault{
			background-color: #f2f2f2;
			padding: 20rpx 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.defaultLft{
				.lftTit{
					font-size: 26rpx;
				}
				.lftTxt{
					font-size: 24rpx;
					margin-top: 10rpx;
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
