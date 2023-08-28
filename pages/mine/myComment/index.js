const app = getApp();
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
const imgUrl = app.data.imgUrl;
let page = 2;
Page({
  data: {
    img_url: app.data.imgUrl,
    swiperCurrent: 0,
    isPlayingMusic: true,
    savaStatus: true,
    textVal: '',
    inpPlaceholder: '发表评论',
    wenzData: [],
    page1: [],
    loadend: [],
    showFull: [],
    isReset: 0, //子页面跳转是否刷新页面,
    commenList: [],  //评论数组
  },

  onLoad: function(options) {
    let that = this
    that.setData({
      member_id2: wx.getStorageSync('member_id'),
      member_id: wx.getStorageSync('member_id'),
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
    })
    if (options.is_who) {
      that.setData({
        is_who: options.is_who
      })
    }
    if (options.id) {
      that.setData({
        member_id2: options.id
      })
    }

    that.getData()
  },
  onShow() {

  },
  onHide() {

  },
  onUnload() {

  },
  getData() { //初始化数据
    let that = this
    //列表
    that.getwenzhang();
    that.getMyComment();
  },
  //获取我的评论
  getMyComment() {
    let that = this;
    common.get("/memberinfo/getComments",{
      member_id: that.data.member_id
    }).then( res => {
      if ( res.data.code == 200 ) {
        console.log(res.data);
        that.setData({
          commenList: res.data.data
        })
      }
    })
  },
  //跳转到动态详情
  goToCircleDetail(e) {
    let contentid = e.currentTarget.dataset.contentid;
    let url = "/pages/circle_detail/circle_detail?contentid=" +  contentid;
    wx.navigateTo({
      url: url
    })
  },
  getwenzhang() { //列表
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/memberinfo/info', {
      member_id: that.data.member_id2,
      who: that.data.is_who,
      login_id: that.data.member_id,
      page: 1
    }).then(res => {

      wx.hideLoading()
      console.log("环保圈列表")
      console.log(res)
      let wenzData = res.data.contents
      if (wenzData.length <= 0) {
        setTimeout(function() {
          that.setData({
            dataStatus: true
          })
        }, 500)
      }
      for (var i = 0; i < wenzData.length; i++) {
        let obj = {}
        that.data.page1.push(1)
        that.data.loadend.push(false)
        obj.leng = wenzData[i].words.length
        obj.status = false
        that.data.showFull.push(obj)
      }

      that.setData({
        showFull: that.data.showFull,
        wenzData
      })
      page = 2

    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
      page = 2
    })
  },
  goChat(e) {
   this.setData({
     pop3: false,
     popidx: false
   })
   publicMethod.getFormId(e, this)
   let options = e.currentTarget.dataset.options;
   let param = {
     be_member_id: options.member_id,
     name: options.home_nickname,
     type: options.type
   }
   wx.navigateTo({
     url: '/pages/chatDetail/index?param=' + JSON.stringify(param),
   })
  },
  getFormId(e) { //取formid
    publicMethod.getFormId(e, this)
  },
  guanzhu(e) { //关注
    let that = this;
    let data = that.data.wenzData;
    let idx = e.currentTarget.dataset.idx;

    publicMethod.guanzhu(e, this, function(res) {
      if (res.msg == "已关注") {
        data[idx].is_concern = 1
      } else {
        data[idx].is_concern = 0
      }
      that.setData({
        wenzData: data
      })
    })
  },
  openFun(e) { //打开私信和拨打电话
    publicMethod.openFun(e, this)
  },
  callTel(e) { //打电话
    publicMethod.callTel(e, this)
  },
  openFulltxt(e) { //打开全文
    publicMethod.openFulltxt(e, this)
  },
  previewImage: function(e) { //图片预览
    publicMethod.previewImage(e, this)
  },
  delCircle(e) { //删除图文
    publicMethod.delCircle(e, this)
  },
  loadMore(e) { //加载更多评论
    publicMethod.loadMore(e, this)
  },
  hfComment(e) { //回复评论
    publicMethod.hfComment(e, this)
  },
  openComment(e) { //打开评论弹框
    publicMethod.openComment(e, this)
  },
  bindTextChange(e) { //留言val
    publicMethod.bindTextChange(e, this)
  },
  sendComment(e) { //评论
    publicMethod.sendComment(e, this)
  },
  swiperChange: function(e) { //获取当前第几张图片，并切换dot
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
  popLock: function(event) { // 初始化弹框
    wx.showTabBar()
    this.setData({
      textVal: '',
      inpPlaceholder: '发表评论'
    })
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop1: app.globalData.pop1,
      pop2: app.globalData.pop2,
      pop3: app.globalData.pop3,
      pop4: app.globalData.pop4,
    });
  },
  onShareAppMessage: function(res) { //分享
    let that = this
    console.log(res)
    let url = 'pages/circle/circle';
    if (res.from === 'button') {
      let shareTxt = res.target.dataset.sharetxt;
      return {
        title: '青山生态 ' + shareTxt,
        path: url,
        imageUrl: '',
        success: function(res) {
          // 转发成功
          console.log(res)
        },
        fail: function(res) {
          // 转发失败
        }
      }
    }
    return {
      title: '青山生态 正在发生…',
      imageUrl: '',
      path: url,
      success: function(res) {
        // 转发成功
        console.log(res)
      },
      fail: function(res) {
        // 转发失败
        console.log(res)
      }
    }
  },
  onPullDownRefresh() { //下拉刷新
    let that = this
    that.setData({
      page1: [],
      showFull: [],
      loadend: []
    })
    wx.showNavigationBarLoading()
    wx.stopPullDownRefresh()
    that.getwenzhang()
  },
  onReachBottom() { //上拉加载
    var that = this;
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/memberinfo/info', {
      member_id: that.data.member_id2,
      who: that.data.is_who,
      login_id: that.data.member_id,
      page
    }).then(res => {

      wx.hideLoading()
      console.log("环保圈列表")
      console.log(res)
      if (res.data.code == 200) {

        let wenzData = res.data.contents

        let d = that.data.wenzData
        for (var i = 0; i < wenzData.length; i++) {
          d.push(wenzData[i]);
          that.data.page1.push(1)

          let obj = {}
          obj.leng = wenzData[i].words.length
          obj.status = false
          that.data.showFull.push(obj)
          that.data.loadend.push(false)
        }


        that.setData({
          loadend: that.data.loadend,
          showFull: that.data.showFull,
          wenzData: d,
        })
        page++
      } else if (res.data.code == 206) {
        wx.showToast({
          title: "没有更多数据啦~~",
          icon: "none"
        })
        page++
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  }
})