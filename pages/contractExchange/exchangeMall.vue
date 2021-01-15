<template>
	<view class="exchangeMall mainBox" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
		<swiper indicator-dots circular autoplay interval="3000">
			<swiper-item v-for="item in swipers" :key="item.id">
				<image :src="url + item.image_url"></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import { unimixin } from '../../utils/unimixin.js'
	export default {
		mixins: [ unimixin ],
		data(){
			return{
				swipers: [],
			}
		},
		onLoad() {

		},
		onNavigationBarButtonTap(e) {
			if(e.float == 'left') {
				uni.reLaunch({
					url: '/pages/index/index',
					success: () => {}
				})
			}else{
				uni.reLaunch({
					url: '/pages/contractExchange/exchangeMallRecord',
					success: () => {}
				})
			}
		},
		methods: {
			touchEnd(e){
				if(this.changeY > 50){
					this.initSwipersImg()
					
					this.paddingTop = 0
				}
			},
			initSwipersImg(){
				this.ajaxJson({
					url: '/api/v1/config/banner',
					data: {via: 'app'},
					call: (res)=>{
						this.swipers = res.data
					}
				})
			},
		},
		created() {
			this.initSwipersImg()
		}
	}
</script>

<style scoped lang="scss">
	.exchangeMall{
		swiper {
			width: 750rpx;
			height: 350rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
