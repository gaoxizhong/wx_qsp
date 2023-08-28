const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_name:'', // 申报姓名
    vol_number:'', // 志愿者编号
    member_mobile:'', // 手机号
    member_school:'',   // 学校
    garden: '',   // 省市区
    address: '',   //  详细地址
    remark:"",
    is_jiazai: true,
    paper_id:'',
    activity_id:'',
    ext_list:[],
    recover_index:0,
    selectedRecover:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.activity_id){
      this.setData({
        activity_id: options.activity_id
      })
    }
    if(options.paper_id){
      this.setData({
        paper_id: options.paper_id
      })
    }
    publicMethod.zhuan_baidu(this);
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
      is_jiazai: true,
    })
    that.goto_clock();
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
    // 获取信息
    goto_clock(){
      let that = this;
      common.get('/activity/ext_list',{
        member_id: wx.getStorageSync('member_id'),
      }).then(res =>{
        if (res.data.code == 200){
          that.setData({
            // member_name:res.data.data.member_name?res.data.data.member_name:'',
            // vol_number:res.data.data.vol_number?res.data.data.vol_number:'',
            // member_mobile:res.data.data.member_mobile?res.data.data.member_mobile:'',
            // garden:res.data.data.member_garden?res.data.data.member_garden:'',
            // address:res.data.data.member_address?res.data.data.member_address:'',
            // remark:res.data.data.record_remark?res.data.data.record_remark:'',
            ext_list: res.data.data.ext_list,
            selectedRecover: res.data.data.ext_list[0],

          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      })
    },
    formSubmit(e){
      console.log(e)
      let that = this;
      let pream = {
        lng: that.data.longitude,
        lat: that.data.latitude,
        member_id: wx.getStorageSync('member_id'),
        member_name:e.detail.value.member_name,
        vol_number:e.detail.value.vol_number,
        member_mobile:e.detail.value.member_mobile,
        member_garden:that.data.garden,
        member_address:e.detail.value.address,
        remark:e.detail.value.remark,
        update : 1,
      }
      if(!pream.member_name){
        wx.showToast({
          title: '请填写志愿者姓名！',
          icon:'none'
        })
        return
      }
      if(!pream.vol_number){
        wx.showToast({
          title: '请填写志愿者编号！',
          icon:'none'
        })
        return
      }
      if(!pream.member_mobile){
        wx.showToast({
          title: '请填写联系方式！',
          icon:'none'
        })
        return
      }
      if(!pream.member_garden){
        wx.showToast({
          title: '请选择省市区！',
          icon:'none'
        })
        return
      }
      if(!pream.member_address){
        wx.showToast({
          title: '请填写详细地址！',
          icon:'none'
        })
        return
      }
  
      let is_jiazai = that.data.is_jiazai;
      if(!is_jiazai){
        wx.showToast({
          title: '请勿重复提交',
          icon:'none'
        })
        return
      }
      that.setData({
        is_jiazai:false
      })
      wx.showLoading({
        title:'加载中...'
      })
      common.get("/activity/ext",pream).then(res =>{
        if(res.data.code == 200){
          wx.hideLoading();
            that.becomeassistant();
            that.setData({
              is_jiazai:true
            })
        }else{
          wx.hideLoading();
          that.setData({
            is_jiazai:true
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          
        }
      }).catch(e =>{
        console.log(e);
        wx.hideLoading();
        that.setData({
          is_jiazai:true
        })
      })
    },
  //保存小区
  saveGarden(e) {
    this.setData({
      garden: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2])
    })
  },
  //保存地址
  saveAddress(e) {
    this.setData({
      address: e.detail.value
    })

  },
  becomeassistant(){
    let that = this;
    let ext_id = that.data.selectedRecover.ext_id;
    common.post("/activity/be_assistant",{
      member_id: wx.getStorageSync('member_id'),
      activity_id: that.data.activity_id,
      paper_id: that.data.paper_id,
      ext_id,
      is_create: 1,
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: '申请成功！',
          icon:'none'
        })
        let assistant_id = res.data.data.id
        setTimeout(function(){
          wx.navigateTo({
            url: '/packageA/pages/teaching_test/index?paper_id='+ that.data.paper_id + '&activity_id=' + that.data.activity_id + '&assistant_id=' + assistant_id + '&ext_id=' + ext_id,
          })
        },2000)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  //选择信息
  chooseRecover(e) {
    let that = this;
    console.log(e)
    let recover_index = e.currentTarget.dataset.index;
    that.setData({
      recover_index,
      selectedRecover: that.data.ext_list[recover_index],
    })
  },
  fixed_btn(){
    wx.navigateTo({
      url: '/packageA/pages/home_page/volunacti_infoAdd/index',
    })
  },
})