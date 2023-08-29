let Promise = require('../libs/promise').Promise;
class Util {
  request(options) {
    let token =  wx.getStorageSync('token');
    if(token){
      options.header.token =token;
    }
    return new Promise((resolve, reject) => {
      options.success = function (res) {
         if (res.statusCode.toString()[0] != 2){
          reject(res)
        }else{
          resolve(res)
          if( res.data.refresh_token ){
            wx.setStorageSync('token', res.data.refresh_token);
            return
          }
          if(!token && res.data.code == 4003){
            let is_code = wx.getStorageSync('is_code');
            console.log(is_code)
            if(is_code === '1'){
              return
            }
            wx.setStorageSync('is_code', '1');
            wx.setStorageSync('member_id', '');
            setTimeout(function(){
              wx.navigateTo({
                url: '/pages/login_mark/index',
              })
            },2000)
            return
          }
          return
          
         }
      }
      options.fail = function (err) {
        reject(err)
        console.log(err)

      }
      options.complete = function () {
        wx.hideNavigationBarLoading()
      }
      // // if (options.data.loading !== false)
      // wx.showNavigationBarLoading()
      wx.request(options)
    })
  }

  doLocation(options = {}) {
    return new Promise((resolve, reject) => {
      options.success = function (res) {
        resolve(res)
      }
      options.fail = function (err) {
        reject(err)
      }
      options.complete = function () {
        wx.hideNavigationBarLoading()
      }
      wx.showNavigationBarLoading()
      wx.getLocation(options)
    })
  }

  setStorage(options = {}) {
    return new Promise((resolve, reject) => {
      options.success = function (res) {
        resolve(res)
      }
      options.fail = function (err) {
        reject(err)
      }
      options.complete = function () {
        wx.hideNavigationBarLoading()
      }
      wx.showNavigationBarLoading()
      wx.setStorage(options)
    })
  }

  getStorage(options = {}) {
    return new Promise((resolve, reject) => {
      options.success = function (res) {
        resolve(res)
      }
      options.fail = function (err) {
        reject(err)
      }
      options.complete = function () {
        wx.hideNavigationBarLoading()
      }
      wx.showNavigationBarLoading()
      wx.getStorage(options)
    })
  }

  isEmptyObject(obj) {
    var name;
    for (name in obj) {
      return false;
    }
    return true;
  }

}

module.exports = new Util