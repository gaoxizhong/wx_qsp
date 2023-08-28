const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({
  data: {
    img_url: app.data.imgUrl,
    swiperCurrent: 0,
    winHeight: "",
    navActive: 1,
    currentTab: 0,
    concernMe_page: 1,
    meConcern_page: 1,
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      userInfo: app.globalData.userInfo,
    })
    //  高度自适应
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 100;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  onShow() {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if (member_id) {
      that.setData({
        member_id: member_id,
      })
      that.getConcernMe();
    }
  },
  guanzhu(e) { //关注
    let that = this;
    let data = that.data.lists;
    let idx = e.currentTarget.dataset.idx;
    let member_id = e.currentTarget.dataset.id;
    console.log(e)
    if (that.data.currentTab == 0) {
      //关注我的  只能为个人  type=2
      common.post('/memberinfo/clickConcern', {
        member_id: that.data.member_id,
        be_member_id: member_id,
        type: 2
      }).then(res => {
        if ( res.data.msg == '已关注' ) {
          that.data.lists[idx].is_concern = 1;
        } else {
          that.data.lists[idx].is_concern = 0;
        }
        that.setData({
          lists: that.data.lists
        })
      })
    } else {
      let types = '';
      if ( e.currentTarget.dataset.business_id != 0 ) {
        types = 1
      } else {
        types = 2
      }
      common.post('/memberinfo/clickConcern', {
        member_id: that.data.member_id,
        be_member_id: member_id,
        type: types
      }).then(res => {
        if ( res.data.msg == '已关注' ) {
          that.data.lists[idx].is_concern = 1;
        } else {
          that.data.lists[idx].is_concern = 0;
        }
        that.setData({
          lists: that.data.lists
        })
      })
    }
  },
  _jump: function(a) {
    debugger
    app.getFormId(this, a);
    console.log(a.currentTarget.dataset.url)
    wx.downloadFile({
      // 示例 url，并非真实存在
      url: a.currentTarget.dataset.url,
      success(res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath,
          success(res) {
            console.log('打开文档成功')
          },
          fail(res) {
            console.log('合同链接错误')
          }
        })
      }
    })
  },
  // 滚动切换标签样式
  switchTab: function(e) {
    let that = this
    that.setData({
      currentTab: e.detail.current
    });
    that.checkCor();
    if ( e.detail.current == 1 ) {
      //我关注的
      that.getMeConcern();
    } else if ( e.detail.current == 0 ) {
      //关注我的
      that.getConcernMe();
    }
  },
  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    publicMethod.getFormId(e, this)
    let that = this
    var cur = e.currentTarget.dataset.current;
    that.setData({
      currentTab: cur
    })
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
  //关注我的
  getConcernMe() {
    let that = this;
    common.get("/memberinfo/getConcernsMe", {
      member_id: that.data.member_id,
      page: that.data.concernMe_page
    }).then( res => {
      if ( res.data.code == 200 ) {
        console.log(res.data.data)
        that.setData({
          lists: res.data.concernMeMember
        })
      }
    })
  },
  //我关注的
  getMeConcern() {
    let that = this;
    common.get("/memberinfo/getMeConcern", {
      member_id: that.data.member_id,
      page: that.data.meConcern_page
    }).then( res => {
      if ( res.data.code == 200 ) {
        console.log(res.data.concernMeMember)
        that.setData({
          lists: res.data.data
        })
      }
    })
  },
  popLock: function(event) { // 初始化弹框
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop1: app.globalData.pop1,
      pop2: app.globalData.pop2,
      pop3: app.globalData.pop3,
      pop4: app.globalData.pop4,
    });
  }
})