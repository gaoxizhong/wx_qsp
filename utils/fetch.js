'use strict';

var Promise = require('./bluebird');

/**
 * 抓取远端API的结构
 * @param  {String} api    api 根地址
 * @param  {String} path   请求路径
 * @param  {Objece} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */
module.exports = function (api, path, params, method) {
	params.session_key = params.session_key || getApp().getSessionKey();
	params.app_id = getApp().getAppId();
	params.ver = getApp().globalData.ver;
	//console.log(getApp().globalData)
//console.log(wx.getStorageSync('userInfo'))
 	/*if(!params.session_key){
      getApp().requestUserWxInfo();
    }*/
/*    wx.getStorage({
	  key: 'userInfo',
	  success: function(res) {
  		if(!res.data.id){
  			getApp().requestUserWxInfo();
  		}
	  },
	  fail:function(res){
	  	console.log(res)
	  	if(res.errMsg="getStorage:fail data not found"){
	  		getApp().requestUserWxInfo();
	  	}
	  	
	  }
	})*/

	return new Promise(function (resolve, reject) {
		wx.request({
			url: api + '/' + path,
			data: Object.assign({}, params),
			method: method || 'POST',
			header: { 'Content-Type': 'application/json' },
			success: resolve,
			fail: reject
		});
	});

};