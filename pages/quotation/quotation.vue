<template>
  <view class="quota mainBox"  @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" :style="{paddingTop: paddingTop + 'rpx', height: screamH + 'rpx'}">
    <view class="topSwitch">
      <view :class="switchOn === index ? 'choice' : ''" @click="switchEvent(index)" v-for="(item, index) in switchList" :key="item.id">{{item.name}}</view>
    </view>
    <view class="kindSwitch">
      <view :class="kindOn === index ? 'kindChoice' : ''" @click="kindEvent(index)" v-for="(item, index) in kindList" :key="item.id">{{item.name}}</view>
    </view>
    <view class="quotaBox">
      <view class="quotaTit">
        <text>市场/成交额</text>
        <text>最新价</text>
        <text>24h涨幅</text>
      </view>
      <view class="quotaList" v-if="switchOn !== 0">
        <view @click="listConEvent(item)" class="listCon" v-for="(item, index) in quotaList" :key="item.fid">
          <view @click.stop="collectEvent(item, index, switchOn)" class="collectIcon i-star" :class="{'i-stared': starIndex.indexOf(index)>-1}"></view>
          <view class="listLft">
            <text class="lftName">{{item.fShortName}} / {{item.group}}</text>
            <text class="lftMoney">成交额：{{item.fentrustValue}}</text>
          </view>
          <view class="listMid">
            <text class="midNewPrice">{{item.lastDealPrize}}</text>
            <text class="midNewCny">¥{{accMul(item.lastDealPrize, usdtRate).toFixed(2)}} CNY</text>
          </view>
          <view class="listRgt">
            <view class="rgtIncre" :style="{color: parseFloat(item.fupanddown)>0?'#3ba987':'#bd3a3b'}">{{parseFloat(item.fupanddown) > 0 ?  '+' + item.fupanddown : item.fupanddown}}%</view>
          </view>
        </view>
      </view>
      
      <view class="quotaList" v-if="switchOn === 0">
        <view @click="listConEvent(item)" class="listCon" v-for="(item, index) in newQuotaList" :key="item.fid">
          <view @click.stop="collectEvent(item, index, switchOn)" class="collectIcon i-stared" :class="{'i-star': !starIndex.indexOf(index)>-1}"></view>
          <view class="listLft">
            <text class="lftName">{{item.fShortName}} / {{item.group}}</text>
            <text class="lftMoney">成交额：{{item.fentrustValue}}</text>
          </view>
          <view class="listMid">
            <text class="midNewPrice">{{item.lastDealPrize}}</text>
            <text class="midNewCny">¥ {{accMul(item.lastDealPrize, usdtRate).toFixed(2)}} CNY</text>
          </view>
          <view class="listRgt">
            <view class="rgtIncre" :style="{color: parseFloat(item.fupanddown)>0?'#3ba987':'#bd3a3b'}">{{parseFloat(item.fupanddown) > 0 ?  '+' + item.fupanddown : item.fupanddown}}%</view>
          </view>
        </view>
      </view>
    </view>
    
    <unitabbar :switchOn = "1"></unitabbar>
  </view>
</template>

