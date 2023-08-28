'use strict';

var fetch = require('./fetch');

/**
 * 特定类型的API
 * @param  {String} type   类型，例如：'coming_soon'
 * @param  {Objece} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */
function fetchApi(apiurl, params={}, method) {
  var URI = getApp().globalData.siteBaseUrl;
  var user_info = getApp().getUserInfo();
  
    getApp().showToast({title:'请求中...',icon: 'loading'})

    return fetch(URI, apiurl, params, method).then(function (res) {
      getApp().hideToast();
      console.log(res.data)

      if(res.data.status == '-90001'){
        getApp().setSessionKey('');
        getApp().setUserInfoStorage({});
        //getApp().showModal({content:res.data.message,confirm:getApp().login})
        getApp().login()
        return {}
      }
      return res.data;
      //return res;  //old 2017-10-17 17:14:11
  });
  //return fetch(URI, apiurl, params, method); //old
}

/**
 * 获取列表类型的数据带分页
 * @param  {String} apiurl   类型，例如：'coming_soon'
 * @param  {Number} page   页码
 * @param  {Number} count  页条数
 * @param  {String} search 搜索关键词
 * @return {Promise}       包含抓取任务的Promise
 */
function find(apiurl) {
  var page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var count = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;
  var search = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

  // const params = { page:page,start: (page - 1) * count, count: count }
  var params = { page: page, size: count };
  return fetchApi(apiurl, search ? Object.assign(params, { q: search }) : params).then(function (res) {

    return res.data;
  });
}

/**
 * 获取单条类型的数据
 * @param  {Number} id     ID
 * @return {Promise}       包含抓取任务的Promise
 */
function findOne(apiurl) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  return fetchApi(apiurl).then(function (res) {
    return res.data;
  });
}

module.exports = { find: find, findOne: findOne, fetchApi: fetchApi };