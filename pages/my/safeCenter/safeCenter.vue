<template>
	<view class="safe mainBox">
		<view>
			<view class="mainTit">
				<text>安全中心:</text>
				<text> 中</text>
			</view>
			<view class="perCon">
				<view @click="safeEvent(0)">
					<view class="conLft">
						<view class="conIcon"></view>
						<text class="lftTit">谷歌身份认证</text>
					</view>
					<view class="conRgt">
						<text class="rgtInfo">未认证</text>
						<view class="conIcon i-rgtArrow"></view>
					</view>
				</view>
			</view>
		</view>
		
		<view>
			<view class="mainTit">
				<text>交易设置</text>
			</view>
			<view class="perCon">
				<view @click="safeEvent(1)">
					<view class="conLft">
						<view class="conIcon"></view>
						<text class="lftTit">设置交易密码</text>
					</view>
					<view class="conRgt">
						<text class="rgtInfo"></text>
						<view class="conIcon i-rgtArrow"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				
			}
		},
		onLoad() {

		},
		methods: {
			safeEvent(index){
				if(index == 1){
					uni.navigateTo({
						url: '/pages/my/safeCenter/safePwd',
						success: () => {}
					})
				}
			},
			getSessionInfo(){
				
			}
		},
		created() {

		}
	}
</script>

<style scoped lang="scss">
	.safe>view{
		margin: 20rpx 30rpx 0;
	}
	.safe{
		view{
			.mainTit{
				display: flex;
				flex-direction: row;
				font-size: 24rpx;
				color: $c3;
				text:nth-of-type(2){
					color: $c3;
				}
			}
			.perCon>view{
				border-top: 1px solid #f2f2f2;
			}
			.perCon{
				margin-top: 12rpx;
				view{
					height: 112rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 26rpx;
					color: $c3;
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
	}
</style>
