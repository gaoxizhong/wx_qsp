const common = require("../../../../assets/js/common");
const publicMethod = require("../../../../assets/js/publicMethod");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    work_id:'',
    goodsInfo: {}, // 商品详情信息
    like_status: true,
    pop1: false,
    savaStatus: true,
    textVal: '',
    inpPlaceholder: '发表留言...',
    inv_member_id:'', //发起分享的人 id
    swiper_shop:false,
    swiper_index:0,
    top_img:[],
  },
  // 点击轮播图
  previewImage1(e) {
    let that = this;
    console.log(e)
    let swiper_index = e.currentTarget.dataset.subidx;
    that.setData({
      top_img:e.currentTarget.dataset.images,
      swiper_index,
      swiper_shop:true
    })
  },
close_swiper(){
    let that = this;
    that.setData({
      top_img:[],
      swiper_shop:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options);
    that.setData({
      work_id: options.id,
      inv_member_id: options.inv_member_id
    })
    that.getgoodsInfo();
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

  },
  // 商品信息
  getgoodsInfo(){
    let that = this;
    common.get('/life/index?op=work_detail',{
      work_id: that.data.work_id,
    }).then(res =>{
      if(res.data.code == 200){
        let goodsInfo = res.data.data.work;
        that.setData({
          goodsInfo,
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch( e =>{
      console.log(e)
    })
  },


  //前去购买
  gotogoodsdetails(e){
    let id = e.currentTarget.dataset.id;
    let inv_member_id = this.data.inv_member_id;
    wx.navigateTo({
      // url: '/packageB/pages/livingHall/reserve_proDetails/index?id=' + id,
      url: '/packageB/pages/livingHall/reserve_buypages/index?id=' + id + '&inv_member_id=' + inv_member_id,
    })
  },
  // 点赞
  like(e){
    console.log(e)
    let that = this;
    let id = e.currentTarget.dataset.id;
    let ind = e.currentTarget.dataset.index;
    let like_status = that.data.like_status;
    if(!like_status){
      wx.showToast({
        title:'请勿频繁点击！',
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
    common.get('/life/index?op=work_like', {
      member_id: wx.getStorageSync('member_id'),
      work_id: id,
    }).then( res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        wx.showToast({
          title: res.data.msg,
          icon:'none',
        })
        let goodsInfo = that.data.goodsInfo;
        goodsInfo.like_count = parseFloat(that.data.goodsInfo.like_count) + 1;
        goodsInfo.laud_status = 1;
        that.setData({
          like_status: true,
          goodsInfo
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none',
        })
        that.setData({
          like_status: true,
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      that.setData({
        like_status: true
      })
      console.log(e)
    })
  },
  // 点击留言按钮
  clickcomment(){
    this.setData({
      pop1: true
    })
  },
  bindTextChange(e) { //留言val
   let that = this;
    that.setData({
      textVal: e.detail.value
    })
  },
  sendComment(e) { //评论
    let that = this
    let savaStatus = that.data.savaStatus;
    let hfStatus = that.data.hfStatus;
    if (!savaStatus) {
      return
    }
    if (that.data.textVal == '' || that.data.textVal == null) return;
    that.setData({
      savaStatus: false
    })

    let params = {
      member_id: wx.getStorageSync('member_id'), 
      work_id: that.data.work_id,  
      content: that.data.textVal,  //留言内容
    }
  //回复评论
    // if (hfStatus == 1) {
    //   params.replay_member_id = that.data.replay_member_id
    // }

    common.get('/life/index?op=work_comment', params).then(res => {
      that.setData({
        savaStatus: true
      })
      if (res.data.code == 200) {
        wx.showToast({
          title: '留言成功！',
        })
        that.setData({
          pop1: false,
          textVal: '',
          inpPlaceholder: '发表评论',
        })
        // that.getComments();
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
  popLock(){
    this.setData({
      pop1: false
    })
  },
  gotoPersonalHome(){
    let mid = this.data.goodsInfo.member_id;
    wx.navigateTo({
      url: '/packageB/pages/livingHall/personal_home/index?mid=' + mid,
    })
  },
  gotoxms(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/packageB/pages/livingHall/reserve_proDetails/index?p_id=' + id,
    })
  }
})