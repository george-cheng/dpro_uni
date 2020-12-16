<template>
	<view class="my">
		<view class="perInfo">
			<view class="lft">
				<view class="userImg">
					<image src="../../static/logo.png" mode=""></image>
				</view>
			</view>
			<view class="rgt">
				<view class="rgtTop">
					<text class="userName">{{userInfo.loginName}}</text>
					<view class="userEdit i-edit"></view>
				</view>
				<view class="rgtBtm">
					<view class="userAuthen userBtm">
						<view class="authenIcon i-excla"></view>
						<text>{{authTxt}}</text>
					</view>
					<view class="userGrade userBtm">
						<view class="gradeIcon i-grade"></view>
						<text>MXC大客户</text>
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
					<text class="lftTit">交易挖矿</text>
				</view>
				<view class="conRgt">
					<text class="rgtInfo"></text>
					<view class="conIcon"></view>
				</view>
			</view>
			<view  @click="myArrowEvent(4)">
				<view class="conLft">
					<view class="conIcon i-order"></view>
					<text class="lftTit">我的订单</text>
				</view>
				<view class="conRgt">
					<text class="rgtInfo"></text>
					<view class="conIcon"></view>
				</view>
			</view>
			<view  @click="myArrowEvent(5)">
				<view class="conLft">
					<view class="conIcon i-language"></view>
					<text class="lftTit">语言设置</text>
				</view>
				<view class="conRgt">
					<text class="rgtInfo">简体中文</text>
					<view class="conIcon i-rgtArrow"></view>
				</view>
			</view>
			<view  @click="myArrowEvent(6)">
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
					<view class="conIcon"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				name: '',
				userInfo: '',
				authTxt: '未认证'
			}
		},
		onLoad() {

		},
		onShow() {
			this.infoEvent()
		},
		methods: {
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
						url: '../personal/safeCenter/safeCenter',
						success: () => {
							
						}
					})
				}else if(index == 2){
					uni.navigateTo({
						url: './invitaIncome/invitaIncome'
					})
				}
			},
			infoEvent(){
				this.ajaxJson({
					url: '/api/v1/session',
					call: (data)=>{
						if(data.code == 200){
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
							
							uni.setStorage({
								key: 'userInfo',
								data: data.data
							})
						}
					}
				})
			},
		},
		onNavigationBarButtonTap(e) {
			if (e.float == 'right') {
				uni.navigateTo({
					url: './mySetting'
				})
			}
		},
		created() {
			this.infoEvent()
		}
	}
</script>

<style scoped lang="scss">
.my{
	background-color: #282828;
	.perInfo{
		height: 170rpx;
		padding: 0 40rpx;
		background-color: #303030;
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
				background-color: #303030;
				image{
					width: 50%;
					height: 50%;
					border-radius: 50%;
				}
			}
		}
		.rgt{
			margin-top: 45rpx;
			float: left;
			.rgtTop{
				display: flex;
				.userName{
					color: #fff;
					font-size: 30rpx;
					line-height: 30rpx;
				}
				.userEdit{
					margin-left: 10rpx;
					color: #fff;
				}
			}
			.rgtBtm{
				margin-top: 30rpx;
				display: flex;
				.userBtm{
					color: #676869;
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
					margin-left: 20rpx;
					display: flex;
				}
			}
		}
	}
	.perCon{
		background-color: #303030;
		margin-top: 12rpx;
		view{
			height: 112rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 0 10rpx;
			color: #fff;
			border-top: 1px solid #383838;
			.conLft{
				
			}
			.conRgt{
				.conIcon{
					
				color: #676869;
				}
			}
		}
		view:first-child{
			border-top: none;
		}
	}
}
</style>
