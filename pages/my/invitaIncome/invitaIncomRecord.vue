<template>
	<view class="invitaIncomOrder mainBox" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
		<view class="tractCon">
			<view class="enConList">
				<view class="enList" v-for="(item, index) in invitaIncomList" :key="index">
					<view><text>用户ID</text><text>{{item.fid}}</text></view>
					<view><text>用户登录名</text><text>{{item.floginName}}</text></view>
					<view><text>注册日期</text><text>{{getLocalTime(item.fregisterTime)}}</text></view>
					<view><text>是否实名认证</text><text>{{item.fIdentityStatus === 2 ? '已实名' : '未实名'}}</text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
		import { unimixin } from '../../../utils/unimixin.js'
	export default {
		mixins: [unimixin],
		data(){
			return{
				invitaIncomList: []
			}
		},
		onLoad() {

		},
		onReachBottom(){
			if(this.page>=this.pageNum){
				this.page = this.pageNum
			}else{
				this.page += 1
				this.getInvitaIncomRecord()
			}
		},
		methods: {
			touchEnd(e){
				if(this.changeY > 50){
					this.page = 1
					this.invitaIncomList = []
					this.getInvitaIncomRecord()
					this.paddingTop = 0
				}
			},
			getInvitaIncomRecord(){
				this.ajaxJson({
					url: '/api/v1/introList',
					data: { page: this.page, pageSize: this.pageSize },
					call: (data)=>{
						if(data.code == 200){
							this.pageTotal = data.data.total
							this.invitaIncomList = [...this.invitaIncomList, ...data.data.rows]
						}else{
							uni.showToast({
								title: data.msg
							})
						}
					}
				})
			}
		},
		created() {
			this.getInvitaIncomRecord()
		}
	}
</script>

<style scoped lang="scss">
	.invitaIncomOrder{
		position: relative;
		padding-bottom: 140rpx;
		.tractCon{
			.enConList{
				padding: 20rpx 30rpx 0;
				border-top: 2px solid #f2f2f2;
				.enList:last-child{
					border-bottom: none;
				}
				.enList{
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					border-bottom: 2px solid #f2f2f2;
					view{
						display: flex;
						flex-wrap: wrap;
						flex-direction: column;
						margin-top: 15rpx;
						padding-bottom: 20rpx;
						text{
							font-size: 24rpx;
							white-space: nowrap;
						}
						text:nth-of-type(1){
							font-size: 26rpx;
							line-height: 26rpx;
							color: $c6;
						}
						text:nth-of-type(2){
							margin-top: 15rpx;
							font-size: 24rpx;
							line-height: 24rpx;
							color: $c3;
						}
					}
					view:nth-child(1){
						width: 50%;
					}
					view:nth-child(4){
						width: 50%;
					}
					view:nth-child(2){
						width: 50%;
					}
					view:nth-child(3){
						width: 50%;
					}

				}
			}
		}
	}
</style>
