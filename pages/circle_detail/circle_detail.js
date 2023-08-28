const app = getApp();
const common = require('../../assets/js/common');
const publicMethod = require('../../assets/js/publicMethod');
const imgUrl = app.data.imgUrl;
let time1 = null;
let page = 2;
Page({
  data: {
    img_url: app.data.imgUrl,
    swiperCurrent: 0,
    savaStatus: true,
    reeachBottomStatus: true,
    textVal: '',
    inpPlaceholder: '发表评论',
    wenzData: [],
    page1: [],
    loadend: [],
    showFull: [],
    contentid : 0,
    unData: {
      unlauds: 0,
      unreads: 0,
      uncomment: 0
    },
    isReset: 0, //子页面跳转是否刷新页面
    catelist: [],
    target_title: "",
    targetCate: '',
    barrageList: [],
    loopShow: 1,
    isAuthorize:false,
    // 以上是之前的变量-----------------------
    commentList: [],  //评论
    personalInfo: '',  //个人信息
    commentListLength: 0,  //评论数量,
    comment_page: 1,  //评论当前页数
    wenzData: [],  //文章详情，只有1个,
    replay_member_id: '',  //评论别人，别人的id
    is_n: 0,
    is_ad: true, // 广告位显示隐藏
  },
  onLoad: function(options) {
    let member_id = wx.getStorageSync('member_id');
    let that = this;
    console.log(options);
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
    })
    if (options.contentid) {
      that.setData({
        contentid : options.contentid
      })
    }
    if(options.is_n){
      that.setData({
        is_n: options.is_n
      })
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        is_circle: 1
      })
    }
    that.getData();
  },
  onShow() {
    let member_id = wx.getStorageSync('member_id')
    this.audioCtx = wx.createAudioContext('myAudio');

    if(!member_id){
      this.getBannerUrls();
      this.getBarrage();
      return
    }
    //全局配置
    publicMethod.getConfig(this)
    publicMethod.zhuan_baidu(this)
    setTimeout(() => {
      // 未读
      publicMethod.getUnreadNum(this)
    }, 500)
    let that = this
    if (that.data.isReset == 1) { //是否刷新页面
      that.setData({
        page1: [],
        showFull: []
      })
      that.getData()
    }
  },
  onHide() {
    console.log("circle结束");
    clearInterval(time1);
  },
  onUnload() {
  },
  getData() { //初始化数据
    let that = this
    that.getOneDetail();
    that.getComments();
  },
  //获取动态详情
  getOneDetail() {
    let that = this;
    common.get("/content/getContentInfo", {
      content_id: that.data.contentid,
      member_id: that.data.member_id
    }).then( res => {
      if ( res.data.code == 200 ) {
        console.log(res.data);
        let content = [res.data.data.content];
        that.setData({
          personalInfo: res.data.data,
          wenzData: content
        })
      }
    }).catch( error => {
      console.log(error);
    })
  },
  //回复评论
  commentToComment(e) {
    let that = this;
    let replay_member_id = e.currentTarget.dataset.id;
    let replay_member_name = e.currentTarget.dataset.name;
    console.log(e.currentTarget.dataset.id);
    if ( replay_member_id == that.data.member_id ) {
      wx.showToast({
        title: '不可以评论或回复自己！',
        duration: 1000,
        icon: 'none'
      })
      return
    }
    that.setData({
      replay_member_id: replay_member_id
    })
    publicMethod.hfComment([replay_member_id, replay_member_name],that);
  },
  //获取动态的评价详情
  getComments() {
    let that = this;
    common.get("/content/getContentComments", {
      content_id: that.data.contentid,
      page: that.data.comment_page
    }).then( res => {
      if ( res.data.code == 200 ) {
        console.log(res.data.data);
        let commentList = that.data.commentList.concat(res.data.data);
        that.setData({
          commentList: commentList,
          commentListLength: res.data.count
        })
      } else if ( res.data.code == 206 ) {
        wx.showToast({
          title: "没有更多评论了！",
          icon: "none"
        })
      }
    })
  },
  goChat(e) {
    wx.showTabBar()
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
  //打电话
  openCall(e) { 
    let phone = e.currentTarget.dataset.phone;
    if ( phone ) {
      wx.makePhoneCall({
        phoneNumber:phone
      })
    } else {
      wx.showToast({
        title: '暂无联系方式！',
        icon: 'none'
      })
    }

  },
  getFormId(e) { //取formid
    publicMethod.getFormId(e, this)
  },
  guanzhu(e) { //关注
    let that = this;
    publicMethod.guanzhu(e, this, function(res) {
      console.log(res,'xiangqing');
      if ( res.data.msg === '已关注' ) {
        that.data.wenzData[0].is_concern = 1;
        that.setData({
          wenzData: that.data.wenzData
        })
      } else {
        that.data.wenzData[0].is_concern = 0;
        that.setData({
          wenzData: that.data.wenzData
        })
      }
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
  // sendComment(e) { //评论
  //   publicMethod.sendComment(e, this)
  // },
  sendComment(e) { //评论
    let that = this
    let savaStatus = that.data.savaStatus
    let hfStatus = that.data.hfStatus
    if (!savaStatus) {
      return
    }
    if (that.data.textVal == '' || that.data.textVal == null) return;
    that.setData({
      savaStatus: false
    })

    let params = {
      member_id: that.data.member_id,  //当前评论的id
      content_id: that.data.contentid,  //文章的id
      content: that.data.textVal,  //留言内容
    }

    let obj = {
      "content": that.data.textVal,
      "other_id": that.data.member_id,
    };

    if (hfStatus == 1) { //回复评论
      params.replay_member_id = that.data.replay_member_id
    }

    common.post('/content/comment', params).then(res => {
      that.setData({
        savaStatus: true
      })
      if (res.data.code == 200) {
        that.setData({
          pop1: false,
          textVal: '',
          inpPlaceholder: '发表评论',
          comment_page: 1,
          commentList: [],
        })
        that.getComments();
      } else {
        console.log(res)
        wx.showToast({
          title: res.data.msg,
          icon:'none',
        })
      }
    }).catch(e => {
      that.setData({
        savaStatus: true
      })
      console.log(e)
    })
  },
  like(e) { //点赞
    publicMethod.like(e, this)
    
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
    let contentId = that.data.contentId;
    let url = 'pages/circle/circle?contentid=' + contentId;
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
      title: '青山生态',
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
  //触底函数
  onReachBottom() {
    let that = this;
    that.setData({
      comment_page: (that.data.comment_page + 1)
    })
    that.getComments();
  },
  adClose(){
    this.setData({
      is_ad: false
    })
  }
})