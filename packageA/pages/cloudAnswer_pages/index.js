const app = getApp();
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    answerList:[],
    is_return: true,
    canIUseGetUserProfile: false,
    paper_id:'',
    assistant_id:'',
    can_answer: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    /**
     * Object.assign(any,any1) 用于对象的合并
     * 获取二维码的参数，绑定到当前this.options对象上
     */
    if(options.scene){
      Object.assign(this.options,this.getScene(options.scene))
    }
    console.log(this.options)
    if(this.options.paper_id){
      this.setData({
        paper_id:options.paper_id,
        assistant_id:options.assistant_id == "undefined"?'':options.assistant_id
      })
    }


    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    // 禁止右上角转发
    wx.hideShareMenu();
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
    let that = this;
    that.setData({
      is_return: true,
      answerList:[],
    })
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      that.setData({
        pop2:true
      })
    }else{
      that.setData({
        member_id,
        pop2:false
      })
    }

    that.getanswerList();
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

  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const index = e.currentTarget.dataset.index;
    const answerList = this.data.answerList;
    const items = answerList[index].data.option;
    answerList[index].data.user_key = e.detail.value;
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].key === e.detail.value;
    }
    this.setData({
      answerList,
    })
    console.log(this.data.answerList)
  },

  

  // 提交答题页

  goto_points_gifts(){
    let that = this;
    let data = that.data.answerList;
    let activity_id = that.data.activity_id;
    let pear = {
      member_id: wx.getStorageSync('member_id'),
      data,
    }
    if(that.data.assistant_id !='undefined' && that.data.assistant_id && that.data.assistant_id !='' && that.data.assistant_id !='0'  && that.data.assistant_id != 0){
      pear.assistant_id = that.data.assistant_id
    }else{
      pear.paper_id = that.data.paper_id
    }
    console.log(data)
    let is_return = that.data.is_return;
    if(!is_return){
      wx.showToast({
        title: '正在提交中，请勿重复提交',
        icon:'none'
      })
      return
    }
    that.setData({
      is_return: false
    })
    wx.showLoading({
      title: '提交中...',
    })
    common.post('/topic/answer',pear).then(res =>{
      wx.hideLoading();
      setTimeout(function(){
        wx.reLaunch({
          url: '/packageA/pages/cloudFraction_pages/index?assistant_id=' + that.data.assistant_id + '&paper_id=' + that.data.paper_id + '&activity_id=' + activity_id,
        })
        return
      },1500)
      // if(res.data.code == 200){
      //   wx.showToast({
      //     title: '提交成功！',
      //     icon:'none'
      //   })
      //   setTimeout(function(){
      //     wx.reLaunch({
      //       url: '/packageA/pages/cloudFraction_pages/index?assistant_id=' + that.data.assistant_id + '&paper_id=' + that.data.paper_id + '&activity_id=' + activity_id,
      //     })
      //     return
      //   },1500)
      // }else{
      //   that.setData({
      //     is_return: false
      //   })
      //   setTimeout(function(){
      //     wx.showToast({
      //       title: res.data.msg,
      //       icon:'none'
      //     })
      //   },2000)

      // }
    }).catch(e =>{
      that.setData({
        is_return: false
      })
      wx.hideLoading();
      console.log(e)
    })
  },
  getanswerList(){
    let that = this;
    common.get('/topic/show',{
      member_id: wx.getStorageSync('member_id'),
      paper_id: that.data.paper_id,
      assistant_id: that.data.assistant_id
    }).then(res =>{
      if(res.data.code == 200){
        let answerList = res.data.data?res.data.data.list:[];
        let can_answer = res.data.data.can_answer;
        let activity_id = res.data.data.assistant_activity;
        if(!can_answer){
          wx.showModal({
            content: '您已答题过了，请勿重复答题',
            confirmColor:'#ff1111',
            showCancel:false,
            success:function(res){
              if (res.confirm){
                wx.reLaunch({
                  url:'/packageA/pages/home_page/volunacti_page/index'
                })
              }
            }
          })
        }
        that.setData({
          answerList,
          can_answer,
          paper_id: res.data.data.paper_id,
          activity_id,
        })

      }

    }).catch(e =>{
      console.log(e)
    })
  },

    /**
   * 获取小程序二维码参数
   * {string} scene 需要转换的参数字符串
   */
  getScene(scene = "") {
    if(scene == "") return {} 
    let res = {}
    let params = decodeURIComponent(scene).split ("&")
    params.forEach( item => {
      let pram = item.split("=")
      res[pram[0]] = parm[1]
    })
    return res
  },
  cancelLogin() {
    this.setData({
      pop2: false
    })
    console.log('取消授权完成')
  },
})