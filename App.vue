
<script>
	export default {
		onLaunch: function() {
			
		},
		onShow: function() {
			
			
		},
		onHide: function() {
			
		},
		methods: {
			
		},
		created() {

		}
	}
</script>

<style>

	/*每个页面公共css */
	
	@import url("./style/common.css");
	@import url("./static/iconfont/style.css");
	@import url('./style/fontstyle.css');
	@font-face {
		font-family: 'icomoon';
		src: url('@/static/iconfont/fonts/icomoon.eot');
		src: url('@/static/iconfont/fonts/icomoon.eot#iefix') format('embedded-opentype'),
			url('@/static/iconfont/fonts/icomoon.ttf') format('truetype'),
			url('@/static/iconfont/fonts/icomoon.woff') format('woff'),
			url('@/static/iconfont/fonts/icomoon.svg#icomoon') format('svg');
		font-weight: normal;
		font-style: normal;
		font-display: block;
	}
	
	.uni-tabbar{
		z-index: 9 !important;
		background-color: #282828 !important;
	}
	
	.uni-tabbar .uni-tabbar__icon{
		width: 38rpx;
		height: 38rpx;
	}
	.uni-tabbar .uni-tabbar__label{
		line-height: 1.4;
	}
	
</style>
