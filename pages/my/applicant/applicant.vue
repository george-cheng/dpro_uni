<template>
	<view class="applicant mainBox">
		<view class="applicantArea">
			<rich-text :nodes="certRule.synopsis"></rich-text>
		</view>
		<view class="applicantBtn" @click="applicantEvent(userSession.otcType)">
			<button>{{userSession.otcType == 0 ? '申请成为商家' : '撤销'}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				userSession: '',
				certRule: '',
				applicantBtn: '申请成为商家',
			}
		},
		onLoad() {

		},
		onNavigationBarButtonTap(e){
			if(e.float == 'left'){
				uni.reLaunch({
					url: '/pages/my/my',
					success: () => {}
				})
			}
		},
		methods: {
			applicantEvent(otcType){
				if(otcType == 0){
					this.ajaxJson({
						url: '/api/v1/merchant/applyMerchant',
						method: 'POST',
						call: (data)=>{
							if(data.code == 200){
								uni.showToast({
									title: '已提交申请，待审核',
									success: () => {}
								})
								setTimeout(()=>{
									uni.reLaunch({
										url: '/pages/my/my',
										success: () => {}
									})
								},1000)
							}else{
								uni.showToast({
									image: '/static/images/wrong.png',
									title: data.msg,
									success: () => {}
								})
							}
						}
					})
				}else{
					this.ajaxJson({
						url: '/api/v1/merchant/revokeMerchant',
						method: 'POST',
						call: (data)=>{
							if(data.code == 200){
								uni.showToast({
									title: '已提交申请，待审核'
								})
								setTimeout(()=>{
									uni.reLaunch({
										url: '/pages/my/my',
										success: () => {}
									})
								},1000)
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
			getApplicantInfo(){
				this.ajaxJson({
					url: '/api/v1/merchant/certRule',
					call: (data)=>{
						if(data.code == 200){
							this.certRule = data.data

						}else{
							uni.showToast({
								image: '/static/images/wrong.png',
								title: data.msg
							})
						}
					}
				})
			},
			getFrontSession(){
				this.ajaxJson({
					url: '/api/v1/frontSession',
					call: (data)=>{
						this.userSession = data.data
						if(this.userSession.otcType == 0){
							uni.setNavigationBarTitle({
									title: '申请商家',
									success: () => {
								}
							});
						}else{
							uni.setNavigationBarTitle({
									title: '撤销商家',
									success: () => {
								}
							});
						}
						uni.setStorage({
							key: 'userSession',
							data: data.data
						})
					}
				})
			}
		},
		created() {
			this.getFrontSession()
			this.getApplicantInfo()
		}
	}
</script>

<style scoped lang="scss">
	.applicant{
		.applicantArea{
			color: #fff;
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
