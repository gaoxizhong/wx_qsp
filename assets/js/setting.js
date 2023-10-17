const accountInfo = wx.getAccountInfoSync();
// release 正式服
// develop 开发版
let Setting = {
  "apiUrl": "https://huanbaobi.qingshanpai.com/api",  // 开发版
  //  "apiUrl": "https://admin.qingshanpai.com/api", // 正式服
  //  apiUrl: accountInfo.miniProgram.envVersion === 'release' ?'https://admin.qingshanpai.com/api' : 'https://huanbaobi.qingshanpai.com/api',
  // 海报图片路径
  "makeUrl": "https://admin.qingshanpai.com/"
}
module.exports = Setting