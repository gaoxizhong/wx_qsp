const app = getApp()
const common = require('../../../../assets/js/common');
var WxParse = require('../../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    volunacti_list:[],
    nodes: [{
      name: 'view',
      children: [{
        type: 'text',
        text: 'Hello&nbsp;World!'
      }]
    }],
    number_r: 0,
    show_info:false,
    nav_choose: [],
    click_sele:1,
    my_share:{},
    count:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      number_r:Math.floor(Math.random()*10000),
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
    that.getdetails();
    that.my_share();
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
  // 获取活动信息
  getdetails() { 
    let that = this
    common.get('/activity/index', {
      member_id: wx.getStorageSync('member_id'),
    }).then(res => {
      if (res.data.code == 200) {
        let article = res.data.data.text;
        let tags = res.data.data.tags;
        let array = res.data.data.array;
        let click_sele = that.data.click_sele;
        let key;
        let nav_choose = [];
        for (key in tags) {
           nav_choose.push({
             id: key,
             name: tags[key]
           })
        }
        // array.forEach(ele => {
        //   let aa = ele.tags.indexOf(click_sele)
        //   ele.tags_num = ele.tags[aa]
        // });
        WxParse.wxParse('article', 'html', article, that, 1);
        that.setData({
          volunacti_list:array,
          nav_choose,
          show_info:true
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常"
      })
    })
  },

  gotovolunac_details(e){
    let that = this;
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    let paper_id = e.currentTarget.dataset.paper_id;
    // paper_id 是否是答题
    if(paper_id){
      wx.navigateTo({
        url: '/packageA/pages/cloudSchool_pages/index?id=' + id + '&name='+ name + '&paper_id='+ paper_id,
      })
    }else{
      wx.navigateTo({
        url: '/packageA/pages/home_page/volunacti_details/index?id=' + id + '&name='+ name,
        // url: '/packageA/pages/home_page/volunacti_newDetails/index?id=' + id + '&name='+ name,
      })
    }
  },
  // 图片加载失败时使用默认图片
  // image_error(e){
  //   let that = this;
  //   var errorImgIndex = e.target.dataset.imgindex;
  //   let volunacti_list = that.data.volunacti_list;
  //   volunacti_list[errorImgIndex].icon = "http://oss.qingshanpai.com/banner/activity_error.png";
  //   this.setData({
  //     volunacti_list
  //   }) 
      
  // },
  click_sele(e){
    let that = this;
    let click_sele = e.currentTarget.dataset.id;
    let id = e.currentTarget.dataset.id;
    that.setData({
      click_sele,
    })
  },
  dotoduiz(){
    wx.navigateTo({
      url: '/packageA/pages/duizhang_activ_pages/index',
    })
  },
  // 展示是否是队长
  my_share(){
    let that = this;
    common.get('/activity/my_share',{member_id:wx.getStorageSync('member_id')}).then(res =>{
      if(res.data.code == 200){
        that.setData({
          my_share: res.data.data.my_share,
          count: res.data.data.count
        })
      }else{
        wx.showToast({
          title: res.data.data,
          icon: "none"
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  myduiz(){
    let that = this;
    let my_share = that.data.my_share;
    wx.navigateTo({
      url: '/packageA/pages/home_page/volunacti_details/index?id=' + my_share.activity_id +'&share_id=' + my_share.id +  '&record_count=' + my_share.record_count + '&is_duizhang=1',
    })
  },
  btn_right(){
    wx.showToast({
      title: '暂无通知',
      icon:'none'
    })
  },
  /**调用电话 */
  tel: function (e) {
    let tel = e.currentTarget.dataset.mobile;
    if (tel != null || tel != '') {
      wx.makePhoneCall({
        phoneNumber: tel,
      })
    } else {
      wx.showToast({
        title: "暂无联系电话",
        icon:'none'
      })
    }
  },
  // 跳转成果提交
  gotovolunacti_results(){
    wx.navigateTo({
      url: '/packageA/pages/home_page/volunacti_results/index',
    })
  },
  gotoinfomanagement(){
    wx.navigateTo({
      url: '/packageA/pages/home_page/volunacti_infomanagement/index',
    })
  },
  gotoauditResult(){
    wx.navigateTo({
      url: '/packageA/pages/home_page/volunacti_auditResult/index',
    })
  }
})