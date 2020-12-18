import axios from '../js_sdk/gangdiedao-uni-axios/index.js'
import qs from 'qs'

import '../utils/weapp-cookie/dist/weapp-cookie.js'

let BASE_URL
BASE_URL = ''
// #ifndef H5
BASE_URL = 'https://www.dpro.ltd'
// #endif


const requestInstance = axios.create({
	  withCredentials: true,
});
var that = null;

const AjaxJson = function (options) {
  that = this;
  var ajaxRequest = new AjaxRequest(options)
  if(ajaxRequest.init(options)){
    ajaxRequest.request()
  }
}

const UploadRequest = function(options){
	that = this;
	var ajaxRequest = new AjaxRequest(options)
	if(ajaxRequest.init(options)){
		ajaxRequest.uploadrequest()
	}
}

const AjaxRequest = function(options){
  this.url =  ""
	this.filePath = ""
	this.name = ""
  this.data = ""
  this.formData = ""
  this.category = "0"
  this.successCall = null
  this.errorCall = null
  this.progressCall = null
	this.method = 'GET'
}

AjaxRequest.prototype.init = function(options){
  //请求的地址
  this.url = options && options.url || ""
	if(this.url == ''){
		uni.showToast({
			image: '../static/images/wrong.png',
			title: '请求地址不能为空'
		})
	}

	this.name = options && options.name || ""
	this.formData = options && options.formData || {}
	this.filePath = options && options.filePath || {}
  //提交的数据
  this.data = options && options.data || {}
  this.category = options && options.category || "0"
	this.method = options && options.method || 'GET'
  this.successCall = options && options.call || null;
  this.errorCall = options && options.errorCall || null;
  this.progressCall = options && options.progressCall || null;
  return true;
}

requestInstance.interceptors.request.use(function (config) {
			return config;
},function (error) {
  return false
})

requestInstance.interceptors.response.use(function (response) {
  if(response.status === 200){
		return response.data;
  }
  else{
    
  }
},function (error) {
})

let header
header= {
	locale:'zh_CN',
	"content-Type": 'application/x-www-form-urlencoded'
}

AjaxRequest.prototype.request = function () {
  var ajaxRequest = this;
	
	this.data = qs.stringify(this.data)
	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + this.url + '?' + this.data,
			method: this.method,
			success: (res) => {
				if (ajaxRequest.successCall) {
					if(res.data.code == 401){
						uni.redirectTo({
							url: '/pages/loginIn/loginIn'
						})
					}
					if(res.data.code == 200 || res.dataMap || res.data || res){
						ajaxRequest.successCall(res.data)
					}
				}
			},
			fail: (res) => {
				reject(res)
			}
		})
	})
}

AjaxRequest.prototype.uploadrequest = function(){
	var ajaxRequest = this;
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: BASE_URL + this.url,
			filePath: this.filePath,
			name: this.name,
			formData: this.formData,
			success: (res) =>{
				if(ajaxRequest.successCall){
					if(res.data.code == 401){
						uni.navigateTo({
							url: '/pages/loginIn/loginIn'
						})
					}
					if(res.data.code == 200 || res.dataMap || res.data || res){
						ajaxRequest.successCall(res.data)
					}
				}
			},
			fail: (res) => {
				reject(res)
			}
		})
	})
	
}

export { 
	AjaxJson, UploadRequest
}