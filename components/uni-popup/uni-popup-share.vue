<template>
	<view class="uni-popup-share">
		<view class="uni-share-title"><text class="uni-share-title-text" style="color: #fff;">{{title}}</text></view>
		<view class="uni-share-content">
			<view class="uni-share-content-box">
					<!-- <image class="uni-share-image" :src="item.icon" mode="aspectFill"></image>
					<text class="uni-share-text">{{item.text}}</text> -->
					<slot/>

			</view>
		</view>
		<view class="uni-share-button-box">
			<button class="uni-share-button" @click="close">取消</button>
			<button class="uni-share-button" @click="confirm">确定</button>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'UniPopupShare',
		props: {
			title: {
				type: String,
				default: '标题'
			}
		},
		inject: ['popup'],
		data() {
			return {

			}
		},
		created() {},
		methods: {
			close() {
				this.popup.close()
			},
			confirm(){
				this.$emit('comfirm')
			}
		}
	}
</script>
<style lang="scss" scoped>
	.uni-popup-share {
		background-color: #fff;
	}
	.uni-share-title {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 40px;
	}
	.uni-share-title-text {
		font-size: 14px;
		color: #666;
	}
	.uni-share-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		padding-top: 10px;
	}
	
	.uni-share-content-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		width: 360px;
	}
	
	.uni-share-content-item {
		width: 90px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		padding: 10px 0;
		align-items: center;
	}
	
	.uni-share-content-item:active {
		background-color: #f5f5f5;
	}
	
	.uni-share-image {
		width: 30px;
		height: 30px;
	}
	
	.uni-share-text {
		margin-top: 10px;
		font-size: 14px;
		color: #3B4144;
	}
	
	.uni-share-button-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		padding: 20rpx 0;
	}
	
	.uni-share-button {
		line-height: 56rpx;
		font-size: 28rpx;
		display: flex;
		align-items: center;
	}
	
	.uni-share-button::after {

	}
</style>
