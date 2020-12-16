<template>
	<view class="">
		1111111
		<image :src="src"></image>
	</view>
</template>

<script>
	
	export default {
		data(){
			return{
				src: ''
			}
		},
		onLoad() {

		},
		methods: {
			
			
			
			async getVerCode(){
							const res = await this.$ajaxGet({
								url: 'v1/servlet/ImageCode',
								responseType: "arraybuffer"
							})
							var blobUrl = uni.base64ToArrayBuffer(res);
							let base = uni.arrayBufferToBase64(res)
							let codeImg = "data:image/jfif;base64," + base
							this.verImage = codeImg
						},
		},
		created() {
			this.getVerCode()
		}
	}
</script>

<style lang="scss">

</style>
