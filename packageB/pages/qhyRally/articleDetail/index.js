const app = getApp()
const common = require('../../../../assets/js/common');
var WxParse = require('../../../../wxParse/wxParse.js');
const publicMethod = require('../../../../assets/js/publicMethod');
let page = 1;
Page({
  data: {
    img_url: app.data.imgUrl,
    coolStatus:false,
    comment: [],  //评论数组
    comment_page: 1,  //评论当前页数
  },
  bindgetuserinfoHandler(e) { //授权 获取个人信息
    let that = this
    publicMethod.getUserInfo(e, this, function () {
      that.onLoad()
      that.onShow()
    })
  },
  onLoad: function(options) {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if (!member_id) {
      // wx.hideTabBar()
      this.setData({
        article_id: options.article_id,
        // isAuthorize: true //todo 备注:此处为了腾讯登录规则变化修改
      })
      // return
    }
   
    that.setData({
      article_id: options.article_id || that.data.article_id,
    })
    setTimeout(function(){
      that.setData({
        coolStatus: true,
      })
    },1000)
  },
  onShow: function() {
    let member_id = wx.getStorageSync('member_id');
    if (!member_id) {
      // return//todo 备注:此处为了腾讯登录规则变化修改
    }
    // this.audioCtx = wx.createAudioContext('myAudio');
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      configData: wx.getStorageSync("configData"),
      user_info: wx.getStorageSync('user_info'),
    })
    that.getData();
  },
  onHide() {
  },
  onUnload() {
  },
  getData() {
    let that = this
    //详情
    that.getDetail()
  },  
  //获取文章详情
  getDetail() { //详情
    wx.showLoading({
      title: '加载中...',
      duration:1000
    })
    let that = this
    common.get('/article/details', {
      member_id: that.data.member_id,
      article_id: that.data.article_id
    }).then(res => {
      console.log("详情")
      console.log(res)
      that.setData({
        detailData: res.data,
      })
      var article = res.data.data.content
      WxParse.wxParse('article', 'html', article, that,30);
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
    that.getComments();
  },
  //获取文章评论
  getComments() {
    let that = this;
    common.get("/article/articleComment", {
      article_id: that.data.article_id,
      page: that.data.comment_page
    }).then( res => {
      if ( res.data.code == 200 ) {
        that.setData({
          comment: res.data.data,
          comment_num: res.data.count
        })
      } else if ( res.data.code == 206 ) {
        wx.showToast({
          title: res.data.msg,
          duration: 1000,
          icon: "none"
        })
      }
    })
  },
  //打电话
  openCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  loadMore(e) { //加载更多评论
    let that = this
    let idx = e.currentTarget.dataset.curindex
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/article/loadMore', {
      member_id: that.data.member_id,
      article_id: that.data.article_id,
      page: page
    }).then(res => {

      wx.hideLoading()
      console.log("加载评论")
      console.log(res)
      if (res.data.code == 200) {

        let detailData = that.data.detailData;
        let comments = detailData.comment;
        let obj = res.data.data
        if (obj.length <= 1) {
          return
        }
        for (var i in obj) {
          comments.push(obj[i])
        }
        that.setData({
          detailData
        })

        page++
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
      page++
    })
  },
  //滑动到评论
  scrollToComment() {
    console.log('滑动')
    wx.pageScrollTo({
      // scrollTop: 200,
      duration: 500,
      selector: '#comment-title'
    })
  },
  openComment(e) { //打开评论弹框
    let that = this
    let member_id = wx.getStorageSync('member_id')
    if(!member_id){
      publicMethod.showLoginConfirm(that);
    } else {
      that.setData({
        pop1: true
      })
    }

  },
  bindTextChange(e) { //留言val
    let that = this
    that.setData({
      textVal: e.detail.value
    })
  },
  sendComment() { //评论
    let that = this
    if (that.data.textVal == '' || that.data.textVal == null) return;
    common.post('/article/comment', {
      member_id: that.data.member_id,
      article_id: that.data.article_id,
      content: that.data.textVal,
    }).then(res => {
      console.log("评论")
      console.log(res)
      if (res.data.code == 200) {
        let detailData = that.data.detailData;
        let comments = detailData.comment;
        let obj = {
          "member_name": that.data.user_info.nickName,
          "content": that.data.textVal
        };
        comments.push(obj)
        app.showToast({
          title: res.data.msg,
          icon: 'success',
        })
        that.setData({
          pop1: false,
          textVal: '',
          detailData,
          comment_page: 1
        })
        that.getComments();
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  },
  like(e) { //点赞
     let member_id = wx.getStorageSync('member_id')
    if(!member_id){
      // console.log('未授权用户')
      // wx.reLaunch({
      //   url:'/pages/mine/index/index'
      // })
      wx.showModal({
        title:'未登录，是否前往登录？',
        success: function(res) {
          if(res.confirm){
            console.log('点击了确认');
            wx.reLaunch({
              url:'/pages/mine/index/index'
            })
          } else if(res.cancel) {
            console.log('点击了取消')
          }
        }
      })
      return
    }
    let that = this
    common.get('/article/laud', {
      member_id: that.data.member_id,
      article_id: that.data.article_id
    }).then(res => {
      console.log("点赞")
      console.log(res)
      let zan = "detailData.data.laud_status"
      let num = "detailData.data.laud_count"
      var laudCount = parseInt(that.data.detailData.data.laud_count)
      if (that.data.detailData.data.laud_status == 1) {
        console.log("quxiao")
        that.setData({
          [num]:  laudCount -= 1,
          [zan]: 0
        })
      } else {
        let comp = that.selectComponent("#comp");
        comp.myevent(e.touches[0].pageX, e.touches[0].pageY);
        that.setData({
          [num]: laudCount += 1,
          [zan]: 1
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  },
  myCatchTouch() { //弹框状态禁止滑动
    return;
  },
  turnto() {
    let pageslist = getCurrentPages();
    console.log(pageslist.length);
    if(pageslist && pageslist.length > 1) {
      wx.navigateBack({delta: -1});
    } else {
      wx.reLaunch({url: "/pages/index/index"});
    }
  },
  popLock: function(event) { // 初始化弹框
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop1: app.globalData.pop1,
      pop2: app.globalData.pop2,
      pop3: app.globalData.pop3,
      pop4: app.globalData.pop4,
    });
  },
  onShareAppMessage: function (res) { //分享
    let that = this  
    console.log(res)
    let url = '/packageB/pages/qhyRally/articleDetail/index?article_id=' + that.data.article_id;
    if (res.from === 'button') {
      let shareTxt = res.target.dataset.sharetxt;
      return {
        title: '青山生态 ' + shareTxt,
        path: url,
        imageUrl: '',
        success: function (res) {
          // 转发成功
          console.log(res)
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
    return {
      title: '青山生态 正在发生…',
      imageUrl: '',
      path: url,
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    }
  },
  // onReachBottom(){
  //   let that = this;
  //   let member_id = that.data.member_id;
  //   common.get('/environmental/bank/do_read',{member_id}).then(res =>{
  //     console.log(res)
  //   })
  // },

})