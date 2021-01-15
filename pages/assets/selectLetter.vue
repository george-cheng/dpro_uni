<template>
	<view class="rechSelect mainBox">
		<view class="rechTop">
			<view>
				<span class="rechIptIco i-search" @click="searchEvent"></span>
				<input type="text" v-model="searchIpt" @blur="searchEvent" placeholder="搜索币种">
			</view>
			<text class="cancel" @click="cancelEvent">取消</text>
		</view>
		
		<view class="rechList">
			<view>
				<!-- <view class="letterTit">A</view> -->
				<view class="letterList" v-for="(item, index) in balanceList" :key="item.id">
					<view v-if="  category ==  1 ? item.isRecharge : item.isWithDraw" @click="letterListEvent(item)">{{item.name}}</view>
				</view>
			</view>
		</view>
		
		
		<view class="lftLetterList">
			<view v-for="(item, index) in lftLetterList" :key="index">{{item}}</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data(){
			return{
				searchIpt: '',
				category: '',
				balanceList: [],
				lftLetterList: [],
				// lftLetterList: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
			}
		},
		onLoad(options) {
			this.category = options.category
		},
		methods: {
			letterListEvent(item){
				uni.navigateTo({
					url: './assRecord?category=' + this.category + '&id=' + item.id 
				})
			},
			/* 获取数据 */
			getRechSelect(){
				this.ajaxJson({
					url: '/api/v1/account/balances',
					call: (data)=>{
						this.balanceList = data.data.balanceList
					}
				})
			},
			/* 搜索 */
			searchEvent(){
				
			},
			/* 取消 */
			cancelEvent(){
				
			}
		},
		created() {
			this.getRechSelect()
		}
	}
</script>

<style scoped lang="scss">
	.rechSelect{
		.rechTop{
			margin: 20rpx 35rpx 0;
			display: flex;
			justify-content: space-between;
			view{
				display: flex;
				justify-content: space-between;
				background-color: #f2f2f2;
				border-radius: 10rpx;
				height: 70rpx;
				.rechIptIco{
					padding-left: 27rpx;
					display: flex;
					align-items: center;
				}
				.rechIptIco::before{
					color: #999;
				}
				input{
					width: 520rpx;
					height: 70rpx;
					padding-left: 20rpx;
				}
			}
			.cancel{
				white-space: nowrap;
				color: #999;
				display: flex;
				align-items: center;
				font-size: 28rpx;
			}
		}
		.rechList{
			margin: 30rpx 30rpx 0;
			view{
				.letterTit{
					height: 74rpx;
					color: #BD3A3B;
					font-size: 26rpx;
					line-height: 26rpx;
				}
				.letterList{
					view{
						height: 74rpx;
						color: #999;
						font-size: 26rpx;
						line-height: 26rpx;
						border-bottom: 1px solid #f2f2f2;
						display: flex;
						align-items: center;
					}
				}
			}
		}
		.lftLetterList{
			position: fixed;
			top: 25%;
			right: 30rpx;
			view{
				font-size: 20rpx;
				line-height: 20rpx;
				color: #999;
				margin: 10rpx 0;
			}
			view.choice{
				color: #BD3A3B;
			}
		}
	}
</style>
