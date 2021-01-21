<template>
	<view class="my">
		<view class="perInfo">
			<view class="lft">
				<view class="userImg">
					<image src="../../static/logo.jpg" mode=""></image>
				</view>
			</view>
			<view class="rgt">
				<view class="rgtTop">
					<view class="rgtTopName">
						<text>昵称：{{userInfo.nick}}</text>
						<view class="userEdit i-edit" @click="changeNickName"></view>
						<view class="rgtTopId">UID：{{userInfo.id}}</view>
					</view>
					<text class="userName">{{userInfo.loginName}}</text>
				</view>
				<view class="rgtBtm">
					<view class="userAuthen userBtm" v-if="false">
						<view class="authenIcon i-excla"></view>
						<text>{{authTxt}}</text>
					</view>
					<view class="userGrade userBtm">
						<view class="gradeIcon i-grade"></view>
						<text v-if="userInfo.grade === 0">普通用户</text>
						<text v-if="userInfo.grade === 1">VIP</text>
						<text v-if="userInfo.grade !== 0 && userInfo.grade !== 1">VIP{{ parseInt( userInfo.grade ) -1 }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="perCon">
			<view  @click="myArrowEvent(0)">
				<view class="conLft">
					<view class="conIcon i-idAuth"></view>
					<text class="lftTit">身份认证</text>
				</view>
				<view class="conRgt">
					<text class="rgtInfo">{{authTxt}}</text>
					<view class="conIcon i-rgtArrow"></view>
				</view>
			</view>
			<view  @click="myArrowEvent(1)">
				<view class="conLft">
					<view class="conIcon i-security"></view>
					<text class="lftTit">安全中心</text>
				</view>
				<view class="conRgt">
					<text class="rgtInfo"></text>
					<view class="conIcon i-rgtArrow"></view>
				</view>
			</view>
			<view  @click="myArrowEvent(8)" v-if="false">
				<view class="conLft">
					<view class="conIcon i-security"></view>
					<text class="lftTit">个人中心</text>
				</view>
				<view class="conRgt">
					<text class="rgtInfo"></text>
					<view class="conIcon i-rgtArrow"></view>
				</view>
			</view>
			<view  @click="myArrowEvent(2)">
				<view class="conLft">
					<view class="conIcon i-invita"></view>
					<text class="lftTit">邀请返佣</text>
				</view>
				<view class="conRgt">
					<text class="rgtInfo"></text>
					<view class="conIcon i-rgtArrow"></view>
				</view>
			</view>
			<view  @click="myArrowEvent(3)">
				<view class="conLft">
					<view class="conIcon i-tran"></view>
					<text class="lftTit">收款方式</text>
				</view>
				<view class="conRgt">
					<text class="rgtInfo"></text>
					<view class="conIcon i-rgtArrow"></view>
				</view>
			</view>
			<view  @click="myArrowEvent(4)">
				<view class="conLft">
					<view class="conIcon i-order"></view>
					<text class="lftTit">申请商家</text>
				</view>
				<view class="conRgt">
					<text class="rgtInfo"></text>
					<view class="conIcon i-rgtArrow"></view>
				</view>
			</view>
			<view  @click="myArrowEvent(8)" v-if="isBussManager">
				<view class="conLft">
					<view class="conIcon i-bussManager"></view>
					<text class="lftTit">商家管理</text>
				</view>
				<view class="conRgt">
					<text class="rgtInfo"></text>
					<view class="conIcon i-rgtArrow"></view>
				</view>
			</view>
			<view  @click="myArrowEvent(9)">
				<view class="conLft">
					<view class="conIcon i-language"></view>
					<text class="lftTit">地址管理</text>
				</view>
				<view class="conRgt">
					<text class="rgtInfo"></text>
					<view class="conIcon i-rgtArrow"></view>
				</view>
			</view>
			<view  @click="myArrowEvent(5)" v-if="false">
				<view class="conLft">
					<view class="conIcon i-language"></view>
					<text class="lftTit">语言设置</text>
				</view>
				<view class="conRgt">
					<text class="rgtInfo">简体中文</text>
					<view class="conIcon i-rgtArrow"></view>
				</view>
			</view>
			<view  @click="myArrowEvent(6)" v-if="false">
				<view class="conLft">
					<view class="conIcon i-about"></view>
					<text class="lftTit">关于我们</text>
				</view>
				<view class="conRgt">
					<text class="rgtInfo"></text>
					<view class="conIcon"></view>
				</view>
			</view>
			<view  @click="myArrowEvent(7)">
				<view class="conLft">
					<view class="conIcon i-service"></view>
					<text class="lftTit">联系客服</text>
				</view>
				<view class="conRgt">
					<text class="rgtInfo"></text>
					<view class="conIcon i-rgtArrow"></view>
				</view>
			</view>
		</view>
		
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog title="修改昵称" :duration="2000" mode="input" placeholder="请输入昵称" :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
		
		<unitabbar :switchOn = "4"></unitabbar>
	</view>
</template>

<script>
	import uniPopup from '../../components/uni-popup/uni-popup.vue'
	import uniPopupDialog from '../../components/uni-popup/uni-popup-dialog.vue'
	import unitabbar from '../../components/uni-tarbar/tarBar.vue'
	import { unimixin } from '../../utils/unimixin.js'
	export default {
		components: { uniPopup, uniPopupDialog, unitabbar},
		mixins: [ unimixin ],
		data(){
			return {
				name: '',
				userInfo: '',
				nickIpt: '',
				qq: '2562095187',
				authTxt: '未认证',
				userSession: '',
				isBussManager: false
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.infoEvent()
		},
		methods: {
			changeNickName(){
				this.$refs.popup.open()
			},
			close(){
				this.$refs.popup.close()
			},
			confirm(done, value){
				if(!value){

				}else{
					this.ajaxJson({
						url: '/api/v1/account/modNickName',
						method: 'POST',
						data: { nickName: value },
						call: (data)=>{
							if(data.code == 200){
								this.$refs.popup.close()
								uni.showToast({
									title: '修改成功',
									success: () => {
										this.infoEvent()
									}
								})
							}else{
								uni.showToast({
									title: '修改失败',
								})
							}
						}
					})
				}
			},
			myArrowEvent(index){
				if(index == 0){
					if(this.userInfo.authDeep){
						uni.navigateTo({
							url: '/pages/my/authName/authDeepComplete'
						})
					}else{
						if(this.userInfo.authDeepPost){
							uni.navigateTo({
								url: '/pages/my/authName/authDeepLoad'
							})
						}else{
							if(this.userInfo.post){
								uni.navigateTo({
									url: '/pages/my/authName/authDeepName'
								})
							}else{
								uni.navigateTo({
									url: '/pages/my/authName/authName'
								})
							}
						}
					}
				}else if(index == 1){
					uni.navigateTo({
						url: '/pages/my/safeCenter/safeCenter',
						success: () => {
						}
					})
				}else if(index == 2){
					uni.reLaunch({
						url: './invitaIncome/invitaIncome?category=1'
					})
				}else if(index == 3){
					uni.navigateTo({
						url: '/pages/my/mySetting/payMethod',
						success: () => {}
					})
				}else if(index == 4){
					uni.reLaunch({
						url: '/pages/my/applicant/applicantSetting',
						success: () => {}
					})
				}
				else if(index == 7){
					plus.runtime.openURL('mqq://im/chat?chat_type=wpa&uin=' + this.qq + '&version=1&src_type=web ');
				}else if(index == 8){
					uni.reLaunch({
						url: '/pages/my/bussManager/bussManager',
						success: () => {}
					})
				}else if(index == 9){
					uni.reLaunch({
						url: '/pages/my/addressSetting/addressSetting',
						success: () => {}
					})
				}
			},
			infoEvent(){
				this.ajaxJson({
					url: '/api/v1/session',
					call: (data)=>{
						if(data.code == 200){
							uni.getStorage({
								key: 'userInfo',
								success: (data) => {
									this.name = data.data.loginName
									this.userInfo = data.data
									if(this.userInfo.authDeep){
										this.authTxt = '已高级认证'
									}else{
										if(this.userInfo.authDeepPost){
											this.authTxt = '已提交高级实名认证'
										}else{
											if(this.userInfo.post){
												this.authTxt = '初级认证'
											}else{
												this.authTxt = '未认证'
											}
										}
									}
								}
							})
						}
					}
				})
			},
			upDateSessionFront(){
				this.ajaxJson({
					url: '/api/v1/frontSession',
					call: (data)=>{
						this.userSession = data.data
						if(this.userSession.otcType == 1){
							this.isBussManager = true
						}else{
							this.isBussManager = false
						}
						uni.setStorage({
							key: 'userSession',
							data: data.data
						})
					}
				})
			}
				
		},
		onNavigationBarButtonTap(e) {
			if (e.float == 'right') {
				uni.reLaunch({
					url: './mySetting'
				})
			}
		},
		created() {
			this.infoEvent()
			this.upDateSessionFront()
		}
	}
</script>

<style scoped lang="scss">
.my{
	background-color: #fff;
	.perInfo{
		height: 170rpx;
		padding: 0 40rpx;
		background-color: #f2f2f2;
		display: flex;
		.lft{
			float: left;
			.userImg{
				display: flex;
				align-items: center;
				justify-content: center;
				line-height: 170rpx;
				margin-top: 30rpx;
				width: 110rpx;
				height: 110rpx;
				image{
					width: 80%;
					height: 80%;
					border-radius: 50%;
				}
			}
		}
		.rgt{
			margin-top: 45rpx;
			float: left;
			.rgtTop{
				display: flex;
				flex-direction: column;
				font-size: 24rpx;
				.rgtTopName{
					display: flex;
					flex-direction: row;
					align-items: center;
					color: $c3;
				}
				.userName{
					color: $c3;
					font-size: 30rpx;
					line-height: 30rpx;
					margin-top: 10rpx;
				}
				.userEdit{
					margin-left: 10rpx;
					color: $c3;
					display: flex;
					flex-wrap: nowrap;
				}
				.rgtTopId{
					margin-left: 20rpx;
				}
			}
			.rgtBtm{
				margin-top: 20rpx;
				display: flex;
				.userBtm{
					color: $c3;
					font-size: 22rpx;
					line-height: 22rpx;
					view{
						margin-right: 5rpx;
					}
				}
				.userAuthen{
					display: flex;
				}
				.userGrade{
					// margin-left: 20rpx;
					display: flex;
					font-size: 28rpx;
					.gradeIcon{
						margin-right: 10rpx;
					}
				}
			}
		}
	}
	.perCon>view{
		border-bottom: 1px solid #f2f2f2;
	}
	.perCon{
		background-color: #fff;
		margin-top: 12rpx;
		view{
			height: 112rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 0 10rpx;
			color: #f2f2f2;
			.conLft{
				color: $c3;
			}
			.conRgt{
				color: #999;
				.conIcon::before{
					color: #999;
				}
				.i-rgtArrow:before{
					color: #999;
				}
			}
		}
		view:first-child{
			border-top: none;
		}
	}
	
	.i-idAuth:before,.i-security:before,.i-invita:before,.i-tran:before,.i-order:before,.i-bussManager:before,.i-language:before,.i-about::before,.i-service::before{
		color: #999;
	}
}
</style>
