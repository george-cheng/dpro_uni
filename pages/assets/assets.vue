<template>
	<view class="assets mainBox" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
		<view class="navBarCon" v-if="isNavBar">
			<view @click="navBarEvent(0)">充值记录</view>
			<view @click="navBarEvent(1)">提币记录</view>
			<view @click="navBarEvent(2)">法币OTC记录</view>
		</view>
		
		<view class="switchNav">
			<view :class="{switchChoice: switchOn == index}" @click="switchNavEvent(item, index)" v-for="(item, index) in switchNavList" :key="index">{{item}}</view>
		</view>
		
		<view v-if="switchOn == 0">
			<view class="assetsTit">
				<view class="assetsTotal">
					<text class="totalTit">总资产</text>
					<text class="totalMoney">{{isShow ? accAdd(accAdd(accAdd( moneyAdd, usdtMoneyAdd ), legAcc), contractAcc).toFixed(2) : '******'}}</text>
					<text class="totalCny">≈ {{isShow ? accMul(accAdd(accAdd(accAdd( moneyAdd, usdtMoneyAdd ), legAcc), contractAcc), cny).toFixed(2) : '******'}} CNY</text>
				</view>
				<view class="totalShow" @click="showEvent">
					<text class="personId"> UID：{{fuId}} </text>
					<span class="showIco i-eye"></span>
				</view>
			</view>
			<!-- <view class="assetsOpera">
				<view>
					<view class="operaList" @click="operaEvent(0)">
						<span class="rechargeIco i-recharge"></span>
						<text>充值</text>
					</view>
					<view class="operaList" @click="operaEvent(1)">
						<span class="wdrawalIco i-wdrawal"></span>
						<text>提现</text>
					</view>
					<view class="operaList" @click="operaEvent(2)">
						<span class="reRecorIco i-reRecord"></span>
						<text>充值记录</text>
					</view>
					<view class="operaList" @click="operaEvent(3)">
						<span class="legalCurrRecordIco i-legalCurrRecord"></span>
						<text>法币记录</text>
					</view>
				</view>
			</view> -->

			<view class="assetsAcc">
				<view class="accList">
					<view>
						<text class="accTit">币币账户(USDT)</text>
						<text class="accMoney"> {{ accAdd( moneyAdd, usdtMoneyAdd ).toFixed(2)}} </text>
						<text class="assCny">≈ {{ accMul( accAdd( moneyAdd, usdtMoneyAdd ) , cny).toFixed(2) }} CNY</text>
					</view>
					<view>
						<text class="accTit">法币账户(USDT)</text>
						<text class="accMoney">{{legAcc}}</text>
						<text class="assCny">≈ {{accMul(legAcc, cny).toFixed(2)}} CNY</text>
					</view>
					<view>
						<text class="accTit">合约账户(USDT)</text>
						<text class="accMoney">{{contractAcc}}</text>
						<text class="assCny">≈ {{accMul(contractAcc, cny).toFixed(2)}} CNY</text>
					</view>
				</view>
			</view>
			<view class="assetsTran" v-if="false">
				<view class="tranAcc">
					<view class="accRgt">
						<text> {{ isTranAcc ? '币币账户' : '法币账户' }}</text>
					</view>
					<span class="tranAccIco i-tranAcc" @click="tranSwitch"></span>
					<view class="accRgt">
						<view class="rgtCon">
							<view>
								<text>{{ isTranAcc ? '法币账户' : '币币账户' }}</text>
							</view>
							<view class="rgtConList" v-if="isConList">
								<text @click="conListEvent(item, index)" v-for="(item, index) in conList" :key="index">{{item}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="tranQuantity">
					<view>
						<input class="tranQuantityIpt" type="text" v-model="accQuantity" placeholder="请输入划入数量(USDT)">
						<view class="quantityInfo">
							<text class="tranQuantityBtn" @click="transferEvent(0)">划转</text>
							<span v-if="false" class="verLine"></span>
							<text v-if="false" @click="transferEvent(1)">全部划转</text>
						</view>
					</view>
				</view>
			</view>
			<view class="tranDetail" v-if="false">
				<text @click="tranDetailEvent">划转明细</text>
			</view>
			<view class="assetsTip" style="margin-top: 50rpx;">
				<view class="tipLft">
					<span class="tipCheck" :class="[isCheck?'i-checked':'i-check']" @click="checkEvent"></span>
					<text>隐藏小额资产</text>
				</view>
				<view class="tipRgt">
					<view class="rgtIptCon">
						<span class="rgtIptIco i-search"></span>
						<input type="text" v-model="searchIpt">
					</view>
				</view>
			</view>
			<view class="assetsList">
				<view @click="assetsEvent(item)" v-for="(item, index) in assetsList" :key="item.id">
					<view class="listLft">
						<view class="lftImg">
							<image :src="url + item.url" mode=""></image>
						</view>
						<view class="lftInfo">
							<text class="infoTit">{{item.name}}</text>
							<text class="infoIntro">{{item.allName}}</text>
						</view>
					</view>
					<view class="listRgt">
						<view class="rgtMoney">{{item.total}}</view>
						<view class="rgtFrozen">
							<text>冻结： {{item.frozen}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="switchOn == 1">
			<view class="tranName">
				<view class="tranNameTxt">币种</view>
				<view class="tranNameIpt">
					<input type="text" v-model="tranName" disabled>
					<view class="tranIcon i-rgtArrow"></view>
				</view>
			</view>
			
			<view class="tranArea">
				
				<view class="tranAreaLft">
					<view class="areaLftName">{{lftName}}</view>
				</view>
				<view class="tranAreaIcon i-tranAcc" @click="tranIconEvent"></view>
				<view class="tranAreaRgt" @click="areaRgtDownEvent">
					<view class="areaRgtName">{{rgtName}}</view>
					<view class="areaRgtDown i-dwArrow"></view>
					<view class="areaRgtDownList" v-if="isAreaRgtDown">
						<view @click.stop="areaRgtDownListEvent(item, index)" v-for="(item, index) in areaRgtDownList" :key="index">{{item}}</view>
					</view>
				</view>
				
			</view>
			<view class="tranUse">可用余额：{{useTotal}} {{tranName}}</view>
			<view class="tranAmount">
				<input type="text" v-model="tranAmount" placeholder="请输入划转数量">
				<view class="amountName">
					<view class="tranKindName">{{tranName}}</view>
					<view class="tranLine"></view>
					<view class="tranAll" @click="tranAllEvent">全部</view>
				</view>
			</view>
			
			<view class="tranConfirm" @click="isClick && tranConfirmEvent()">
				<button type="default">确认划转</button>
			</view>

		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="popupCon">
				<view @click="popupEvent(0)" v-if="isPopupRecharge">充值</view>
				<view @click="popupEvent(1)" v-if="isPopupWithDraw">提币</view>
				<view @click="popupEvent(2)" v-if="isPopupTransfer">兑换</view>
				<view @click="popupEvent(3)" v-if="isPopupTranAcc">转账</view>
			</view>
		</uni-popup>
		
		<unitabbar :switchOn = "3"></unitabbar>
	</view>
</template>

<script>
	import { accAdd, accMul } from '../../utils/common.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import unitabbar from '../../components/uni-tarbar/tarBar.vue'
	import { unimixin } from '../../utils/unimixin.js'
	export default{
		components: {uniPopup, unitabbar},
		mixins: [unimixin],
		data(){
			return{
				totalMoney: '9807',
				totalCny: '9876',
				isShow: true,
				isConList: false,
				isCheck: false,
				assetsList: [],
				usdtList: [],
				rgtAcc: '法币账户',
				accQuantity: '',
				searchIpt: '',
				conList: ['法币账户1','法币账户2','法币账户3','法币账户4','法币账户5','法币账户6'],
				switchNavList: ['资产','划转'],
				areaRgtDownList: ['法币交易','合约交易'],
				switchOn: 0,
				isHeyt: true,
				isNavBar: false,
				isAreaRgtDown: false,
				isPopupRecharge: false,
				isPopupWithDraw: false,
				isPopupTransfer: false,
				isPopupTranAcc: false,
				assetsId: '',
				imgUrl: '',
				fuId: '',
				moneyAdd: 0,
				usdtMoneyAdd: 0,
				
				usdtTotalMoney: 0,
				cny: '',
				fvid: '',
				legAcc: '0',
				contractAcc: '0',
				
				isTranAcc: true,
				isVerificat: false,
				
				DPCTotal: '',
				DPCLastDealPrize: '',
				
				USDTTotal: '',

				tranName: 'USDT',
				lftName: '币币交易',
				rgtName: '法币交易',
				rgtSaveName: '',
				type: '1',
				useTotal: '',
				tranAmount: '',
				
			}
		},
		onLoad() {
		},
		onNavigationBarButtonTap(e) {
			if (e.float == 'right') {
				if(this.switchOn == 0){
					this.isNavBar = !this.isNavBar
				}else{
					uni.navigateTo({
						url: './assTranRecord',
						success: () => {}
					})
				}
			}
		},
		onShow(){
			
		},
		methods:{
			tranAllEvent(){
				this.tranAmount = this.useTotal
			},
			/* 资产 -- 划转 切换 */
			switchNavEvent(item, index){
				this.switchOn = index
				this.isNavBar = false
				let webView = this.$scope.$getAppWebview()
				if(this.switchOn == 1){
					webView.setTitleNViewButtonStyle(0,{
						text: '记录',
					})
				}else{
					webView.setTitleNViewButtonStyle(0,{
						text: '明细',
					})
				}
				
			},
			/* 划转切换 */
			tranIconEvent(){
				let saveRgt = this.rgtName
				let saveLft = this.lftName
				this.lftName = saveRgt
				this.rgtName = saveLft
				
				if(this.lftName == '法币交易'){
					this.isHeyt = false
				}else if(this.lftName == '合约交易'){
					this.isHeyt = false
				}else{
					this.isHeyt = true
				}
				this.tranType()
			},
			areaRgtDownEvent(){
				if(this.isHeyt){
					this.isAreaRgtDown = !this.isAreaRgtDown
				}
			},
			areaRgtDownListEvent(item, index){
				this.isAreaRgtDown = false
				this.rgtSaveName = this.rgtName = item
				this.tranType()
			},
			initTranType(){
				this.ajaxJson({
					url: '/api/v1/account/balances/byFvid',
					data: {fvid: '50'},
					call: (data)=>{
						if(data.code == 200){
							this.useTotal = data.data.ftotal
						}
					}
				})
			},
			tranType(){
				if(this.lftName == '币币交易' && this.rgtName == '法币交易'){
					this.type = '1'
					this.ajaxJson({
						url: '/api/v1/account/balances/byFvid',
						data: {fvid: '50'},
						call: (data)=>{
							if(data.code == 200){
								this.useTotal = data.data.ftotal
							}
						}
					})
				}else if(this.lftName == '法币交易' && this.rgtName == '币币交易'){
					this.type = '2'
					this.ajaxJson({
						url: '/api/v1/findUsdtBuinessByFuId',
						method: 'POST',
						data: {fvId: '50'},
						call: (data)=>{
							if(data.code == 200){
								this.useTotal = data.data.fbalance
							}
						}
					})
				}else if(this.lftName == '币币交易' && this.rgtName == '合约交易'){
					this.type = '3'
					this.ajaxJson({
						url: '/api/v1/account/balances/byFvid',
						data: {fvid: '50'},
						call: (data)=>{
							if(data.code == 200){
								this.useTotal = data.data.ftotal
							}
						}
					})
				}else if(this.lftName == '合约交易' && this.rgtName == '币币交易'){
					this.type = '4'
					this.ajaxJson({
						url: '/api/v1/treatyWallet/getByUidAndCoinId',
						data: {fvId: '50'},
						call: (data)=>{
							if(data.code == 200){
								this.useTotal = data.data.total
							}
						}
					})
				}
			},
			tranConfirmEvent(){
				this.isClick = false
				if(!this.tranAmount){
					this.isClick = true
					uni.showToast({
						icon: 'none',
						title: '请输入数量'
					})
				}else{
					this.ajaxJson({
						url: '/api/v1/capitalTransfer',
						method: 'POST',
						data: {type: this.type,fvid: '50',amount: this.tranAmount},
						call: (data)=>{
							this.isClick = true
							if(data.code == 200){
								uni.showToast({
									title: data.msg,
									success: () => {
										this.initTranType()
										this.tranType()
										this.tranAmount = ''
									}
								})
							}else{
								uni.showToast({
									image: '/static/images/wrong.png',
									title: data.msg
								})
							}
						}
					})
				}
			},
			touchEnd(e){
				if(this.changeY > 50){
					
					if(this.switchOn == 0){
						this.moneyAdd = 0
						this.usdtMoneyAdd = 0
						this.legAcc = 0
						this.getAssetsList()
						this.getLegAcc()
						this.getContractAcc()
						this.getRage()
						this.assetsTranInfo()
					}else{
						this.initTranType()
					}
					this.paddingTop = 0
				}
			},

			/* 资产划转 */
			assetsTranInfo(){
				this.ajaxJson({
					url: '/api/v1/transfer/coinTypeList',
					call: (data)=>{
						this.fvid = data.data.rows[0].id
					}
				})
			},
			/* 资产划转切换 */
			tranSwitch(){
				this.isTranAcc = !this.isTranAcc
				this.accQuantity = ''
			},
			/* 获取资产列表 */
			getAssetsList(){
				this.ajaxJson({
					url: '/api/v1/account/balances',
					call: (data)=>{
						if(data.data.balanceList){
							this.assetsList = data.data.balanceList
						}
						this.usdtList = data.data.dataMap.USDT
						this.getCalcCurrency()
					}
				})
			},
			/* 计算币币账户 */
			getCalcCurrency(){
				
				let assetsList = this.assetsList
				let usdtList = this.usdtList
				
				let totalFrozenMoney = []
				let usdtTotalMoney = []
				for(let i in assetsList){
					if(assetsList[i].name != 'USDT' && assetsList[i].name !== 'USD'){
						for(let j in usdtList){
							if(assetsList[i].name == usdtList[j].fShortName){
								totalFrozenMoney.push(accMul( accAdd(assetsList[i].total, assetsList[i].frozen), usdtList[j].lastDealPrize ))
							}
						}
					}else{
						usdtTotalMoney.push( accAdd(assetsList[i].total, assetsList[i].frozen) )
					}
				}
				
				for(let i in totalFrozenMoney){
					this.moneyAdd += totalFrozenMoney[i]
				}
				for(let i in usdtTotalMoney){
					this.usdtMoneyAdd += usdtTotalMoney[i]
				}
				this.accTotalMoney = this.moneyAdd + this.usdtMoneyAdd + this.legAcc
			},
			/* 点击资产弹出充值和提现功能 */
			assetsEvent(item){
				this.isPopupRecharge = item.isRecharge
				this.isPopupWithDraw = item.isWithDraw
				this.isPopupTransfer = false
				this.isPopupTranAcc = false
				if(item.name === 'DPC'){
					this.isPopupTransfer = true
					this.DPCTotal = item.total
					for(let i in this.usdtList){
						if(this.usdtList[i].fShortName == 'DPC'){
							this.DPCLastDealPrize = this.usdtList[i].lastDealPrize
						}
					}
				}else if(item.name === 'USDT'){
					this.isPopupTranAcc = true
					this.USDTTotal = item.total
				}
				this.assetsId = item.id
				this.imgUrl = item.url
				if(this.isPopupRecharge || this.isPopupWithDraw){
					this.$refs.popup.open()
				}
			},
			/* 充值和提币功能按钮 */
			popupEvent(index){
				if(index == 0){
					uni.navigateTo({
						url: './rechAddress?id=' + this.assetsId,
						success: () => {
							this.$refs.popup.close()
						}
					})
				}else if(index == 1){
					uni.navigateTo({
						url: './assWithDraw?id=' + this.assetsId + '&imgUrl=' + this.imgUrl,
						success: () => {
							this.$refs.popup.close()
						}
					})
				}else if(index == 2){
					uni.navigateTo({
						url: './assTransfer?id=' + this.assetsId + '&total=' + this.DPCTotal + '&lastDealPrize=' + this.DPCLastDealPrize,
						success: () => {
							this.$refs.popup.close()
						}
					})
				}else if(index == 3){
					uni.navigateTo({
						url: '/pages/assets/assTranAcc/assTranAcc?total=' + this.USDTTotal,
						success: () => {
							this.$refs.popup.close()
						}
					})
				}
			},
			/* 充值和提币记录 */
			navBarEvent(index){
				this.isNavBar = false
				if(index == 0 || index == 1){
					uni.navigateTo({
						url: './selectLetter?category=' + index,
						success: () => {}
					})
				}else if(index == 2){
					uni.reLaunch({
						url: './orderRecord',
						success: () => {}
					})
				}
			},
			/* 资产显示 */
			showEvent(){
				this.isShow = !this.isShow
			},
			/* 操作跳转 */
			/* operaEvent(index){
				if(index == 0){
					uni.navigateTo({
						url: './assRechSelect'
					})
				}else if(index == 2 || index == 3){
					uni.navigateTo({
						url: './assRecord?category=' + index
					})
				}
			}, */
			/* 选择法币账户显示 */
			dwArrowEvent(){
				this.isConList = !this.isConList
			},
			/* 选择法币账户 */
			conListEvent(item, index){
				this.rgtAcc = item
				this.isConList = false
			},
			quantityEvent(){
				if(this.isTranAcc){
					if( this.accQuantity && this.accQuantity > 0 && this.accQuantity <= parseFloat(accAdd(this.moneyAdd, this.usdtMoneyAdd ).toFixed(2))){
						this.isVerificat = true
					}else{
						uni.showToast({
							icon: 'none',
							title: '划转数量不在范围内或不能为空,请重新输入',
							success: () => {
								this.isVerificat = false
								this.accQuantity = ''
							}
						})
					}
				}else{
					if(this.accQuantity && this.accQuantity > 0 && this.accQuantity <= parseFloat(this.legAcc.toFixed(2))){
						this.isVerificat = true
					}else{
						uni.showToast({
							image: '../../static/images/wrong.png',
							title: '划转数量不在范围内或不能为空,请重新输入',
							success: () => {
								this.isVerificat = false
								this.accQuantity = ''
							}
						})
					}
				}
			},
			/* 划转 0 -- 全部划转 1 */
			transferEvent(index){
				if(index == 1){
					if(this.isTranAcc){
						this.accQuantity = accAdd(this.moneyAdd, this.usdtMoneyAdd ).toFixed(2)
					}else{
						this.accQuantity = this.legAcc.toFixed(2)
					}

				}else{
					this.quantityEvent()
					if(this.isVerificat){
						let params = {
							type: this.isTranAcc ? '1' : '2',
							fvid: this.fvid,
							amount: this.accQuantity
						}
						this.ajaxJson({
							url: '/api/v1/capitalTransfer',
							data: params,
							method: 'POST',
							call: (data)=>{
								if(data.code == 200){
									uni.showToast({
										title: data.msg,
										success: () => {
											this.accQuantity = ''
											this.legAcc = ''
											this.usdtMoneyAdd = 0
											this.moneyAdd = 0
											this.getLegAcc()
											this.getAssetsList()
										}
									})
								}else{
									uni.showToast({
										image: '../../static/images/wrong.png',
										title: data.msg,
										success: () => {
											this.accQuantity = ''
										}
									})
								}
							}
						})
					}
					
				}
			},
			/* 划转明细 */
			tranDetailEvent(){
				uni.navigateTo({
					url: './assTranRecord',
					success: () => {}
				})
			},
			/* 显示小额资产 */
			checkEvent(){
				this.isCheck = !this.isCheck
			},
			getContractAcc(){
				this.ajaxJson({
					url: '/api/v1/treatyWallet/getByUidAndCoinId',
					data: {fvId: '50'},
					call: (data)=>{
						if(data.code == 200){
							this.contractAcc = data.data.total
						}
					}
				})
			},
			getLegAcc(){
				uni.getStorage({
					key: 'userInfo',
					success: (data)=>{
						this.fuId = data.data.id
					}
				})
				let params = {
					fuId: this.fuId,
					fvId: '50'
				}
				this.ajaxJson({
					url: '/api/v1/findUsdtBuinessByFuId',
					method: 'POST',
					data: params,
					call: (data)=>{
						if(data.data){
							this.legAcc = data.data.fbalance
						}
					}
				})
			},
			getRage(){
				uni.getStorage({
					key: 'rate',
					success: (data)=>{
						this.cny = data.data.rate
					}
				})
			},
		},
		created() {
			this.getAssetsList()
			this.getLegAcc()
			this.getContractAcc()
			this.getRage()
			this.assetsTranInfo()
			
			this.initTranType()
		}
	}
</script>

<style scoped lang="scss">
	.navBarCon{
		position: fixed;
		top: 0;
		right: 20rpx;
		border: 1px solid #f2f2f2;
		background-color: #fff;
		z-index: 9;
		view{
			font-size: 28rpx;
			display: flex;
			flex-wrap: nowrap;
			padding: 10rpx;
			color: #999;
		}
	}
	.switchNav{
		display: flex;
		justify-content: space-around;
		margin: 0 24rpx;
		padding-top: 20rpx;
		view{
			// padding: 12rpx 46rpx;
			width: 156rpx;
			height: 56rpx;
			background-color: #f2f2f2;
			border-radius: 6rpx;
			color: #999;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
		}
		.switchChoice{
			background-color: #b8393c;
			color: #fff;
		}
	}
	.popupCon{
		padding-bottom: 20rpx;
		display: flex;
			flex-direction: column;
		view{
			display: flex;
			justify-content: center;
			line-height: 70rpx;
			color: #999;
			margin: 10rpx 30rpx;
			border: 1px solid #f2f2f2;
			background-color: #f2f2f2;
			border-radius: 10rpx;
		}
	}
	.assets{
		.assetsTit{
			display: flex;
			justify-content: space-between;
			margin: 30rpx 46rpx 30rpx;
			padding-top: 20rpx;
			.assetsTotal{
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.totalTit{
					font-size: 24rpx;
					line-height: 24rpx;
					color: #676869;
				}
				.totalMoney{
					font-size: 48rpx;
					line-height: 48rpx;
					color: $c3;
					margin-top: 20rpx;
				}
				.totalCny{
					font-size: 24rpx;
					line-height: 24rpx;
					color: #676869;
					margin-top: 34rpx;
				}
			}
			.totalShow{
				display: flex;
				align-items: center;
				flex-direction: column;
				.showIco:before{
					color: #515151;
					font-size: 34rpx;
				}
			}
		}
		.assetsOpera{
			padding: 35rpx 87rpx 30rpx;
			border-top: 1px solid #383838;
			view{
				display: flex;
				justify-content: space-between;
				.operaList{
					display: flex;
					flex-direction: column;
					text-align: center;
					span:before{
						color: #999;
						font-size: 48rpx;
					}
					text{
						margin-top: 20rpx;
						color: #999;
						font-size: 24rpx;
						line-height: 24rpx;
					}
				}
			}
		}
		.assetsAcc{
			padding-top: 40rpx;
			border-top: 1px solid #f2f2f2;
			.accList{
				display: flex;
				justify-content: space-between;
				margin: 0 36rpx;
				view{
					display: flex;
					flex-direction: column;
					.accTit, .assCny{
						color: #676869;
						font-size: 24rpx;
						line-height: 24rpx;
					}
					.accMoney{
						color: $c3;
						font-size: 42rpx;
						line-height: 42rpx;
						margin-top: 25rpx;
						margin-bottom: 34rpx;
					}
				}
			}
		}
		.assetsTran{
			margin: 60rpx 80rpx 0;
			.tranAcc{
				height: 70rpx;
				border: 1px solid #676869;
				border-radius: 8rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 88rpx;
				.accRgt{
					color: #999;
					font-size: 28rpx;
					line-height: 28rpx;
					.rgtCon{
						position: relative;
						.rgtDownIco{
							margin-left: 10rpx;
						}
						.rgtConList{
							border: 1px solid #676869;
							position: absolute;
							top: 60rpx;
							right: 0;
							display: flex;
							flex-direction: column;
							white-space: nowrap;
							z-index: 9;
							background-color: #282828;
							text{
								font-size: 36rpx;
								line-height: 48rpx;
								padding: 10rpx;
							}
						}
					}
				}
				.tranAccIco:before{
					font-size: 48rpx;
					color: #999;
				}
			}
			.tranQuantity{
				margin-top: 26rpx;
				height: 70rpx;

				position: relative;
				view{
					display: flex;
					align-items: center;
					input{
						height: 70rpx;
						width: 450rpx;
						border: 1px solid #676869;
						border-radius: 8rpx;
					}
					.quantityInfo{
						.tranQuantityBtn{
							border: 1px solid #676869;
							padding: 22rpx 25rpx;
							border-radius: 8rpx;
						}
						position: absolute;
						right: 5rpx;
						text{
							font-size: 26rpx;
							line-height: 26rpx;
							color: #999;
						}
						.verLine{
							margin: 0 15rpx;
							width: 1px;
							height: 40rpx;
							background-color: #676869;
						}
					}
				}
			}
		}
		.tranDetail{
			margin-top: 30rpx;
			display: flex;
			justify-content: center;
			text{
				font-size: 26rpx;
				line-height: 26rpx;
				color: #BD3A3B;
			}
		}
		.assetsTip{
			margin: 30rpx 35rpx 0;
			display: flex;
			justify-content: space-between;
			.tipLft{
				display: flex;
				align-items: center;
				.tipCheck{
					margin-right: 18rpx;
				}
				.tipCheck::before{
					color: #676869;
				}
				text{
					color: #676869;
					font-size: 24rpx;
					line-height: 24rpx;
				}
			}
			.tipRgt{
				.rgtIptCon{
					width: 450rpx;
					height: 60rpx;
					background-color: #f2f2f2;
					display: flex;
					flex-direction: row;
					border-radius: 10rpx;
					.rgtIptIco{
						width: 60rpx;
						height: 60rpx;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					.rgtIptIco::before{
						color: #999;
					}
					input{
						width: 390rpx;
						height: 60rpx;
					}
				}
			}
		}
		.assetsList>view{
			height: 62rpx;
			padding: 35rpx 32rpx 35rpx;
			border-top: 1px solid #f2f2f2;
		}
		.assetsList{
			padding: 35rpx 0 0;
			view{
				display: flex;
				justify-content: space-between;
				.listLft{
					.lftImg{
						width: 62rpx;
						height: 62rpx;
						margin-right: 10rpx;
						image{
							width: 100%;
							height: 100%;
						}
					}
					.lftInfo{
						display: flex;
						flex-direction: column;
						align-items: center;
						.infoTit{
							font-size: 26rpx;
							line-height: 26rpx;
							color: $c3;
							width: 100rpx;
							display: flex;
							justify-content: flex-start;
						}
						.infoIntro{
							font-size: 22rpx;
							line-height: 22rpx;
							color: $c6;
							width: 100rpx;
							display: flex;
							justify-content: flex-start;
						}
					}
				}
				.listRgt{
					display: flex;
					flex-direction: column;
					width: 300rpx;
					.rgtMoney{
						font-size: 26rpx;
						line-height: 26rpx;
						color: $c3;
						display: flex;
						justify-content: flex-end;
					}
					.rgtFrozen{
						font-size: 22rpx;
						line-height: 22rpx;
						color: #676869;
						display: flex;
						justify-content: flex-end;
					}
				}
			}
		}
	}
	.tranName{
		border: 1px solid #999;
		margin: 60rpx 40rpx 0;
		border-radius: 6rpx;
		.tranNameTxt{
			padding: 24rpx 0 0 24rpx;
			font-size: 24rpx;
			color: #999;
		}
		.tranNameIpt{
			padding: 10rpx 12rpx 10rpx;
			display: flex;
			justify-content: space-between;
			font-size: 28rpx;
			.tranIcon:before{
				color: #999;
			}
		}
	}
	.tranArea{
		margin: 70rpx 40rpx 0;
		display: flex;
		justify-content: space-between;
		.tranAreaLft, .tranAreaRgt{
			position: relative;
			.areaLftName, .areaRgtName{
				border: 1px solid #999;
				border-radius: 6rpx;
				color: $c3;
				padding: 22rpx 80rpx;
			}
			.areaRgtDown{
				position: absolute;
				right: 20rpx;
				top: 24rpx;
			}
			.areaRgtDown:before{
				color: #999;
			}
			.areaRgtDownList{
				border: 1px solid #999;
				background-color: #fff;
				position: absolute;
				width: 100%;
				top: 95rpx;
				z-index: 9;
				view{
					color: #999;
					margin: 10rpx 15rpx;
				}
			}
		}
		
		.tranAreaIcon{
			display: flex;
			align-items: center;
		}
		.tranAreaIcon:before{
			color: #999;
			font-size: 48rpx;
		}
	}
	.tranUse{
		margin: 10rpx 40rpx 0;
		color: $c3;
	}
	.tranAmount{
		margin: 30rpx 40rpx 0;
		border: 1px solid #999;
		border-radius: 6rpx;
		padding: 20rpx 0;
		position: relative;
		.amountName{
			position: absolute;
			right: 30rpx;
			top: 25rpx;
			color: #999;
			display: flex;
			view{
				margin: 0 8rpx;
			}
			.tranKindName{
				
			}
			.tranLine{
				background-color: #f7f7f7;
				width: 1px;
				height: 35rpx;
				display: flex;
				align-items: center;
			}
			.tranAll{
				color: $c3;
			}
		}
	}
	.tranConfirm{
		margin: 80rpx 40rpx 0;
		button{
			background-color: #b8393c;
			color: #fff;
		}
	}
</style>
