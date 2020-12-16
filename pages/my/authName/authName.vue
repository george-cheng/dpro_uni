<template>
	<view class="authName mainBox">
		<view class="loginBox">
			<view class="loginIpt">
				<view>
					<input type="text" v-model="type" placeholder="请选择国家和地区" disabled>					
				</view>
				<view >
					<input type="text" v-model="IdType" placeholder="请选择您的证件类型" disabled>
					<span @click="downArrowEvent" class="iconLogin i-downArrow"></span>
					<view class="dropDownCOn" v-if="isDropdown">
						<text @click="historyEvent(item)" v-for="(item, index) in historyArr" :key="index">{{item}}</text>
					</view>
				</view>
				<view>
					<input type="text" v-model="name" placeholder="请输入您的姓名">
				</view>
				<view>
					<input type="text" v-model="no" placeholder="请输入您的证件号码">
				</view>
			</view>
		</view>
		<view class="loginBtn">
			<button @click="authNameEvent" type="default">下一步</button>
		</view>
		
		
		<uni-popup ref="popup" type="dialog">
			 <uni-popup-dialog :duration="2000" content="是否进行高级实名认证？" :before-close="true" @close="cancel" @confirm="confirm">
				 <view></view>
			 </uni-popup-dialog>
		</uni-popup>
		
		
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import { checkId } from '../../../utils/common.js'
	export default {
	 components: { uniPopup, uniPopupDialog },
		data(){
			return{
				type: '',
				userInfo: '',
				IdType: '居民身份证',
				name: '',
				no: '',
				isDropdown: false,
				historyArr: [
					'居民身份证',
					'护照'
				]
			}
		},
		onLoad() {

		},
		methods: {
			cancel(){
				this.$refs.popup.close()
				uni.switchTab({
					url: '/pages/my/my'
				})
			},
			confirm(){
				this.$refs.popup.close()
				uni.navigateTo({
					url: '/pages/my/authName/authDeepName'
				})
			},
			downArrowEvent(){
				this.isDropdown = !this.isDropdown
			},
			authNameEvent(){
				if(!this.name){
					uni.showToast({
						image: '../../../static/images/wrong.png',
						title: '请输入您的姓名',
					})
				}else if(!this.no || !checkId(this.no)){
					uni.showToast({
						image: '../../../static/images/wrong.png',
						title: '请输入您的证件号码或身份证号码错误',
					})
				}else{
					let params = { name: this.name, no: this.no, type: 0 }
					this.ajaxJson({
						url: '/api/v1/account/auth',
						method: 'POST',
						data: params,
						call: (data)=>{
							if(data.code == 200){
								uni.showToast({
									title: data.msg,
									success: () => {
										this.$refs.popup.open()
									}
								})
							}else{
								uni.showToast({
									image: '../../../static/images/wrong.png',
									title: data.msg
								})
							}
						}
					})
				}
			},
			historyEvent(item){
				this.isDropdown = false
				this.IdType = item
			},
			getInfoStroage(){
				uni.getStorage({
					key: 'userInfo',
					success: (data)=>{
						this.userInfo = data.data
						this.type = this.userInfo.country
					}
				})
			}
		},
		created() {
			this.getInfoStroage()
		}
	}
</script>

<style scoped lang="scss">
	.authName{
		.loginBtn{
			margin: 100rpx auto 0;
			width: 594rpx;
			button{
				background-color: #FF6153;
				color: #fff;
			}
		}
		.loginIpt{
			view{
				position: relative;
				input{
					margin: 68rpx 35rpx 0;
					height: 80rpx;
					border: 1px solid #676869;
					border-radius: 6px;
					color: #fff;
				}
				input:last-child{
					margin-top: 42rpx;
				}
				.dropDownCOn{
					width: 680rpx;
					margin: 0 auto;
					border: 1px solid #676869;
					border-radius: 6rpx;
					position: absolute;
					top: 96rpx;
					right: 35rpx;
					background-color: $bg;
					z-index: 2;
					text{
						padding: 0 5rpx;
						margin: 0 5rpx;
						display: flex;
						flex-wrap: wrap;
						color: #fff;
						line-height: 48rpx;
					}
				}
				.iconLogin{
					position: absolute;
					right: 70rpx;
					top: 25rpx;
				}
				.i-downArrow::before,.i-eye::before{
					color: #515151;
					font-size: 42rpx;
				}
			}
		}
	}
</style>
