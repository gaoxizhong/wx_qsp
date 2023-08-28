const app = getApp();
const common = require('../../assets/js/common');
const publicMethod = require('../../assets/js/publicMethod');

let toViewInd = 0;
let time = common.formatTime(new Date());
let end_id = 0;
Page({
  data: {
    article_lists: [],  //攻略信息
  },

  onLoad: function(options) {
    let that = this;
    that.setData({
        member_id: wx.getStorageSync('member_id'),
        user_info: wx.getStorageSync('user_info'),
        configData: wx.getStorageSync('configData'),
    })
    that.getHbbWalkTrough();
  },
  onShow() {
    // this.getRankList();
  },
  onHide() {
  },
  onUnload() {
  },
  //获取hbb攻略
  getHbbWalkTrough() {
    let that = this;
    common.get("/environmental/bank/getHBBArticle", {
      type: 8
    }).then( res => {
      if ( res.data.code == 200 ) {
        that.setData({
          article_lists: res.data.articleInfo,
        })
      }
    })
  },
  //前往文章页面 按照article_label判断 1跳转文章 2跳转商家 3跳转商品 4跳转回话 5申请入驻
  goToFromArticle(e) {
    let dataset = e.currentTarget.dataset;
    if ( dataset.articlelabel == 1 || !dataset.articlelabel ) {
      //跳转文章
      let url = "/pages/detail/detail?article_id=" + dataset.id;
      wx.navigateTo({
        url: url
      })
    } else if ( dataset.articlelabel == 2 ) {
      //跳转商家
      let url = "/pages/shop/shop?business_id=" + dataset.articlelabelid;
      wx.navigateTo({
        url: url
      })
    } else if ( dataset.articlelabel == 3 ) {
      //跳转商品
    } else if ( dataset.articlelabel == 4 ) {
      //跳转会话
    } else if ( dataset.articlelabel == 5 ) {
      //申请入驻
    }
  },
})