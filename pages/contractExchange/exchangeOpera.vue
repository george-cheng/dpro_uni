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
		<view class="operaDetail">
			<view class="goodsDetail">
				<view class="detailLft">
					<image :src="url + detailInfo.desc_diagram" mode="aspectFit"></image>
				</view>
				<view class="detailRgt">
					<view class="remarks">{{detailInfo.remarks}}</view>
					<view class="rgtDetail">
						<view class="detailPrice">{{detailInfo.price}} USDT</view>
						<view class="goodsNum">商品编号：{{detailInfo.gid}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="contract" v-if="isTreaty">
			<view class="contractTit">已抢购合约</view>
			<view class="contractList">
				<view v-for="(item, index) in treatyInfo" :key="index" @click="choiceContract(item, index)">
					<view class="treatyImg">
						<image :src="url + item.treatyType.logo" mode="aspectFit"></image>
					</view>
					<view class="listName">{{item.treaty_name}}</view>
					<view class="listAmount">{{ parseInt(accMul(item.ded_amount, item.out_mult))}}</view>
					<view class="listState">未激活</view>
					<view class="contractIcon i-cCheck" :class="{'i-cChecked': treatyIndex.indexOf(index)>-1}"></view>
				</view>
			</view>
		</view>
		<view class="remarksSize">
			<view class="remarksSizeTit">订单备注</view>
			<textarea v-model="remarksSize" maxlength="-1" value="" placeholder="请备注商品的规格、尺寸、颜色等信息" />
		</view>
		<view class="uniBtn" @click="isClick && confirmExchangeEvent()">
			<view>确认兑换</view>
		</view>
	</view>
</template>

<script>
	import { unimixin } from '../../utils/unimixin.js'
	import { accMul } from '../../utils/common.js'
	export default {
		mixins: [ unimixin ],
		data(){
			return{
				id: '',
				gid: '',
				addressInfo: '',
				detailInfo: '',
				isAddress: true,
				treatyInfo: [],
				treatyIndex: [],
				treatyPurce: [],
				treatyPurceId: [],
				treatyPurceIdArr: [],
				isDefault: true,
				isTreaty: false,
				remarksSize: ''
			}
		},
		onLoad(options) {
			this.gid = options.gid
			this.id = options.id
			if(this.id){
				this.isDefault = false
			}
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
			confirmExchangeEvent(){
				this.isClick = false
				if(this.treatyPurceId.length == 0){
					uni.showToast({
						icon: 'none',
						title: '请选择已抢购合约',
						success: () => {}
					})
					this.isClick = true
				}else{
					let params = {
						treatyPurceId: this.treatyPurceId,
						gid: this.gid,
						remarks: this.remarksSize,
						addressId: this.addressInfo.id,
					}
					this.ajaxJson({
						url: '/api//v1/treatyCashGoods/cashByStr',
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
										url: '/pages/contractExchange/exchangeMallRecord',
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
						if(data.code == 200){
							this.isTreaty = true
							this.treatyInfo = data.data.rows
						}else{
							this.isTreaty = false
						}
					}
				})
			},
			getAddressInfo(){
				
				let url = ''
				let params = {}
				if(this.isDefault){
					url = '/api/v1/receiveAddress/default'
					params = { }
				}else{
					url = '/api/v1/receiveAddress/byId'
					params = { id: this.id }
				}
				
				this.ajaxJson({
					url: url,
					data: params,
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
			},
			choiceContract(item, index){
				let arrIndex = this.treatyIndex.indexOf(index)
				if(arrIndex > -1){
					this.treatyIndex.splice(arrIndex, 1)
					this.treatyPurce.splice(arrIndex,1)
				}else{
					this.treatyIndex.push(index)
					this.treatyPurce.push(item.id)
				}
				let str = ''
				for(let i in this.treatyPurce){
					str += this.treatyPurce[i]+','
				}
				
				if(str.indexOf(',') > -1){
					this.treatyPurceId = str.substring(0, str.length - 1 )
				}
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
		.operaDetail{
			margin-top: 20rpx;
			background-color: #f7f7f7;
			padding: 56rpx 30rpx 20rpx;
			.goodsDetail{
				display: flex;
				.detailLft{
					width: 300rpx;
					height: 300rpx;
					background-color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					image{
						width: 80%;
						height: 80%;
					}
				}
				.detailRgt{
					margin-left: 20rpx;
					position: relative;
					.remarks{
						width: 360rpx;
					}
					.rgtDetail{
						position: absolute;
						bottom: 0;
						.detailPrice{
							color: #b8393c;
						}
					}
				}
			}
		}
		.contract{
			background-color: #f7f7f7;
			margin-top: 20rpx;
			padding: 20rpx 30rpx;
			.contractList{
				margin-top: 20rpx;
			}
			.contractList>view{
				padding: 10rpx 20rpx;
				border: 1px solid #d9d9d9;
				margin-bottom: 20rpx;
				border-radius: 6rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: $c9;
				.treatyImg{
					width: 38rpx;
					height: 44rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.contractIcon::before{
					color: #666;
				}
				.i-cChecked:before{
					color: #f00;
				}
			}
		}
		.remarksSize{
			margin-top: 20rpx;
			.remarksSizeTit{
				margin: 0 30rpx;
				margin-top: 20rpx;
				padding: 10rpx 0;
			}
			text-indent: 0.5em;
			font-size: 30rpx;
			color: $c9;
			textarea{
				margin: 0 30rpx;
				border-radius: 8rpx;
				border: 1px solid #d9d9d9;
				padding-top: 10rpx;
				height: 100rpx;
				width: auto;
			}
		}

	}
</style>
