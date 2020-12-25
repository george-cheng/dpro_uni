function checkEmail(email){
	return RegExp(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/).test(email);
}

function checkPhone(phone){
	return RegExp(/^1[3456789]\d{9}$/).test(phone);
}

function checkPwd(pwd){
	return RegExp(/^[0-9A-Za-z.@-_!#$%^&*~+-/]{8,16}$/).test(pwd)
}

function checkNum(num){
	return RegExp(/^(-?\\d+)(\\.\\d+)?$/).test(num)
}

function checkId(id){
	return RegExp(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).test(id)
}

function checkHz(name){
	return RegExp(/^[0-9\u4e00-\u9fa5]+$/).test(name)
}

//乘法
function accMul (arg1, arg2) {
  var m = 0, s1 = arg1 + "", s2 = arg2 + "";
  try { m += s1.split(".")[1].length } catch (e) { }
  try { m += s2.split(".")[1].length } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

//加法
function accAdd(arg1, arg2) {
  var r1, r2, m;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }

  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }

  m = Math.pow(10, Math.max(r1, r2));
  return (accMul(arg1, m) + accMul(m, arg2)) / m
}


function arrayBufferToBase64(buffer) {
	 var binary = '';
	 var bytes = new Uint8Array(buffer);
	 var len = bytes.byteLength;
	 for (var i = 0; i < len; i++) {
		 binary += String.fromCharCode(bytes[i]);
	 }
	 return window.btoa(binary);
}


function base64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

function transformImgData(data) {
  return new Promise((resolve) => {
    let buffer = new Buffer(data, 'binary')  
    let blob = new Blob([buffer], {type: 'image/jpeg'})
    const fr = new FileReader()
    fr.onload = (e) => {
      resolve(e.target.result)
    }
    fr.onerror = () => {
      resolve('')
    }
    fr.readAsDataURL(blob)
  })
}


function uint8arrayToBase64(u8Arr) {
	let CHUNK_SIZE = 0x8000; //arbitrary number
	let index = 0;
	let length = u8Arr.length;
	let result = '';
	let slice;
	while (index < length) {
			slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
			result += String.fromCharCode.apply(null, slice);
			index += CHUNK_SIZE;
	}
	// web image base64图片格式: "data:image/png;base64," + b64encoded;
	// return  "data:image/png;base64," + btoa(result);
	return btoa(result);
}

function getLocalTime(time) {
	var now = new Date(time);
	var year = now.getFullYear();
	var month = (now.getMonth() + 1) .toString().padStart(2 ,0);
	var date = now.getDate().toString().padStart(2 ,0);
	var hour = now.getHours().toString().padStart(2 ,0);
	var minute = now.getMinutes().toString().padStart(2 ,0);
	var second = now.getSeconds().toString().padStart(2 ,0);
	
	return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
}

function toDecimal(data, decimal){
	return Number(data).toFixed(Number(decimal))
}

function isObject(object){
	for(let key in object){
		return false
	}
	return true
}


function getRandom(start, end, fixed=0) {
	let differ = end - start
	let random = Math.random()
	return (start + differ * random).toFixed(fixed)
}


export{
	checkEmail, checkPhone, checkPwd, checkNum, checkId, accMul, accAdd, arrayBufferToBase64, transformImgData, uint8arrayToBase64, getLocalTime, toDecimal, isObject, getRandom, checkHz
}
