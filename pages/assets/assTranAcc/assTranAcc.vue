<template>
	<view class="assTranAcc mainBox">
		<view class="tranAcc">
			<view class="tranAccCon">
				<view class="accLft">币种</view>
				<view class="accRgt">
					<view class="accRgtName">{{this.forwardType.coin_name}}</view>
					<view class="accRgtArrow i-rgtArrow"></view>
				</view>
			</view>
		</view>
		<view class="tranAccIpt">
			<view class="tranAccCon">
				<view class="accLft">收款账户UID</view>
				<view class="accRgt">
					<view>
						<input type="text" placeholder="请输入对方UID" v-model="transferUid">
					</view>
					<view></view>
				</view>
			</view>
			<view class="tranAccCon">
				<view class="accLft">转账数量</view>
				<view class="accRgt">
					<view>
						<input type="text" placeholder="请输入转账数量" v-model="amount" @input="amountEvent">
					</view>
					<view class="accAll" @click="accAllEvent">全部</view>
				</view>
			</view>
			<view class="tranAccCon tranTotal">
				<view class="accLft">可用余额</view>
				<view class="accRgt"><view></view>
					<view class="accAll"> {{total}} {{forwardType.coin_name}}</view>
				</view>
			</view>
			<view class="tranAccCon">
				<view class="accLft">实际到账</view>
				<view class="accRgt">
					<view>{{actualTotal}} {{forwardType.coin_name}}</view>
					<view></view>
				</view>
			</view>
			<view class="tranAccCon">
				<view class="accLft">手续费</view>
				<view class="accRgt">
					<view>{{forwardType.fee}} {{forwardType.coin_name}}</view>
					<view></view>
				</view>
			</view>
		</view>
		
		<view class="tranAccTip">
			<view class="tranAccTipTit">提现须知</view>
			<view>支持金额：最低转账金额 {{forwardType.min_amount}} {{forwardType.coin_name}}。</view>
			<view>转账手续费：{{forwardType.fee}} {{forwardType.coin_name}}。</view>
		</view>
		
		<view class="assTranAccBtn" @click="isClick && assTranAccEvent()">
			<button>提交</button>
		</view>
		
		<uni-popup ref="popup" type="dialog">
		  <uni-popup-dialog iptType="password" title="交易密码" :duration="2000" mode="input" placeholder="请输入交易密码" :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
		
	</view>
</template>

<script>
	import { accAdd, accMul } from '../../../utils/common.js'
	import { unimixin } from '../../../utils/unimixin.js'
	import uniPopup from '../../../components/uni-popup/uni-popup.vue'
	import uniPopupDialog from '../../../components/uni-popup/uni-popup-dialog.vue'
	export default {
		mixins: [ unimixin ],
		components: { uniPopup, uniPopupDialog },
		data(){
			return{
				total: '',
				forwardType: '',
				
				transferUid: '',
				amount: '',
				actualTotal: '0',
				fee: '',
			}
		},
		onLoad(options) {
			this.total = options.total
		},
		onNavigationBarButtonTap(e){
			if(e.float == 'right'){
				uni.navigateTo({
					url: '/pages/assets/assTranAcc/assTranAccOrder?coinId=' + this.forwardType.coin_id,
					success: () => {}
				})
			}
		},
		methods: {
			close(){
				this.$refs.popup.close()
				this.isClick = true
			},
			confirm(done, value){
				let params = {
					forwardTypeId: this.forwardType.id,
					transferUid: this.transferUid,
					amount: this.amount,
					tradePwd: value,
				}
				this.ajaxJson({
					url: '/api/v1/transfer/forwardAccount',
					method: 'POST',
					data: params,
					call: (data)=>{
						this.isClick = true
						if(data.code == 200){
							uni.showToast({
								title: '转账成功',
								success: () => {}
							})
							setTimeout(()=>{
								uni.reLaunch({
									url: '/pages/assets/assets',
									success: () => {}
								})
							},500)
						}else if(data.code == 1045){
							uni.showToast({
								icon: 'none',
								title: '交易密码错误',
								success: () => {
									this.$refs.popup.close()
									this.isClick = true
								}
							})
						}
						else{
							uni.showToast({
								image: '/static/images/wrong.png',
								title: data.msg,
								success: () => {
									this.isClick = true
								}
							})
						}
					}
				})
			},
			assTranAccEvent(){
				this.isClick = false
				if(!this.transferUid || !this.amount){
					this.isClick = true
					uni.showToast({
						icon: 'none',
						title: '收款账户ID和转账数量不能为空'
					})
				}else if(this.amount < this.forwardType.min_amount){
					this.isClick = true
					uni.showToast({
						icon: 'none',
						title: '转账数量不能小于 ' + this.forwardType.min_amount + ' ' + this.forwardType.coin_name,
						success: () => {
							this.amount = ''
						}
					})
				}else{
					this.$refs.popup.open()
				}
			},
			accAllEvent(){
				this.amount = this.total
				this.amountEvent()
			},
			amountEvent(){
				if(this.amount >= this.forwardType.min_amount){
					this.actualTotal = accAdd(this.amount, accMul(this.forwardType.fee, -1))
				}else{
					this.actualTotal = '0'
				}
			},
			getForwardType(){
				this.ajaxJson({
					url: '/api/v1/transfer/forwardTypeList',
					call: (data)=>{
						if(data.code == 200){
							this.forwardType = data.data.rows[0]
						}
					}
				})
			}
		},
		created() {
			this.getForwardType()
		}
	}
</script>

<style scoped lang="scss">
	.assTranAcc{
		.tranAccIpt{
			margin-top: 20rpx !important;
			.tranTotal{
				.accLft{
					color: #999 !important;
				}
			}
			.tranAccCon{
				padding: 30rpx 0;
				border-bottom: 1px solid #f2f2f2;
			}
			.tranAccCon:last-child{
				border-bottom: none;
			}
		}
		.tranAcc, .tranAccIpt{
			margin: 10rpx 30rpx 0;
			.tranAccCon{
				display: flex;
				justify-content: space-between;
				.accLft{
					color: #999;
				}
				.accRgt{
					width: 490rpx;
					color: #999;
					display: flex;
					justify-content: space-between;
					.accAll{
						color: #999;
					}
				}
			}
		}
		.tranAccTip{
			margin: 30rpx;
			color: #fff;
			font-size: 24rpx;
			line-height: 38rpx;
			.tranAccTipTit{
				margin-bottom: 10rpx;
			}
		}
		.assTranAccBtn{
			margin: 300rpx 20rpx 0;
			button{
				background-color: #b8393c;
				color: #fff;
			}
		}
	}
</style>
