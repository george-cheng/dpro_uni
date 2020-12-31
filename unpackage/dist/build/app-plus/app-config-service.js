
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/index/index","pages/assets/assets","pages/my/mySetting/payMethod","pages/my/mySetting/bindPayMethod","pages/loginIn/loginIn","pages/quotation/quotation","pages/verifica/verifica","pages/register/register","pages/test/test","pages/transac/tranLegal","pages/my/my","pages/klineQuota/klineQuota","pages/assets/assRecharge","pages/assets/selectLetter","pages/assets/assRecord","pages/assets/rechAddress","pages/assets/assWithDraw","pages/my/safeCenter/safeCenter","pages/my/safeCenter/safePwd","pages/assets/orderRecord","pages/assets/orderRecordDetail","pages/assets/assTranRecord","pages/my/mySetting","pages/my/mySetting/unBindPayMethod","pages/transac/transacMain","pages/sundry/serviceAgreement","pages/my/invitaIncome/invitaIncome","pages/my/invitaIncome/invitaIncomRecord","pages/assets/assTransfer","pages/transac/tranContract/tranContract","pages/transac/tranContract/tranAssets","pages/transac/tranContract/tranAssetsDetail","pages/transac/tranContract/tranAssetsFailPurchase","pages/transac/tranContract/tranAssetsFailPurchaseDetail","pages/transac/tranContract/transAssetsShare","pages/my/authName/authDeepName","pages/my/authName/authName","pages/my/authName/authDeepLoad","pages/my/authName/authDeepComplete","pages/transac/tranLegal/tranLegOrderToPay","pages/transac/transacOrder/transacHistoryOrder","pages/my/personal/personal","pages/assets/assTranAcc/assTranAcc","pages/assets/assTranAcc/assTranAccOrder","pages/holeRedPackage/holeRedPackage","pages/holeRedPackage/holeRedPackageRecord","pages/my/applicant/applicant","pages/my/bussManager/bussManager","pages/my/bussManager/bussManagerOrder","pages/my/bussManager/bussManagerOrderToPay"],"window":{"navigationBarTextStyle":"white","navigationBarTitleText":"Dpro","navigationBarBackgroundColor":"#282828","backgroundColor":"#282828"},"nvueCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"Dpro","compilerVersion":"2.9.8","entryPagePath":"pages/index/index","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/index/index","meta":{"isQuit":true},"window":{"navigationBarTitleText":"Dpro","enablePullDownRefresh":false}},{"path":"/pages/assets/assets","meta":{},"window":{"navigationBarTitleText":"资产","enablePullDownRefresh":false,"titleNView":{"buttons":[{"color":"#fff","colorPressed":"#fff","float":"right","fontSize":"30rpx","text":"明细"}]}}},{"path":"/pages/my/mySetting/payMethod","meta":{},"window":{"navigationBarTitleText":"收款方式","enablePullDownRefresh":false}},{"path":"/pages/my/mySetting/bindPayMethod","meta":{},"window":{"navigationBarTitleText":"绑定","enablePullDownRefresh":false}},{"path":"/pages/loginIn/loginIn","meta":{},"window":{"navigationBarTitleText":"登录","enablePullDownRefresh":false}},{"path":"/pages/quotation/quotation","meta":{},"window":{"navigationBarTitleText":"市场行情","enablePullDownRefresh":false,"titleNView":{"buttons":[{"color":"#fff","colorPressed":"#fff","float":"right","fontSize":"30rpx","fontSrc":"/static/iconfont/fonts/icomoon.ttf","text":""}]}}},{"path":"/pages/verifica/verifica","meta":{},"window":{"navigationBarTitleText":"手机验证","enablePullDownRefresh":false}},{"path":"/pages/register/register","meta":{},"window":{"navigationBarTitleText":"注册","titleNView":{"buttons":[{"color":"#fff","colorPressed":"#fff","float":"right","fontSize":"30rpx","fontSrc":"/static/iconfont/fonts/icomoon.ttf","text":""}]}}},{"path":"/pages/test/test","meta":{},"window":{"navigationBarTitleText":"测试","enablePullDownRefresh":false}},{"path":"/pages/transac/tranLegal","meta":{},"window":{"navigationBarTitleText":"法币交易","enablePullDownRefresh":false}},{"path":"/pages/my/my","meta":{},"window":{"navigationBarTitleText":"我的","enablePullDownRefresh":false,"titleNView":{"buttons":[{"color":"#707070","colorPressed":"#eee","float":"right","fontSize":"56rpx","fontSrc":"/static/iconfont/fonts/icomoon.ttf","text":""}]}}},{"path":"/pages/klineQuota/klineQuota","meta":{},"window":{"navigationBarTitleText":"K线图","enablePullDownRefresh":false}},{"path":"/pages/assets/assRecharge","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/assets/selectLetter","meta":{},"window":{"navigationBarTitleText":"选择币种","enablePullDownRefresh":false}},{"path":"/pages/assets/assRecord","meta":{},"window":{"navigationBarTitleText":"充值记录","enablePullDownRefresh":false}},{"path":"/pages/assets/rechAddress","meta":{},"window":{"navigationBarTitleText":"充值地址","enablePullDownRefresh":false}},{"path":"/pages/assets/assWithDraw","meta":{},"window":{"navigationBarTitleText":"提现","enablePullDownRefresh":false}},{"path":"/pages/my/safeCenter/safeCenter","meta":{},"window":{"navigationBarTitleText":"安全中心","enablePullDownRefresh":false}},{"path":"/pages/my/safeCenter/safePwd","meta":{},"window":{"navigationBarTitleText":"设置交易密码","enablePullDownRefresh":false}},{"path":"/pages/assets/orderRecord","meta":{},"window":{"navigationBarTitleText":"订单记录","enablePullDownRefresh":false,"titleNView":{"buttons":[{"color":"#fff","colorPressed":"#fff","float":"left","fontSize":"30rpx","fontSrc":"/static/iconfont/fonts/icomoon.ttf","text":""}]}}},{"path":"/pages/assets/orderRecordDetail","meta":{},"window":{"navigationBarTitleText":"订单详情","enablePullDownRefresh":false}},{"path":"/pages/assets/assTranRecord","meta":{},"window":{"navigationBarTitleText":"划转记录","enablePullDownRefresh":false}},{"path":"/pages/my/mySetting","meta":{},"window":{"navigationBarTitleText":"设置","enablePullDownRefresh":false}},{"path":"/pages/my/mySetting/unBindPayMethod","meta":{},"window":{"navigationBarTitleText":"解绑","enablePullDownRefresh":false}},{"path":"/pages/transac/transacMain","meta":{},"window":{"navigationBarTitleText":"交易","enablePullDownRefresh":false,"titleNView":{"buttons":[{"color":"#fff","colorPressed":"#eee","float":"right","fontSize":"56rpx","fontSrc":"/static/iconfont/fonts/icomoon.ttf","text":""}]}}},{"path":"/pages/sundry/serviceAgreement","meta":{},"window":{"navigationBarTitleText":"服务协议","enablePullDownRefresh":false}},{"path":"/pages/my/invitaIncome/invitaIncome","meta":{},"window":{"navigationBarTitleText":"邀请收益","enablePullDownRefresh":false,"titleNView":{"buttons":[{"color":"#fff","colorPressed":"#fff","float":"right","fontSize":"30rpx","text":"记录"},{"color":"#fff","colorPressed":"#fff","float":"left","fontSize":"30rpx","fontSrc":"/static/iconfont/fonts/icomoon.ttf","text":""}]}}},{"path":"/pages/my/invitaIncome/invitaIncomRecord","meta":{},"window":{"navigationBarTitleText":"邀请记录","enablePullDownRefresh":false}},{"path":"/pages/assets/assTransfer","meta":{},"window":{"navigationBarTitleText":"兑换","enablePullDownRefresh":false}},{"path":"/pages/transac/tranContract/tranContract","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/transac/tranContract/tranAssets","meta":{},"window":{"navigationBarTitleText":"合约资产","enablePullDownRefresh":false}},{"path":"/pages/transac/tranContract/tranAssetsDetail","meta":{},"window":{"navigationBarTitleText":"合约返还统计","enablePullDownRefresh":false}},{"path":"/pages/transac/tranContract/tranAssetsFailPurchase","meta":{},"window":{"navigationBarTitleText":"抢购收益","enablePullDownRefresh":false}},{"path":"/pages/transac/tranContract/tranAssetsFailPurchaseDetail","meta":{},"window":{"navigationBarTitleText":"失败收益详情","enablePullDownRefresh":false}},{"path":"/pages/transac/tranContract/transAssetsShare","meta":{},"window":{"navigationBarTitleText":"分享收益","enablePullDownRefresh":false}},{"path":"/pages/my/authName/authDeepName","meta":{},"window":{"navigationBarTitleText":"高级实名认证","enablePullDownRefresh":false}},{"path":"/pages/my/authName/authName","meta":{},"window":{"navigationBarTitleText":"初级认证","enablePullDownRefresh":false}},{"path":"/pages/my/authName/authDeepLoad","meta":{},"window":{"navigationBarTitleText":"身份认证","enablePullDownRefresh":false}},{"path":"/pages/my/authName/authDeepComplete","meta":{},"window":{"navigationBarTitleText":"身份认证","enablePullDownRefresh":false}},{"path":"/pages/transac/tranLegal/tranLegOrderToPay","meta":{},"window":{"navigationBarTitleText":"订单待支付","enablePullDownRefresh":false,"titleNView":{"buttons":[{"color":"#fff","colorPressed":"#fff","float":"right","fontSize":"30rpx","text":"撤单"}]}}},{"path":"/pages/transac/transacOrder/transacHistoryOrder","meta":{},"window":{"navigationBarTitleText":"交易记录","enablePullDownRefresh":false}},{"path":"/pages/my/personal/personal","meta":{},"window":{"navigationBarTitleText":"个人中心","enablePullDownRefresh":false}},{"path":"/pages/assets/assTranAcc/assTranAcc","meta":{},"window":{"navigationBarTitleText":"转账","enablePullDownRefresh":false,"titleNView":{"buttons":[{"color":"#fff","colorPressed":"#fff","float":"right","fontSize":"30rpx","text":"记录"}]}}},{"path":"/pages/assets/assTranAcc/assTranAccOrder","meta":{},"window":{"navigationBarTitleText":"转账记录","enablePullDownRefresh":false}},{"path":"/pages/holeRedPackage/holeRedPackage","meta":{},"window":{"navigationBarTitleText":"虫洞红包","enablePullDownRefresh":false,"titleNView":{"buttons":[{"color":"#fff","colorPressed":"#fff","float":"right","fontSize":"30rpx","text":"记录"},{"color":"#fff","colorPressed":"#fff","float":"left","fontSize":"30rpx","fontSrc":"/static/iconfont/fonts/icomoon.ttf","text":""}]}}},{"path":"/pages/holeRedPackage/holeRedPackageRecord","meta":{},"window":{"navigationBarTitleText":"红包记录","enablePullDownRefresh":false}},{"path":"/pages/my/applicant/applicant","meta":{},"window":{"navigationBarTitleText":"申请商家","enablePullDownRefresh":false,"titleNView":{"buttons":[{"color":"#fff","colorPressed":"#fff","float":"left","fontSize":"30rpx","fontSrc":"/static/iconfont/fonts/icomoon.ttf","text":""}]}}},{"path":"/pages/my/bussManager/bussManager","meta":{},"window":{"navigationBarTitleText":"商家管理","enablePullDownRefresh":false,"titleNView":{"buttons":[{"color":"#fff","colorPressed":"#fff","float":"right","fontSize":"30rpx","text":"记录"},{"color":"#fff","colorPressed":"#fff","float":"left","fontSize":"30rpx","fontSrc":"/static/iconfont/fonts/icomoon.ttf","text":""}]}}},{"path":"/pages/my/bussManager/bussManagerOrder","meta":{},"window":{"navigationBarTitleText":"订单记录","enablePullDownRefresh":false,"disableScroll":true,"titleNView":{"buttons":[{"color":"#fff","colorPressed":"#fff","float":"left","fontSize":"30rpx","fontSrc":"/static/iconfont/fonts/icomoon.ttf","text":""}]}}},{"path":"/pages/my/bussManager/bussManagerOrderToPay","meta":{},"window":{"navigationBarTitleText":"确认订单","enablePullDownRefresh":false,"titleNView":{"buttons":[{"color":"#fff","colorPressed":"#fff","float":"left","fontSize":"30rpx","fontSrc":"/static/iconfont/fonts/icomoon.ttf","text":""}]}}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
