const common = require("../../../assets/js/common")
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    my_i:'',
    num:0,
    paper_id:'',
    activity_id:'',
    assistant_id:'',
    S_name:'',
    is_pop: false,
    ext_list:[],
    recover_index:0,
    selectedExt:{},
    details_info:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      paper_id: options.paper_id,
      activity_id: options.activity_id,
    })
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
    let selectedExt = wx.getStorageSync('selectedExt');
    if(!selectedExt){
      common.get('/activity/ext_list',{
        member_id: wx.getStorageSync('member_id'),
      }).then(res =>{
        if (res.data.code == 200){
          that.setData({
            ext_list: res.data.data.ext_list,
            selectedExt: res.data.data.ext_list[0],
          })
        }
      })
    }else{
      that.setData({
        selectedExt
      })
    }
    this.getinfo(this.data.paper_id);
    this.getdetails(this.data.activity_id);
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
  getdetails(id) { 
    let that = this
    common.get('/activity/detail', {
      member_id: wx.getStorageSync('member_id'),
      id
    }).then(res => {
      if (res.data.code == 200) {
        let details_info = res.data.data;
        that.setData({
          details_info,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常"
      })
    })
  },
  gotodati(){
    wx.navigateTo({
      url: '/packageA/pages/cloud_answer/index?paper_id=' + this.data.paper_id + '&activity_id='  + this.data.activity_id + '&assistant_id='  + this.data.assistant_id,
    })
  },
  gototeaching(){
    wx.navigateTo({
      url: '/packageA/pages/cloudSchool_pages/index?paper_id=' + this.data.paper_id + '&id='  + this.data.activity_id,
    })
    return
  },
  getinfo(p){
    let that = this;
    let paper_id = p;
    common.get("/activity/student",{
      member_id: wx.getStorageSync('member_id'),
      paper_id
    }).then(res =>{
      if(res.data.code == 200){
        this.setData({
          assistant_id: res.data.data.assistant,
          my_i: res.data.data,
          num: Number(res.data.data.my_i),
          S_name: res.data.data.wx
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  saveImage(e){
    publicMethod.saveImage(e,this);
  },
    // 点击复制
    fuzhi_btn(){
      let that = this;
      let S_info = that.data.S_name;
      wx.setClipboardData({
        data: S_info,
        success (res) {
          wx.getClipboardData({
            success (res) {
              console.log(res.data) 
              wx.showToast({
                title: '复制成功！',
              })
            }
          })
        }
      })
    },
    gotoduration(){
      let that = this;
      let ext_id = that.data.selectedExt.ext_id;
      common.get("/activity/hour",{
        member_id: wx.getStorageSync('member_id'),
        paper_id: that.data.paper_id,
        ext_id,
        type: 1
      }).then(res =>{
        if(res.data.code == 200){
          wx.showToast({
            title: '提交成功',
            icon: 'none'
          })
          setTimeout(function(){
            wx.reLaunch({
              url: '/packageA/pages/applyduration_succss/index?activity_id=' + that.data.activity_id + '&paper_id=' + that.data.paper_id,
            })
          },1500)
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }).catch(e =>{
        console.log(e)
      })
    },
    goto_clock(){
      let that = this;
      that.setData({
        is_pop1:true,
      })
      setTimeout( ()=>{
        that.setData({
          is_pop1:false,
          is_pop:true,
        })
      },5000)
      return
    },
    //选择信息
    chooseExt(e) {
      let that = this;
      console.log(e);
      wx.navigateTo({
        url: '/packageA/pages/home_page/volunacti_infomanagement/index?is_chooseExt=1',
      })
    },
    click_useinter(){
      let that = this;
      that.setData({
        is_pop:false
      })
    },
    click_useinter_1(){
      let that = this;
      that.setData({
        is_pop1:false,
        is_pop:true,
      })
    },
})