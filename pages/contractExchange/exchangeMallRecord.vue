<template>
	<view class="exchangeMallRecord mainBox">
		
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
		onNavigationBarButtonTap(e) {
			if(e.float == 'left') {
				uni.reLaunch({
					url: '/pages/contractExchange/exchangeMall',
					success: () => {}
				})
			}
		},
		methods: {
			
		},
		created() {
			
		}
	}
</script>

<style scoped lang="scss">
	
</style>
