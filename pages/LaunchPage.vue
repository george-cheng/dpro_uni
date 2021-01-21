<template>
	<view class="launchPage" :style="{height: areaH + 'px', width: areaW + 'px'}">
		<video src="../static/openScreen.mp4" :autoplay="true" :duration="7" :controls="false" :loop="true" object-fit="cover"></video>
	</view>
</template>

<script>
	import { accAdd, accMul } from '../utils/common.js'
	export default {
		data(){
			return{
				areaW: '',
				areaH: '',
			}
		},
		onLoad() {

		},
		methods: {
			initImgSize(){
				uni.getSystemInfo({
					success: (data) => {
						this.areaH = data.screenHeight
						this.areaW = data.screenWidth
					}
				})
			},
			routerIndex(){
				setTimeout(()=>{
					uni.reLaunch({
						url: '/pages/index/index',
						success: () => {}
					})
				},7000)
			}
		},
		created() {
			this.initImgSize()
			this.routerIndex()
		}
	}
</script>

<style scoped lang="scss">
	.launchPage{
		video{
			width: 100%;
			height: 100%;
		}
	}
</style>
