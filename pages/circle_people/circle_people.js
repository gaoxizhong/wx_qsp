// pages/circle_people/circle_people.js
const app = getApp();
const common = require('../../assets/js/common');
const publicMethod = require('../../assets/js/publicMethod');
const imgUrl = app.data.imgUrl;
let time1 = null;
let page = 2;
let qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateList: [],  //头部类目
    personalInfo: '',  //个人信息
    circle_page: 1,  //当前展示页数
    swiperCurrent: 0,
    winHeight: "",
    navActive: 1,
    currentTab: 0,
    concernMe_page: 1,
    meConcern_page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let member_id = wx.getStorageSync('member_id')
    let that = this;
    that.setData({
      userInfo: app.globalData.userInfo,
      member_id: wx.getStorageSync('member_id'),
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
    });
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
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
    //全局配置
    that.setData({
      circle_page: 1
    })
    that.getData()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('触发了onshow');
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
    })
    
    // that.getData()
  },
    /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log("circle结束");
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
  },
  getData() { //初始化数据
    let that = this
    that.getPersonInfo();
    that.getCategory();
    that.getToday_people();
  },
  //获取所有人数
  getCategory() {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    common.get("/content/details?member_id=" + member_id).then(res => {
      console.log(res.data);
      if (res.data.code == 200) {
          // app.showToast({
          //   title: res.data.msg,
          // });
        console.log("获取成功");
        console.log(res.data.people);
        let people = res.data.people;
        that.setData({
          result: res.data.people.result,
          today_people: res.data.people.today_people,
          total_people: res.data.people.total_people
        });
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(error => {
      console.log(error);
      app.showToast({
        title: "数据异常！",
      })
    })
  },
  //获取个人信息
  getPersonInfo() {
    let that = this;
    common.get('/content/getMemberInfo', {
      member_id: that.data.member_id
    }).then(res => {
      if (res.data.code == 200) {
        wx.setStorageSync('personalInfo', res.data.data)
        that.setData({
          personalInfo: res.data.data,
          // copy_text: res.data.copy_text,
        });
      }

    })
  },
  guanzhu(e) { //关注
    let that = this;
    let data = that.data.lists;
    let idx = e.currentTarget.dataset.idx;
    let member_id = e.currentTarget.dataset.id;
    console.log(e)

    console.log('我在点击关注')
    if (that.data.code == 200) {
      //关注我的  只能为个人  type=2
      common.post('/memberinfo/clickConcern', {
        member_id: that.data.member_id,
        be_member_id: member_id,
        type: 2
      }).then(res => {
        if (res.data.msg == '已关注') {
          that.data.lists[idx].is_concern = 1;
        } else {
          that.data.lists[idx].is_concern = 0;
        }
        that.setData({
          lists: that.data.lists
        })
        }).catch(error => {
          console.log(error);
          app.showToast({
            title: 'res.msg',
          })
        })
    } else {
      let types = '';
      if (e.currentTarget.dataset.business_id != 0) {
        types = 1
      } else {
        types = 2
      }
      common.post('/memberinfo/clickConcern', {
        member_id: that.data.member_id,
        be_member_id: member_id,
        type: types
      }).then(res => {
        console.log(res.data.msg)
        if (res.data.msg == '已关注') {
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
  // 滚动切换标签样式
  switchTab: function (e) {
    let that = this
    that.setData({
      lists:[],
      currentTab: e.detail.current
    });
    that.checkCor();
    that.getToday_people();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    publicMethod.getFormId(e, this)
    let that = this
    var cur = e.currentTarget.dataset.current;
    that.setData({
      currentTab: cur
    })
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
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
  //环保圈人数
  getToday_people() {
    let that = this;
    let member_id = that.data.member_id
    common.get("/content/details?member_id=" + member_id, {
      member_id: that.data.member_id,
      page: that.data.meConcern_page

    }).then(res => {
      if (res.data.code == 200) {
        console.log(res.data)
        if( that.data.currentTab ==0){
          console.log('0')
          that.setData({
            lists: res.data.people.today_people
          })
        }else if( that.data.currentTab ==1){
          console.log('1')
          that.setData({
            lists: res.data.people.total_people
          })
        }else if( that.data.currentTab ==2){
          console.log('2')
          that.setData({
            lists: res.data.people.result
          })
        }

      }
    })
  },
  //环保圈人数
  // getTotal_people() {
  //   let that = this;
  //   let member_id= that.data.member_id
  //   common.get("/content/details?member_id="+member_id , {
  //     member_id: that.data.member_id,
  //     page: that.data.meConcern_page
  //   }).then(res => {
  //     if (res.data.code == 200) {
  //       console.log(res.data)
  //       console.log('1')
  //       that.setData({
  //         lists: res.data.people.total_people
  //       })
  //     }
  //   })
  // },
  //影响范围
  // getResult() {
  //   let that = this;
  //   let member_id = that.data.member_id
  //   console.log(member_id)
  //   common.get("/content/details?member_id=" + member_id, {
  //     member_id: that.data.member_id,
  //     page: that.data.meConcern_page
  //   }).then(res => {
  //     if (res.data.code == 200) {
  //       console.log(res.data)
  //       console.log('2')
  //       that.setData({
  //         lists: res.data.people.result
  //       })
  //     }
  //   })
  // },
  turnto() {
    let pageslist = getCurrentPages();
    console.log(pageslist.length);
    if (pageslist && pageslist.length > 1) {
      wx.navigateBack({ delta: -1 });
    } else {
      wx.reLaunch({ url: "/pages/circle/circle" });
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})