<script>
  import unitabbar from '../../components/uni-tarbar/tarBar.vue'
  import { unimixin } from '../../utils/unimixin.js'
  export default{
    components: { unitabbar },
    mixins: [ unimixin ],
    data(){
      return{
        switchList: [{name: '自选',id: '1'},{name: '全部',id: '2'}],
        switchOn: 1,
        kindList: [{name: 'USDT',id: '1'}],
        kindOn: 0,
        usdtRate: '',
        quotaList: [],
        starIndex: [],
        starIndexOn: [],
        newQuotaList: [],
      }
    },
    onNavigationBarButtonTap(e) {
      if (e.float == 'right') {
        console.log("搜索")
      }
    },
    onLoad() {
      
    },
    methods:{
      touchEnd(e){
        if(this.changeY > 50){
          this.paddingTop = 0
          this.getQuotaList()
          this.initQuotalist()
        }
      },

      /* 行情跳转K线图 */
      listConEvent(item){
        uni.reLaunch({
          url: '/pages/klineDiagram/klineDiagram?symbol=' + item.fid + '&category=0',
          success: () => {}
        })
      },
      /* 顶部切换 */
      switchEvent(index){
        this.switchOn = index
      },
      /* 种类切换 */
      kindEvent(index){
        this.kindOn = index
      },
      /* 收藏 */
      collectEvent(item, index, switchOn){
        if(switchOn === 1){
          let arrIndex = this.starIndex.indexOf(index);
          if(arrIndex > -1){
            this.starIndex.splice(arrIndex, 1)
          }else{
            this.starIndex.push(index)
          }
          let newQuotaList = []
          for(let i in this.starIndex){
            this.newQuotaList = []
           newQuotaList.push(this.quotaList[this.starIndex[i]]);
          }
          this.newQuotaList = newQuotaList
        }else{
          this.newQuotaList.splice(index, 1)
          this.starIndex.splice(index, 1)
        }
        uni.setStorage({
          key: 'newQuotaList',
          data: this.newQuotaList,
          success() {
            
          }
        })
        uni.setStorage({
          key: 'starIndex',
          data: this.starIndex,
          success() {
            
          }
        })
      },
      initQuotalist(){
        uni.getStorage({
          key: 'newQuotaList',
          success: (res)=>{
            this.newQuotaList = res.data
          }
        })
        uni.getStorage({
          key: 'starIndex',
          success: (res)=>{
            this.starIndex = res.data
          }
        })
      },
       getQuotaList(){
        this.ajaxJson({
          url: '/api/v2/market/coins',
          call: (res)=>{
            this.quotaList = res.dataMap.USDT
          }
        })
        uni.getStorage({
          key: 'rate',
          success: (res)=>{
            this.usdtRate = res.data.usdt
          },
        })
      }
    },
    created() {
      this.getQuotaList()
      this.initQuotalist()
    }
  }
</script>

<style scoped lang="scss">
  .quota{
    .topSwitch{
      display: flex;
      margin: 0 24rpx;
      padding-top: 20rpx;
      justify-content: space-around;
      view{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 164rpx;
        height: 56rpx;
        font-size: 28rpx;
        color: #6B6C71;
        background-color: #f2f2f2;
        border-radius: 4px;
      }
      view.choice{
        background-color: #BD3A3B;
        color: #fff;
      }
    }
    .kindSwitch{
      margin: 6rpx 210rpx 0;
      display: flex;
      justify-content: space-around;
      view{
        color: #96959B;
        font-size: 28rpx;
        line-height: 88rpx;
        position: relative;
        width: 94rpx;
        text-align: center;
      }
      view.kindChoice{
        color: #BD3A3B;
      }
      view.kindChoice:after{
        position: absolute;
        left: 0;
        bottom: 0;
        content: '';
        display: inline-block;
        margin: 0 auto;
        width: 94rpx;
        height: 4rpx;
        background-color: #BD3A3B;
      }
    }
    .quotaBox{
      border-top: 1px solid #f2f2f2;
      .quotaTit{
        display: flex;
        justify-content: space-between;
        margin: 20rpx 64rpx 0 80rpx;
        text{
          color: #7D7C82;
          font-size: 24rpx;
        }
        text:nth-of-type(1){
          margin-right: 80rpx;
        }
        text:nth-of-type(2){
          margin-right: 40rpx;
        }
      }
      .quotaList{
        .listCon{
          padding: 20rpx 30rpx 0 60rpx;
          display: flex;
          justify-content: space-between;
          // height: 120rpx;
          // padding: 32rpx 0 28rpx 0;
          border-bottom: 1px solid #f2f2f2;
          
          .collectIcon, .listLft, .listMid, .listRgt{
            margin: 32rpx 0 28rpx 0;
          }
          .collectIcon{
            position: absolute;
            left: 20rpx;
          }
          .collectIcon::before{
            color: #403F45;
          }
          .listLft{
            display: flex;
            flex-direction: column;
            color: #8C8B91;
            .lftName{
              font-size: 26rpx;
              line-height: 26rpx;
            }
            .lftMoney{
              margin-top: 10rpx;
              font-size: 24rpx;
              line-height: 24rpx;
              white-space: nowrap;
              width: 320rpx;
            }
          }
          .listMid{
            margin-right: 30rpx;
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 320rpx;
            .midNewPrice{
              font-size: 28rpx;
              color: #BD3A3B;
            }
            .midNewCny{
              font-size: 24rpx;
              line-height: 24rpx;
              color: #8C8B91;
              white-space: nowrap;
            }   
          }
          .listRgt{
            width: 160rpx;
            height: 60rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #BD3A3B;
            border-radius: 4rpx;
          }
        }
        .listCon:last-child{
          border-bottom: none;
        }
      }
    }
  }
</style>
