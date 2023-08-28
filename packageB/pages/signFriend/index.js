const app = getApp();
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '',
    latitude: '',
    pageIndex: 1,
    pageSize: 15,
    hasMore: true,
    count: 0,
    list:[],
    signtList:[], // 签到好友列表
    is_ly: false, // 留言框状态
    selt_id:0, // 选中当前的动态id
    content_uid:0, // 选中当前的动态发布的用户id
    textVal:'',
    is_gift: false, // 礼物弹窗状态
    giftList:[], // 礼物列表
    savaStatus: true,
    like_status: true,
    // ======= 做任务赚积分数据  
    is_Signtask:0,
    task_id: 0,
    is_signTaskMask: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      latitude : app.globalData.latitude,
      longitude : app.globalData.longitude,
    })
    // ======= 做任务赚积分数据  
    if(options.is_Signtask){
      that.setData({
        is_Signtask: options.is_Signtask,
        task_id: options.task_id
      })
    }
    // ======= 做任务赚积分数据  
    that.getSigntList();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      member_id: wx.getStorageSync('member_id'),
    })
  },
  onPullDownRefresh() { //下拉刷新
    let that = this;
    that.setData({
      signtList:[], // 签到好友列表
      list:[],
      count: 0,
      pageIndex: 1,
      hasMore: true,
    })
    that.getSigntList();
    wx.stopPullDownRefresh();
  },
    /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    wx.showLoading({
      title: "加载中...",
      icon: 'none',
      mark: true,
    })
    setTimeout(function () {
      that.setData({
        pageIndex: (that.data.pageIndex + 1)
      })
      that.getlistData();
      wx.hideLoading()
    }, 1000)
  },
  getlistData(){ // 前端实现一次获取总数据后分页获取数据
    let that = this;
    if (!that.data.hasMore) {
      wx.showToast({
        title: '已加载全部数据',
        icon: 'none'
      })
      return
    }
    let page = (that.data.pageIndex - 1);
    let list = that.data.list;
    let count = that.data.count;// 获取数据的总数
    let flag = that.data.pageIndex * that.data.pageSize < count;
    that.setData({
      hasMore: flag,
    })
    // 将新获取的数据拼接到之前的数组中
    that.setData({
      signtList: that.data.signtList.concat(list[page]),
    })
  },

  getSigntList(){
    let that = this;
    wx.showLoading({
      title: '加载中....',
    })
    common.get('/mine/index?op=friend_content',{
      member_id: wx.getStorageSync('member_id'),
      lng: that.data.longitude,
      lat: that.data.latitude
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        let data = res.data.data.friend_content;
        let pageSize = that.data.pageSize; // 获取每页个数
        that.setData({
          count: data.length,
          savaStatus: true,
        })
        if(data.length > 0){
          for( let i=0; i<data.length; i+= pageSize){
            // 分割总数据，每个子数组包含个数为pageSize
            that.data.list.push(data.slice(i,i + pageSize))
          }
        }
        that.getlistData();
        
      }else{
        wx.showToast({
          title: res.data.msg,
        })
        
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },



  catchtouchmove(){
    return false
  },
  // 编辑留言
  bindTextChange(e){
    this.setData({
      textVal: e.detail.value
    })
  },
  // 点击留言
  clickisLy(e){
    console.log(e)
    let id = e.currentTarget.dataset.id;
    this.setData({
      is_ly: true,
      selt_id: id
    })
  },
  // 点击留言弹窗蒙层
  is_ly_mask(){
    this.setData({
      is_ly: false,
      selt_id: 0,
      content_uid:0,
      textVal:''
    })
  },

   // 点击送个花花
   clickisGift(e){
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let content_uid = e.currentTarget.dataset.content_uid;
    this.setData({
      is_gift: true,
      selt_id: id,
      content_uid
    })
  },

  // ========================= 礼物列表 ===================

  // ========================= 评论 ===================
  sendComment(e) { //评论
    let that = this
    let savaStatus = that.data.savaStatus
    if (!savaStatus) {
      return
    }
    if (that.data.textVal == '' || that.data.textVal == null) return;
    that.setData({
      savaStatus: false
    })
    let params = {
      member_id: wx.getStorageSync('member_id'),  //当前评论的id
      content_id: that.data.selt_id,  //动态的id
      content: that.data.textVal,  //留言内容
    }
    common.post('/content/comment', params).then(res => {

      if (res.data.code == 200) {
        wx.showToast({
          title: '发送成功！',
        })
        setTimeout(function(){
          that.setData({
            // commentList: [],
            is_ly: false,
            textVal:''
          })
          that.getSigntList();
        },1500)

      } else {
        console.log(res)
        wx.showToast({
          title: res.data.msg,
          icon:'none',
        })
        that.setData({
          savaStatus: true
        })
      }
    }).catch(e => {
      that.setData({
        savaStatus: true
      })
      console.log(e)
    })
  },

  // 点击点赞按钮
  signLike(e){
    let that = this;
    let signCircle = that.data.signCircle;
    let lat = that.data.latitude;
    let lng = that.data.longitude;
    let id = e.currentTarget.dataset.id;
    let ind = e.currentTarget.dataset.curindex;
    let is_like =  '2'; // 点赞按钮
    if ( !that.data.member_id ) {
      return;
    }
    let like_status = that.data.like_status;
    if(!like_status){
      wx.showToast({
        title: '请勿频繁点击！',
        icon:'none'
      })
      return
    }
    that.setData({
      like_status: false
    })
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    common.get('/content/praise', {
      member_id: that.data.member_id,
      content_id: id,
      lat,
      lng,
      is_like,
    }).then(res => {
      wx.hideLoading();
      if(res.data.code == 200){
        wx.showToast({
          title: res.data.msg,
        })
        publicMethod.gotosetint_transac(that);
        let signtList = that.data.signtList;
        signtList[ind].laud_count = parseFloat(that.data.signtList[ind].laud_count) + 1;
        signtList[ind].mine_like = 1;
        that.setData({
          signtList,
          like_status: true

        })
        if(that.data.is_Signtask){
          that.getDoneTask(that.data.task_id);
        }
// =============================== ↓ =====================================
        // 授权订阅消息
        wx.requestSubscribeMessage({   // 调起消息订阅界面
          tmplIds: ['1neA-pyIpkUR4Asv__QNuyCbM4rVIvaoluNlc6XdCJo','8hlnwZd_geXb1g38pEaQFdNnhirnc5wkXaHoGJn4Pls'],
          success(res){
            console.log(res)
          },
          complete (res) { 
          },
        })  
// ================================= ↑ =======================================
      }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none',
            duration: 2000
          })
          that.setData({
            like_status: true
          })

      }
    }).catch(e => {
      wx.hideLoading();
      app.showToast({
        title: "数据异常",
      })
      that.setData({
        like_status: true
      })
      console.log(e)
    })
  },

  show_poster(){
    this.getSigntList();
  },
  goOtherCircle(e) { //去别人的发圈
    let that = this;
    wx.navigateTo({
      url: '/pages/mine/myContent/index?id=' + e.currentTarget.dataset.id,
    })
  },
    // =========  做任务赚积分 弹窗功能 =======
  // 做任务赚积分跳转过来
  getDoneTask(id,jifen){
    let that = this;
    let task_id = id;
    let taskMaskpreview_jifen = jifen;
    common.get('/mine/index?op=done_task',{
      member_id: wx.getStorageSync('member_id'),
      task_id,
    }).then(res =>{
      if(res.data.code == 200){
      if(that.data.is_Signtask == '1'){
        that.setData({
          is_signTaskMask: true,
          taskMaskpreview_title:'欢迎了解图书循环',
          taskMaskpreview_jifen,
        })
        setTimeout(function(){
          that.setData({
            is_signTaskMask: false,
            taskMaskpreview_title:'',
            taskMaskpreview_jifen:'',
            is_Signtask: 0
          })
        },2000)
      }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none',
        })
      }
    }).catch(e=>{
      console.log(e)
    })
  },
  click_mask(){
    this.setData({
      is_signTaskMask: false,
      taskMaskpreview_title:'',
      taskMaskpreview_jifen:'',
      is_Signtask: 0
    })
  },
// =========  做任务赚积分 弹窗功能 =======
})