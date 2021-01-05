<template>
	<view class="mainBox" >
		<view class="navBarCon" v-if="isNavBar">
			<view @click="navBarEvent(0)">抢购收益</view>
			<view @click="navBarEvent(1)">分享收益</view>
		</view>
		
		<view class="transacMain">
			<view class="tranTit">
				<view class="" v-for="(item, index) in tranNavList" :key="index" @click="tranNavEvent(item, index)" :class="{choiceTran: choiceOn == index}">{{item.name}}</view>
			</view>
		</view>
		
		<template v-if="choiceOn == 0">
			<view class="transac mainBox" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx'}">
				<view class="sacCon">
					<view class="sacTit">
						<view class="titLft">
							<view @click.stop="titMenuEvent">
								<span class="titMenu i-menu" ></span>
								<text>{{titMenu}}</text>
							</view>
							<view class="titMenuList" v-if="isTitMenu">
								<text v-for="(item, index) in titMenuList" :key="item.fid" @click="titMenuListEvent(item)">{{item.fname_sn}}</text>
							</view>
						</view>
						<view class="titRgt">
							<view @click="klineDiagramEvent" class="titQuota i-quota"></view>
							<view class="titStar i-star"></view>
						</view>
					</view>
          <view class="sacBody">
            <view class="bodyLft">
              <view class="sacBtn">
                <view class="sacBuyBtn" :class="{'sacBtnChoice': sacOn !== 1}" @click.stop="sacBuyEvent">买入</view>
                <view class="sacSaleBtn" :class="{'sacBtnChoice': sacOn === 1}" @click.stop="sacSaleEvent">卖出</view>
              </view>
              <view class="fixPrice">
                <text>限价</text>
              </view>
              <view class="sacIpt">
                <view v-if="sacOn !== 1">
                  <view class="priceIpt" >
                    <text class="iptPlus">+</text>
                    <input class="ipt" v-model="iptPrice" type="text" placeholder="价位">
                    <text class="iptReduce">-</text>
                  </view>
                  <view class="quantityIpt priceIpt">
                    <text @click="quantityEvent(0)" class="iptPlus">+</text>
                    <input class="ipt" v-model="iptQuantity" @input="iptQuantityEvent" type="number" placeholder="数量">
                    <text @click="quantityEvent(1)" class="iptReduce">-</text>
                  </view>
                  <view class="totalIpt priceIpt">
                    <input type="text" v-model="totalNum" placeholder="总额USDT" disabled>
                  </view>
                </view>

                <view v-if="sacOn === 1">
                  <view class="priceIpt" >
                    <text class="iptPlus">+</text>
                    <input class="ipt" v-model="iptPrice" type="text" placeholder="价位">
                    <text class="iptReduce">-</text>
                  </view>
                  <view class="quantityIpt priceIpt">
                    <text @click="quantityEvent(0)" class="iptPlus">+</text>
                    <input class="ipt" v-model="iptQuantity" @input="iptQuantityEvent" type="number" placeholder="数量">
                    <text @click="quantityEvent(1)" class="iptReduce">-</text>
                  </view>
                  <view class="totalIpt priceIpt">
                    <input type="text" v-model="totalNum" placeholder="总额USDT" disabled>
                  </view>
                </view>
              </view>
              <view class="sacOpera" @click="sacOperaEvent">
                <view class="operaBtn">{{operaStatus}}</view>
              </view>
              <view class="sacStatus">
                <view class="usable statusView">
                  <text>可用</text>
                  <text>{{ftotal}} {{unitKind}}</text>
                </view>
                <view class="lockout statusView">
                  <text>锁定</text>
                  <text>{{ffrozen}} {{unitKind}}</text>
                </view>
                <view class="statusTotal statusView">
                  <text>总资产</text>
                  <text> {{accAdd(ftotal, ffrozen)}} {{unitKind}}</text>
                </view>
              </view>
            </view>
						<view class="bodyRgt">
							<view class="rgtTit">
								<text>价格(USDT)</text>
								<text>数量</text>
							</view>
							<view class="rgtList">
								<view class="listTop">
									<view v-for="(item, index) in reverseTopList" @click="priceEvent(item)" :key="index" v-if="index < 6">
										<view style="z-index: 9;">
											<text>{{toDecimal(item.price, priceDecimals)}}</text>
											<text>{{toDecimal(item.quantity, amountDecimals)}}</text>
										</view>
										<view class="perLine" :style="{width: lineArr[index] + 'rpx'}"></view>
									</view>
								</view>
								<view class="listMid">
									<view class="midQuantity">{{last}}</view>
									<view class="midNum">
										<text class="midNumPrice">¥ {{ accMul(last, cny) }}</text>
										<text class="midNumPer" :style="{color: parseFloat(fupanddown)>0?'#3ba987':'#bd3a3b'}">{{( accMul(fupanddown, 100) ).toFixed(2)}}%</text>
									</view>
								</view>
								<view class="listTop listBtm">
									<view v-for="(item, index) in btmList" @click="priceEvent(item)" :key="index" v-if="index < 6">
										<view style="z-index: 9;">
											<text>{{toDecimal(item.price, priceDecimals)}}</text>
											<text>{{toDecimal(item.quantity, amountDecimals)}}</text>
										</view>
										<view class="perLine" :style="{width: btmLineArr[index] + 'rpx'}"></view>
									</view>
								</view>
							</view>
						</view>
          </view>
          <view class="reminder">
            <view class="remTit">
              <span class="remIco i-warn"></span>
              <text>温馨提示</text>
            </view>
            <view class="remTxt">
              <text>
								交易前请注意查看净值价格，请正确输入交易数量。
              </text>
            </view>
          </view>
          <view class="entrust">
            <view class="entrustTit">
              <view>
                <text>限价委托</text>
                <view class="record" @click="orderHistoryEvent">
                  <span class="recordIco i-record"></span>
                  <text>交易记录</text>
                </view>
              </view>
            </view>
          </view>
          <view class="entrustSwitch">
            <view :class="{'enChoice': enOn !== 1}" @click="enSwitchEvent(0)">限价委托</view>
            <view :class="{'enChoice': enOn === 1}" @click="enSwitchEvent(1)" v-if="false">计划委托</view>
          </view>
          <view class="enConTit">
            <view>{{titMenu}}</view>
            <view v-if="false">撤单</view>
          </view>
          <view class="enConList">
            <view class="enList" v-for="(item, index) in entrustList" :key="item.id">
							<view class="viewEnList">
								<view><text>时间</text><text>{{getLocalTime(item.time)}}</text></view>
								<view><text>价格({{item.buyName}})</text><text>{{item.price}}</text></view>
								<view><text>数量({{item.sellName}})</text><text>{{item.count}}</text></view>
								<view><text>成交总额({{item.sellName}})</text><text>{{item.count}}</text></view>
								<view><text>成交均价</text><text>{{item.avgPrice}}</text></view>
								<view><text>成交量({{item.buyName}})</text><text>{{item.successAmount}}</text></view>
							</view>
							<view class="viewOpera" @click="enCancelEvent(item)">
								<view>撤单</view>
							</view>
            </view>
          </view>
				</view>
        <uni-popup ref="popup" type="dialog">
          <uni-popup-dialog iptType="password" title="交易密码" :duration="2000" mode="input" placeholder="请输入交易密码" :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
        </uni-popup>
			</view>
		</template>

		<template v-if="choiceOn == 1">
				<tranContract></tranContract>
		</template>
		<template v-if="choiceOn == 2">
			<tranLegal />
		</template>
		
		<unitabbar :switchOn = "2"></unitabbar>
	</view>
