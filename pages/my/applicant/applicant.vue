<template>
	<view class="applicant mainBox">
		<view class="applicantArea">
			<rich-text :nodes="certRule.synopsis"></rich-text>
		</view>
		<view class="applicantBtn" @click="isClick && applicantEvent(type)">
			<button>{{type == '2' ? '申请成为合约商家' : '申请成为法币商家'}}</button>
		</view>
	</view>
</template>

<script>
	import { unimixin } from '../../../utils/unimixin.js'
	export default {
		mixins: [ unimixin ],
		data(){
			return{
				certRule: '',
				type: ''
			}
		},
		onLoad(options) {
			this.type = options.type
		},
		onNavigationBarButtonTap(e){
			if(e.float == 'left'){
				uni.reLaunch({
					url: '/pages/my/applicant/applicantSetting',
					success: () => {}
				})
			}
		},
		methods: {
			applicantEvent(type){
				this.isClick =  false
				this.ajaxJson({
					url: '/api/v1/business/applyBusiness',
					method: 'POST',
					data: { merchant_type: type },
					call: (data)=>{
						this.isClick = true
						if(data.code == 200){
							uni.showToast({
								title: '已提交申请，待审核',
								success: () => {}
							})
							setTimeout(()=>{
								uni.reLaunch({
									url: '/pages/my/applicant/applicantSetting',
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
			},
			getApplicantInfo(){
				this.ajaxJson({
					url: '/api/v1/business/certRule',
					data: { type: this.type },
					call: (data)=>{
						if(data.code == 200){
							this.certRule = data.data
						}
					}
				})
			}
		},
		created() {
			this.getApplicantInfo()
		}
	}
</script>

<style scoped lang="scss">
	.applicant{
		.applicantArea{
			color: $c3;
			margin: 20rpx 30rpx 0;
		}
		.applicantBtn{
			margin: 150rpx 30rpx 0;
			button{
				background-color: #b8393c;
				color: #fff;
			}
		}
	}
</style>
