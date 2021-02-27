<template>
	<view class="addShopGood noNavMainBox">
		<view class="upLoadImg" @click="upLoadImgEvent()">
			<view v-if="!descDiagramImg">上传商品图片</view>
			<image v-if="descDiagramImg" :src="descDiagramImg" mode="aspectFit"></image>
		</view>
		<view class="shopUploadInfo">
			<view class="shopInfoName">
				<input type="text" v-model="name" placeholder="商品名称">
			</view>
			<!-- <view class="shopInfoName">
				<input type="text" v-model="content" placeholder="商品描述">
			</view> -->
			<view class="remarks">
				<input type="text" v-model="remarks" placeholder="商品备注">
			</view>
		</view>
		
		<view class="shopChoice">
			<view class="itemType">
				<view class="itemTypeIndex" v-for="(item, index) in checkItem" :key="index" @click="itemTypeEVent(item, index)">
					<view class="indexName">{{item}}</view>
					<view class="itemCheck i-cCheck" :class="{'i-cChecked': checkOn == index}"></view>
				</view>
			</view>
			<view class="shopPrice">
				<view class="priceTxt">商品价格</view>
				<input type="number" v-model="price"  placeholder="0.00"/>
				<view class="priceUnit">USDT</view>
			</view>
		</view>
		<view class="shopAmount">
			<view class="amountTxt">库存</view>
			<input type="text" v-model="stock" />
			<view class="amountUnit">个</view>
		</view>
		
		<view class="textarea">
			<textarea v-model="synopsis" maxlength="-1" value="" placeholder="商品简介..." />
		</view>
		
		<view class="shopUpDetail">
			<view class="detailLine"></view>
			<view class="detailTxt">详情</view>
			
		</view>
		<view class="editor">
			<jinEdit placeholder="请输入内容" @editOk="editOk" fileKeyName="img" uploadFileUrl="https://www.dpro.ltd/api/v1/treatyCashGoods/imgUpload"></jinEdit> 
		</view>
		<!-- https://www.dpro.ltd -->
		
		<view class="uniBtn" @click="isClick && upLoadShopEvent()">确定上传</view>
	</view>
</template>

<script>
	import { unimixin } from '../../utils/unimixin.js'
	import  jinEdit  from '../../components/jin-edit/jin-edit.vue'
	export default {
		mixins: [ unimixin ],
		components: { jinEdit },
		data(){
			return{
				descDiagramImg: '',
				desc_diagram: '',
				item_type: '1',
				
				name: '',
				content: '',
				price: '',
				stock: '',
				remarks: '',
				synopsis: '',
				checkItem: ['虚拟','实物'],
				checkOn: '',
				
				isValidator: false
			}
		},
		onLoad() {

		},
		onNavigationBarButtonTap(e) {
			if(e.float == 'left') {
				uni.reLaunch({
					url: '/pages/contractExchange/exchangeMall?switchOn=1&regionType=2',
					success: () => {}
				})
			}
		},
		methods: {
			upLoadImgEvent(){
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: (res) => {
						this.descDiagramImg = res.tempFilePaths[0]
						this.ajaxUpload({
							url: '/api/v1/treatyCashGoods/imgUpload',
							method: 'POST',
							filePath: res.tempFilePaths[0],
							name: 'img',
							call: (data)=>{
								let result = JSON.parse(data)
								if(result.code == 200){
									this.desc_diagram = result.data
								}else{
									uni.showToast({
										image: '/static/images/wrong.png',
										title: result.msg,
										success: () => {}
									})
								}
							}
						})
					}
				})
			},
			itemTypeEVent(item, index){
				this.item_type = index + 1
				this.checkOn = index 
			},
			editOk(res){
				this.content = res.html
			},
			upLoadShopEvent(){
				
				this.isClick = false
				this.validator()
				if(this.isValidator){
					let params = {
						name: this.name,
						item_type: this.item_type,
						desc_diagram: this.desc_diagram,
						remarks: this.remarks,
						synopsis: this.synopsis,
						price: this.price,
						stock: this.stock,
						content: this.content,
					}
					this.ajaxJson({
						url: '/api/v1/treatyCashGoods/publish',
						method: 'POST',
						data: params,
						call: (data)=>{
							this.isClick = true
							if(data.code == 200){
								uni.showToast({
									icon: 'none',
									title: data.msg,
									success: () => {}
								})
								setTimeout(()=>{
									uni.reLaunch({
										url: '/pages/contractExchange/exchangeMall?switchOn=1&regionType=2',
										success: () => {}
									},500)
								})
							}else{
								uni.showToast({
									image: '/static/images/wrong.png',
									title: data.msg,
									success: () => {}
								})
							}
						}
					})
				}
			},
			validator(){
				if(!this.desc_diagram){
					uni.showToast({
						icon: 'none',
						title: '请上传图片',
						success: () => {}
					})
					this.isValidator = false
					this.isClick = true
				}else if(!this.name){
					uni.showToast({
						icon: 'none',
						title: '请输入商品名称',
						success: () => {}
					})
					this.isValidator = false
					this.isClick = true
				}else if(!this.remarks){
					uni.showToast({
						icon: 'none',
						title: '请输入商品备注',
						success: () => {}
					})
					this.isValidator = false
					this.isClick = true
				}else if(!this.price){
					uni.showToast({
						icon: 'none',
						title: '请输入商品价格',
						success: () => {}
					})
					this.isValidator = false
					this.isClick = true
				}else if(!this.stock){
					uni.showToast({
						icon: 'none',
						title: '请输入商品库存',
						success: () => {}
					})
					this.isValidator = false
					this.isClick = true
				}else if(!this.synopsis){
					uni.showToast({
						icon: 'none',
						title: '请输入商品简介',
						success: () => {}
					})
					this.isValidator = false
					this.isClick = true
				}else if(!this.content){
					uni.showToast({
						icon: 'none',
						title: '请上传商品详情并点击右下角对号上传',
						success: () => {}
					})
					this.isValidator = false
					this.isClick = true
				}else {
					this.isValidator = true
				}
			}
		},
		created() {

		}
	}
