const app = getApp();
const common = require('../../assets/js/common');
const publicMethod = require('../../assets/js/publicMethod');

let toViewInd = 0;
let time = common.formatTime(new Date());
let end_id = 0;
Page({
  data: {
    lists: [],  //所有排行信息
    my_info: {},  //自己的信息
  },

  onLoad: function(options) {
    let that = this;
    that.setData({
        member_id: wx.getStorageSync('member_id'),
        user_info: wx.getStorageSync('user_info'),
        configData: wx.getStorageSync('configData'),
    })
    that.getRankList();
  },
  onShow() {
    // this.getRankList();
  },
  onHide() {
  },
  onUnload() {
  },
  //获取排行
  getRankList() {
    let that = this;
    common.get("/environmental/bank/getBankRanking", {
      member_id: that.data.member_id
    }).then( res => {
      if ( res.data.code == 200 ) {
        that.setData({
          lists: res.data.AllMemberRanking,
          my_info: res.data.memberInfo[0]
        })
      }
    })
  }
})