</template>
<script>
	
	import transac from './transac'
	import tranContract from './tranContract/tranContract'
	import tranLegal from './tranLegal'

  import  { accMul, accAdd, checkNum, isObject } from '../../utils/common.js'
	import { unimixin } from '../../utils/unimixin.js'
  import uniPopup from '../../components/uni-popup/uni-popup.vue'
  import uniPopupDialog from '../../components/uni-popup/uni-popup-dialog.vue'
	
	import unitabbar from '../../components/uni-tarbar/tarBar.vue'

	export default {
		components: { transac, tranLegal, tranContract, uniPopup, uniPopupDialog, unitabbar},
		mixins: [ unimixin ],
		data(){
			return{
				tranNavList: [{name: '币币交易'},{name: '合约交易'},{name: '法币交易'}],
				quotatList: [],
				isNavBar: false,
				choiceOn: 0,
        sacOn: 0,
        enOn: 0,
        last: 0,
        cny: '',
        fupanddown: 0,
        iptPrice: '',
        ftotal: '0',
        ffrozen: '0',
        iptQuantity: '',
        totalNum: '',
        titMenu: 'DPC / USDT',
        lineArr: [],
        btmLineArr: [],
        enConList: [],
        entrustList: [],
        entrustSell: [],
        titMenuList: [],
        operaStatus: '买入',
        topList: [],
        btmList: [],
        unitKind: 'USDT',

        recommendPrizesell: '',
        recommendPrizebuy: '',

        getStroageTradePwd: '',

        symbolID: '1',

        isTitMenu: false,
        isScoket: false,
				
				socketTask: null,
				
				priceDecimals: '',
				amountDecimals: '',
				
				isCreated: true,
				getSocketId: '3',
				
				initCoinSellType: '',
				initCoinTradeType: '',
				initCoinSellTypeOnLoad: '',
				
				klineId: '3',
				klineSymbolId: ''
			}
		},
		onLoad(options) {
			if(options.symbol){
				this.klineSymbolId = options.symbol
				this.getSocket(this.klineSymbolId)
				this.isCreated = false
				
				setTimeout(()=>{
					for(let i in this.titMenuList){
						if(this.titMenuList[i].fid == this.klineSymbolId){
							this.titMenu = this.titMenuList[i].fname_sn
							this.amountDecimals = this.titMenuList[i].amountDecimals
							this.priceDecimals = this.titMenuList[i].priceDecimals
							this.initCoinSellTypeOnLoad = this.titMenuList[i].coinSellType
						}
					}
				},500)
			}else{
				if(options.choiceOn == 0){
					if(options.transacInfo){
						const transacInfo = JSON.parse(decodeURIComponent(options.transacInfo));
						
						this.initCoinSellTypeOnLoad = transacInfo.coinSellType
						if(transacInfo){
							this.titMenu = transacInfo.fname_sn
							this.klineId = this.moneyDataFid = this.getSocketId =  transacInfo.fid
							this.amountDecimals = transacInfo.amountDecimals
							this.priceDecimals = transacInfo.priceDecimals
							this.getSocket(this.moneyDataFid)
							this.choiceOn = options.choiceOn
							this.isCreated = false
						}
					}
				}else if(options.choiceOn != 0){
					this.choiceOn = options.choiceOn
				}else{
				}
			}
			
		},

		onShow(){

		},
		onHide() {
			this.isNavBar = false
			uni.removeStorageSync('tranAssetsMain')
			uni.removeStorage({
				key: 'quotatList'
			})
		},
		methods: {
			touchEnd(e){
				if(this.changeY > 50){
					this.paddingTop = 0
					this.getSocket(this.getSocketId)
						/* this.getSocket('3')
						this.priceDecimals = '6'
						this.amountDecimals = '2' */
					this.getTitMenuList()
					this.getEnConList()
					this.getRate()
					this.getTotal()
					this.initTitBuyMenuListEvent()
				}
			},
			klineDiagramEvent(){
				uni.reLaunch({
					url: '/pages/klineDiagram/klineDiagram?symbol=' + this.klineId + '&category=1',
					success: () => {}
				})
			},
			
			/* 委托撤销 */
			enCancelEvent(item){
				this.ajaxJson({
					url: '/api/v2/market/cancelEntrust',
					method: 'POST',
					data: {id: item.id},
					call: (data)=>{
						if(data.code == 200){
							uni.showToast({
								title: data.msg,
								success: () => {
									this.getEnConList()
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
			},
			getTranMain(moneyDataFid){
				return
				this.symbolID = moneyDataFid
				this.getEnConList()
				this.closeWebsocket()
				this.getSocket(this.symbolID)
			},
			
			// closeWebsocket(){
			// 	if(this.socketTask != null){
			// 		this.socketTask.close()
			// 	}
			// },
			
      /* 交易记录  */
      orderHistoryEvent(){
        uni.navigateTo({
          url: '/pages/transac/transacOrder/transacHistoryOrder?symbol=' + this.symbolID
        })
      },
      titMenuEvent(){
        this.isTitMenu = !this.isTitMenu
      },
      getSocket(moneyDataFid){
        this.socketTask = uni.connectSocket({
          url: 'wss://www.dpro.ltd/socket.io/?deep=4&token=dev&symbol=' + moneyDataFid + '&EIO=3&transport=websocket',
          method: 'POST',
          success: (res)=>{
            console.log('WebSocket连接成功...');
          }
        })
				
				this.socketTask.onOpen((res)=>{
					console.log('WebSocket连接正常打开中...')
					this.socketTask.send({
						data: '40/trade',
						async success(){
							console.log('WebSocket消息发送成功')
						}
					})
					this.socketTask.onMessage((res)=>{
						console.log('WebSocket接受服务器数据...')
						let data = res.data.replace("42/trade,","")
						if(data.indexOf('entrust-buy') !== -1){
							let obj = []
							let entrustBuy = data.replace('["entrust-buy","[','').replace(']"]','')
							let json =  entrustBuy.split('],[')
							for(let i in json){
								obj.push(json[i].replace('[','').replace(']',''))
							}
							
							this.btmList = []
							for(let i of obj){
								this.btmList.push({price: i.split(',')[0] , quantity: i.split(',')[1]})
							}
							this.calcLine()
						}else if(data.indexOf('entrust-sell') !== -1) {
							let obj = []
							let entrustSell = data.replace('["entrust-sell","[','').replace(']"]','')
							let json =  entrustSell.split('],[')
							for(let i in json){
								obj.push(json[i].replace('[','').replace(']',''))
							}
							this.topList= []
							for(let i of obj){
								this.topList.push({price: i.split(',')[0] , quantity: i.split(',')[1]})
							}

							if(this.topList.length >= 5){
								this.topList = this.topList.slice(0, 6)
							}else{
								this.topList = this.topList.slice(0,this.topList.length-1)
							}
							this.calcLine()
						}else if(data.indexOf('real') !== -1) {
							this.last = JSON.parse( JSON.parse(data)[1]).last
							this.fupanddown = JSON.parse( JSON.parse(data)[1]).fupanddown
						}else if(data.indexOf('entrust-update') !== -1){
							// this.recommendPrizesell = JSON.parse( JSON.parse(data)[1] ).recommendPrizesell
							// this.recommendPrizebuy = JSON.parse( JSON.parse(data)[0] ).recommendPrizebuy
						}
					})
        })
      },

      /* 买入切换 */
      sacBuyEvent(){
        this.sacOn = 0
        this.operaStatus = '买入'
        this.unitKind = 'USDT'
        // this.titMenu = 'BTC / USDT'
        this.initTitBuyMenuListEvent()
				this.iptQuantity = ''
				this.iptPrice = ''
				this.totalNum = ''
				
      },
      /* 卖出切换 */
      sacSaleEvent(){
        this.sacOn = 1
        this.operaStatus = '卖出'
        this.initTitSellMenuListEvent(this.initCoinSellTypeOnLoad)
				this.iptQuantity = ''
				this.iptPrice = ''
				this.totalNum = ''
				// this.unitKind = 'DPC'
      },
      confirm(done, value){
        if(!value){
          uni.showToast({
            image: '../../static/images/wrong.png',
            title: '请输入交易密码'
          })
        }else{
          this.tranSellBuy(value)
        }
      },
      close(){
        this.$refs.popup.close()
      },
      sacOperaEvent(){

        this.getTradePwd()
        if(!this.iptPrice){
          uni.showToast({
            image: '../../static/images/wrong.png',
            title: '请输入价位'
          })
        }else if(!this.iptQuantity){
          uni.showToast({
            image: '../../static/images/wrong.png',
            title: '请输入数量'
          })
        }else{
          if(this.getStroageTradePwd == ''){
            this.$refs.popup.open()
          }else{
            this.tranSellBuy(this.getStroageTradePwd.data)
          }
        }
      },
      getTradePwd(){
        uni.getStorage({
          key: 'tradePwd',
          success: (data) => {
            this.getStroageTradePwd = data
          }
        })
      },
      clearTranPwd(){
        let count = 2 * 60 * 60
        clearInterval(timer)
        let timer = setInterval(()=>{
          count--
          if(count == 0){
            uni.removeStorage({
              key: 'tradePwd',
              success: () => {
              }
            })
          }
        }, 1000)
      },
      tranSellBuy(value){
        let url = ''
        let type = ''
        if(this.sacOn == 0){   //买入
          url = '/api/v2/market/buyBtcSubmit'
          type = 'buy'
        }else{                 //卖出
          url = '/api/v2/market/sellBtcSubmit'
          type = 'sell'
        }

        let params = {
          symbol: this.getSocketId,
          tradeAmount: this.iptQuantity,
          tradeCnyPrice: this.iptPrice,
          type: type,
          tradePwd: value
        }
        this.ajaxJson({
          url: url,
          data: params,
          method: 'POST',
          call: (data)=>{
            if(data.code == 200){
              uni.showToast({
                title: data.msg,
                success: () => {
                  this.$refs.popup.close()
									this.getEnConList()
									this.titMenuListEvent()
                  uni.setStorage({
                    key: 'tradePwd',
                    data: value,
                    success: () => {
                      this.iptPrice = ''
                      this.iptQuantity = ''
                      this.totalNum = ''
                      this.clearTranPwd()
                    }
                  })
                }
              })
            }else{
              uni.showToast({
                image: '../../static/images/wrong.png',
                title: data.msg,
                success: () => {
                  this.$refs.popup.close()
                }
              });
            }
          }
        })
      },
      /*  限定输入数量  */
      iptQuantityEvent(){
        if(checkNum(this.iptQuantity) || this.iptQuantity == ''){
          uni.showToast({
            image: '../../static/images/wrong.png',
            title: '数量格式不正确，请重新输入',
            success: () => {
              this.iptQuantity = ''
            }
          })
        }
        this.calcTotal()
      },
      calcTotal(){
        if(this.iptPrice && this.iptQuantity){
          this.totalNum = accMul(this.iptPrice, this.iptQuantity)
        }else{
          this.totalNum = ''
        }
      },
      /* 数量加减操作 */
      quantityEvent(num){
        if(num === 0){
          this.iptQuantity = parseInt(this.iptQuantity) + 1
          this.calcTotal()
        }else{
          if(parseInt(this.iptQuantity) >= 1){
            this.iptQuantity = parseInt(this.iptQuantity) - 1
          }else{
            this.iptQuantity = 0
          }
          this.calcTotal()
        }
      },
      calcLine(){
        let maxArr = []
        for(let i in this.reverseTopList){
          if(i < 6){
            maxArr.push(this.reverseTopList[i].quantity)
          }
        }
        this.lineArr = []
        let max = Math.max(...maxArr)
        for(let i in maxArr){
          this.lineArr.push( (maxArr[i] / max) * 326 )
        }
        let btmMaxArr = []
        for(let i in this.btmList){
          if(i < 6){
            btmMaxArr.push(this.btmList[i].quantity)
          }
        }
        let btmMax = Math.max(...btmMaxArr)
        this.btmLineArr = []
        for(let i in btmMaxArr){
          this.btmLineArr.push( (btmMaxArr[i] / btmMax) * 326 )
        }
      },
      priceEvent(item){
        this.iptPrice = item.price
        this.calcTotal()
      },
      /* 限价和计划委托切换 */
      enSwitchEvent(index){
        this.enOn = index
      },
      getEnConList(){
        let params = {id: this.getSocketId, page: '1',pageSize: '10'}

        this.ajaxJson({
          url: '/api/v1/account/opening',
          data: params,
          method: 'POST',
          call: (data)=>{
            this.entrustList = data.data.rows
          }
        })
      },
      getRate(){
        uni.getStorage({
          key: 'rate',
          success: (res)=>{
            this.cny = res.data.rate
          },
        })
      },
      getTotal(){
        this.ajaxJson({
          url: '/api/v1/account/balances',
          method: 'POST',
          call: (data)=>{
          }
        })
      },
      getTitMenuList(){
        this.ajaxJson({
          url: '/api/v2/market/coins',
          call: (data)=>{
            this.titMenuList = data.dataMap.USDT
						this.initCoinSellType = this.titMenuList[0].coinSellType
          }
        })
      },
      titMenuListEvent(item){
				this.initCoinSellTypeOnLoad = ''
				this.amountDecimals = item.amountDecimals
				this.priceDecimals = item.priceDecimals
				this.initCoinSellType = item.coinSellType
				this.klineId = this.getSocketId = item.fid
				this.socketTask.close()
        this.getSocket(item.fid)
        this.symbolID = item.fid
        let params = {}
        if(this.sacOn == 0){
          params = {
            fvid: '50',
          }
          this.unitKind = 'USDT'
        }else{
          params = {
            fvid: item.coinSellType
          }
					this.unitKind = item.fShortName
        }
        this.getEnConList()
        this.isTitMenu = false
        this.titMenu = item.fname_sn
        this.ajaxJson({
          url: '/api/v1/account/balances/byFvid',
          data: params,
          call: (data)=>{
            this.ftotal = data.data.ftotal
            this.ffrozen = data.data.ffrozen
          }
        })
      },
      initTitBuyMenuListEvent(){
        this.ajaxJson({
          url: '/api/v1/account/balances/byFvid',
          data: {fvid: '50'},
          call: (data)=>{
            this.ftotal = data.data.ftotal
            this.ffrozen = data.data.ffrozen
          }
        })
      },
      initTitSellMenuListEvent(initCoinSellTypeOnLoad){
        this.ajaxJson({
          url: '/api/v1/account/balances/byFvid',
          data: {fvid: initCoinSellTypeOnLoad || this.initCoinSellType},
          call: (data)=>{
            this.ftotal = data.data.ftotal
            this.ffrozen = data.data.ffrozen
						this.unitKind = data.data.fvirtualcointype.fShortName
          }
        })
      },

			tranNavEvent(item, index){
				this.choiceOn = index
				this.isNavBar = false
				if(this.choiceOn != 1){
					let webView = this.$mp.page.$getAppWebview();
					webView.setTitleNViewButtonStyle(0,{  
						text: ' ',  
					})
				}
			},
			navBarEvent(index){
				if(index == 0){
					uni.navigateTo({
						url: '/pages/transac/tranContract/tranAssetsFailPurchase'
					})
				}else if(index == 1){
					uni.navigateTo({
						url: '/pages/transac/tranContract/transAssetsShare'
					})
				}
				this.isNavBar = false
			}
		},
		onNavigationBarButtonTap(e) {

			if (e.float == 'right') {
				if(this.choiceOn == 1){
					this.isNavBar = !this.isNavBar
				}
			}
		},
    computed: {
      reverseTopList() {
        return this.topList.reverse();
      },
    },
		created() {
			
			if(this.isCreated){
				this.getSocket('3')
				this.priceDecimals = '6'
				this.amountDecimals = '2'
			}
      this.getTitMenuList()
      this.getEnConList()
      this.getRate()
      this.getTotal()
      this.initTitBuyMenuListEvent()
				let webView = this.$mp.page.$getAppWebview();
				webView.setTitleNViewButtonStyle(0,{
					text: ' ',  
				})
		}
	}
</script>

<style scoped lang="scss">
	.viewOpera{
		margin-top: 0;
		display: flex;
		justify-content: flex-end;
		view{
			color: #fff;
			border: 2px solid #303030;
			padding: 3rpx 20rpx;
			border-radius: 8rpx;
		}
	}
	.navBarCon{
		position: fixed;
		top: 0;
		right: 20rpx;
		border: 1px solid #676869;
		background-color: #303030;
		z-index: 9;
		view{
			font-size: 28rpx;
			display: flex;
			flex-wrap: nowrap;
			padding: 10rpx;
			color: #fff;
		}
	}
	.transacMain{
		.tranTit{
			display: flex;
			justify-content: space-between;
			margin: 0 100rpx;
			view{
				color: #7E7C8A;
				font-size: 28rpx;
				line-height: 56rpx;
			}
			view.choiceTran{
				position: relative;
			}
			view.choiceTran:after{
				content: '';
				display: inline-block;
				position: absolute;
				text-align: center;
				left: 0;
				bottom: 0;
				width: 100%;
				height: 6rpx;
				border-radius: 2rpx;
				background-color: #fff;
			}
		}
	}
.transac{
		.sacCon{
			.sacTit{
				display: flex;
				justify-content: space-between;
				margin: 50rpx 35rpx 0;
				.titLft{
					.titMenu:before{
						color: #fff;
					}
					text{
						color: #fff;
						margin-left: 35rpx;
					}
					.titMenuList{
						position: absolute;
						z-index: 9;
						left: 60rpx;
						border: 1px solid #676869;
						background-color: #303030;
						display: flex;
						flex-direction: column;
						padding: 5rpx 10rpx;
						text{
							margin-left: 0;
							font-size: 24rpx;
							margin: 5rpx 0;
						}
					}
				}
				.titRgt{
					display: flex;
					flex-direction: row;
					.titQuota:before{
						color: #BD3A3B;
					}
					.titStar{
						margin-left: 74rpx;
					}
					.titStar:before{
						color: #403F45;
					}
				}
			}
			.sacBody{
				display: flex;
				justify-content: space-between;
				margin: 0 20rpx;
				.bodyLft{
					.sacBtn{
						margin-top: 55rpx;
						background-color: #303030;
						display: flex;
						justify-content: space-between;
						align-items: center;
						border-radius: 30rpx;
						view{
							text-align: center;
							line-height: 60rpx;
							height: 60rpx;
							width: 184rpx;
						}
						.sacBtnChoice{
							border-radius: 30rpx;
							background: linear-gradient(#EA4F6E, #EB5F60);;
							color: #fff;
						}
					}
					.fixPrice{
						margin: 38rpx auto;
						text{
							color: #FFFFFF;
							font-size: 24rpx;
							line-height: 24rpx;
						}
					}
					.sacIpt{
						view{
							.quantityIpt, .totalIpt{
								margin-top: 55rpx;
							}
							.totalIpt{
								input{
									text-align: center;
								}
							}
							.priceIpt{
								display: flex;
								justify-content: space-between;
								align-items: center;
								width: 382rpx;
								height: 80rpx;
								border: 1px solid #6A3434;
								border-radius: 10rpx;
								text{
									width: 80rpx;
									line-height: 80rpx;
									color: #8E8C9A;
									text-align: center;
								}
								.ipt{
									width: 222rpx;
									height: 80rpx;
									text-align: center;
									border-right: 1px solid #6A3434;
									border-left: 1px solid #6A3434;
								}
							}
						}
					}
					.sacOpera{
						margin-top: 30rpx;
						.operaBtn{
							width: 382rpx;
							height: 80rpx;
							line-height: 80rpx;
							text-align: center;
							color: #fff;
							background: linear-gradient(#FD3E6B, #FF614F);
						}
					}
					.sacStatus{
						.statusView{
							display: flex;
							justify-content: space-between;
							text{
								font-size: 24rpx;
								line-height: 24rpx;
							}
							text:nth-of-type(1){
								color: #9896A4;
							}
							text:nth-of-type(2){
								color: #9896A4;
							}
						}
						.usable, .lockout{
							margin-top: 38rpx;
						}
						.lockout{
							padding-bottom: 28rpx;
							border-bottom: 1px solid #4C3232;
						}
						.statusTotal{
							margin-top: 28rpx;
						}
					}
				}
				.bodyRgt{
					width: 100%;
					margin-left: 10rpx;
					.rgtTit{
						margin-top: 70rpx;
						display: flex;
						justify-content: space-between;
						text{
							color: #8E8C9A;
							font-size: 24rpx;
							line-height: 24rpx;
						}
					}
					.rgtList{
						margin-top: 40rpx;
						width: 326rpx;
						.listTop{
							view{
								margin-top: 12rpx;
								height: 46rpx;
								align-items: center;
								// background-color: #4C3232;
								position: relative;
								view{
									display: flex;
									justify-content: space-between;
									text{
										font-size: 22rpx;
										line-height: 22rpx;
									}
									text:nth-of-type(1){
										color: #BD3A3B;
									}
									text:nth-of-type(2){
										color: #9492A0;
									}
								}
								.perLine{
									position: absolute;
									background-color: #4C3232;
									top: -18rpx;
									right: 0;
									height: 46rpx;
									z-index: 8;
								}
							}
						}
						.listMid{
							margin-top: 15rpx;
							border-top: 1px solid #393745;
							border-bottom: 1px solid #393745;
							padding: 18rpx 0;
							.midQuantity{
								color: #3BA987;
								font-size: 30rpx;
								line-height: 30rpx;
							}
							.midNum{
								margin-top: 18rpx;
								display: flex;
								justify-content: space-between;
								.midNumPrice, .midNumPer{
									font-size: 24rpx;
									line-height: 24rpx;
									white-space: nowrap;
								}
								.midNumPrice{
									color: #A3A1AF;
								}
								.midNumPer{
									color: #3BA987;
								}
							}
						}
						.listBtm{
							margin-top: 14rpx;
						}
					}
				}
			}
			.reminder{
				margin: 46rpx 30rpx 0;
				background-color: #3E3131;
				padding: 20rpx 30rpx;
				.remTit{
					display: flex;
					align-items: center;
					flex-direction: row;
					.remIco:before{
						color: #BD3A3B;
					}
					text{
						color: #BD3A3B;
						margin-left: 10rpx;
						font-size: 24rpx;
						line-height: 24rpx;

					}
				}
				.remTxt{
					text{
						color: #BD3A3B;
						font-size: 24rpx;
						line-height: 24rpx;
					}
				}
			}
			.entrustTit{
				margin: 22rpx 30rpx 28rpx 30rpx;
				padding-bottom: 15rpx;
				border-bottom: 1px solid #4A4856;
				view{
					display: flex;
					justify-content: space-between;
					text:nth-of-type(1){
						color: #fff;
						font-size: 32rpx;
						line-height: 32rpx;
					}
					.record{
						display: flex;
						align-items: center;
						.recordIco::before{
							color: #706E7C;
						}
						text{
							color: #999;
							font-size: 28rpx;
							line-height: 28rpx;
						}
					}
				}
			}
			.entrustSwitch{
				margin: 45rpx 162rpx 0;
				display: flex;
				// justify-content: space-between;
				justify-content: center;
				view{
					width: 190rpx;
					height: 60rpx;
					text-align: center;
					line-height: 60rpx;
					font-size: 28rpx;
					color: #999;
				}
				view.enChoice{
					border-radius: 30rpx;
					background-color: #303030;
					color: #BD3A3B;
				}
			}
			.enConTit{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 52rpx 40rpx 0;
				
				view:nth-of-type(1){
					color: #999;
					font-size: 28rpx;
					line-height: 28rpx;
				}
				view:nth-of-type(2){
					width: 100rpx;
					height: 58rpx;
					background-color: #2D2D2D;
					color: #999;
					font-size: 28rpx;
					line-height: 28rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
			.enConList{
				margin: 45rpx 30rpx 0;
				border-top: 2px solid #303030;
				.enList>.viewEnList:last-child{
					border-bottom: none;
				}
				.enList{
					padding-bottom: 15rpx;
					.viewEnList{
						display: flex;
						justify-content: space-between;
						flex-wrap: wrap;
						view{
							display: flex;
							flex-wrap: wrap;
							flex-direction: column;
							margin-top: 15rpx;
							
							padding-bottom: 15rpx;
							text{
								font-size: 24rpx;
								white-space: nowrap;
							}
							text:nth-of-type(1){
								font-size: 26rpx;
								line-height: 26rpx;
								color: #676869;
							}
							text:nth-of-type(2){
								margin-top: 20rpx;
								font-size: 24rpx;
								line-height: 24rpx;
								color: #fff;
							}
						}
						view:nth-child(1){
							width: 270rpx;
						}
						view:nth-child(4){
							width: 270rpx;
						}
						view:nth-child(2){
							width: 260rpx;
						}
						view:nth-child(5){
							width: 260rpx;
						}
						view:nth-child(3){
							width: 140rpx;
						}
						view:nth-child(6){
							width: 140rpx;
						}
					}
				}
			}
		}
	}


</style>
