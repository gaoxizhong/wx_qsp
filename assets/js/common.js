let Util = require('./util')
let Setting = require('./setting')

class Common {
  constructor() {
    this.apiBaseUrl = Setting.apiUrl;
    this.setting = Setting
  }
  /**
   *  get
   */
  get(url, data) {
    return Util.request({
      url: this.apiBaseUrl + url,
      data: data,
      header: {"content-type": "application/json"},
    })
  }
  /**
   * post
   */
  post(url, data) {
    return Util.request({
      url: this.apiBaseUrl + url,
      data: data,
      method: 'POST',
      header: {"content-type": "application/json"},
    })
  }

  formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
  }
  formatTime1(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day].map(this.formatNumber).join('-')
  }
  formatTime2(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [month, day].map(this.formatNumber).join('-')+ ' ' + [hour, minute, second].map(this.formatNumber).join(':')
  }
  formatTime3(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day].map(this.formatNumber).join('-');
  }
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }

  getLocation() {
    return Util.doLocation()

  }

  setStorage(key, data) {
    return Util.setStorage({
      key: key,
      data: data
    })
  }


  getStorage(key) {
    return Util.getStorage({
      key: key
    })
  }


  print(key) {
    console.log(key);
  }

  /**
     * 继承
     * @param {[type]} context [description]
     * @param {[type]} props   [description]
     */
  extends(context, props) {
    for (let k in props) {
      context[k] = props[k]
    }
  }
  // 判断状态吗
  checkStatusCode(statusCode, callback) {
    let code = String(statusCode);
    try {
      if (code.length === 3) {
        if (code.charAt(0) == 2) {
          code = null;
          return true;
        } else {
          code = null;
          return false;
        }
      }
      throw code + " not normal status;"
    } catch (error) {
      callback && callback.apply(this, [code, error]);
    }
  }

}

module.exports = new Common