</script>

<style scoped lang="scss">
	
	.itemCheck::before{
		color: $c6;
	}
	.addShopGood{
		.upLoadImg{
			background-color: #f7f7f7;
			height: 690rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: $c9;
			font-size: 32rpx;
		}
		.shopUploadInfo{
			margin: 0 30rpx 0;
			view{
				margin-top: 20rpx;
				border: 1px solid #d9d9d9;
				padding: 15rpx 0;
				border-radius: 8rpx;
			}
		}
		.shopChoice{
			margin: 20rpx 30rpx 0;
			display: flex;
			.itemType{
				border: 1px solid #d9d9d9;
				display: flex;
				align-items: center;
				// width: 334rpx;
				height: 68rpx;
				margin-right: 20rpx;
				line-height: 68rpx;
				border-radius: 8rpx;
				.itemTypeIndex{
					display: flex;
					flex-direction: row;
					align-items: center;
					white-space: nowrap;
					padding: 0 38rpx;
					.indexName{
						font-size: 24rpx;
						line-height: 24rpx;
						color: $c3;
						margin-right: 8rpx;
					}
				}
			}
			.shopPrice{
				border: 1px solid #d9d9d9;
				display: flex;
				align-items: center;
				border-radius: 8rpx;
				// width: 334rpx;
				padding: 0 28rpx;
				input{
					width: 100rpx;
					text-align: right;
					font-size: 30rpx;
				}
				.priceTxt{
					font-size: 24rpx;
					color: $c3;
					white-space: nowrap;
					display: flex;
					align-items: center;
				}
				.priceUnit{
					margin-left: 10rpx;
					font-size: 24rpx;
					color: $c9;
				}
			}
		}
		.shopAmount{
			margin: 20rpx 30rpx 0;
			display: flex;
			border: 1px solid #d9d9d9;
			border-radius: 8rpx;
			height: 68rpx;
			display: flex;
			align-items: center;
			padding: 0 38rpx;
			.amountTxt{
				white-space: nowrap;
				font-size: 24rpx;
				color: $c3;
			}
			input{
				width: 100%;
			}
			.amountUnit{
				font-size: 24rpx;
				color: $c9;
			}
		}
		.textarea{
			margin: 20rpx 30rpx 0;
			border: 1px solid #d9d9d9;
			border-radius: 8rpx;
			text-indent: 0.5em;
			font-size: 30rpx;
			textarea{
				width: 100%;
				height: 200rpx;
			}
		}
		.shopUpDetail{
			background-color: #f7f7f7;
			margin-top: 30rpx;
			display: flex;
			align-items: center;
			padding: 10rpx 30rpx;
			.detailLine{
				width: 4rpx;
				height: 28rpx;
				background-color: #b8393c;
				margin-right: 16rpx;
			}
			.detailTxt{
				font-size: 30rpx;
				color: $c3;
			}
		}
		.editor{
			padding-top: 20rpx;
		}
	}
</style>
