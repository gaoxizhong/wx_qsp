const app = getApp();
const common = require('../../../../assets/js/common');
const publicMethod = require('../../../../assets/js/publicMethod');
const Makephoto = require('../../../../assets/js/setting');
var zhuan_dingwei = require('../../../../assets/js/dingwei.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id: wx.getStorageSync('member_id'),
    nickName:'',
    avatarUrl:'',
    canIUseGetUserProfile: false,
    wenzData:[],
    dataStatus: false,
    idleList:[],
    full_listdata:[],
    longitude: '',
    latitude: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options.scene) {
      Object.assign(this.options, this.getScene(options.scene)) // 获取二维码参数，绑定在当前this.options对象上
    }
    console.log(this.options) // 这时候就会发现this.options上就会有对应的参数了
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    if (this.options.member_id) {
      that.setData({
        member_id: wx.getStorageSync('member_id'),
        shangjia_id: this.options.member_id,
        personData: wx.getStorageSync('user_info'),
        idle_hidden:true
      })
    }

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
      member_id: wx.getStorageSync('member_id'),
      page1: [],
      showFull: [],
      idleList: [],
      dataStatus: false,
      full_listdata:[],
      myfull_listdata:[],
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude,
    })
    that.getData();
  },
  getData() { //初始化数据
    let that = this
    that.getUserIdentify();
    // 附近闲置
    // that.getidleList();
    // 附近求购
    that.getfull_list();
    // 我的求购
    that.getmyfull_list();

  },
  //获取登录人的身份
  getUserIdentify() {
    let that = this;
    let prems = {
      member_id: wx.getStorageSync('member_id'),
    }
    common.get("/member/getMemberIdentity", prems).then(res => {
      if (res.data.code == 200) {
        that.setData({
          avatarUrl: res.data.avatar,
          nickName: res.data.nickname
        })
      }
    })
  },
  // 求购闲置列表
  getfull_list(){
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/idle/idle_purchase',{
      page: 1,
      lng: that.data.longitude,
      lat: that.data.latitude,
    }).then(res => {
      if(res.data.code == 200){
        wx.hideLoading();
        let arr = [];
        let result = res.data.data.result;
        result.forEach(ele =>{
          if(that.data.member_id != ele.member_id){
            arr.push(ele)
          }
        })
        that.setData({
          full_listdata: arr.splice(0,3),
        });
      }
    }).catch(e => {
        app.showToast({
          title: e.data.msg,
        })
        console.log(e)
      })
  },
  // 我的求购列表
  getmyfull_list(){
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/idle/idle_purchase',{
      page: 1,
      lng: that.data.longitude,
      lat: that.data.latitude,
      member_id: wx.getStorageSync('member_id'),
    }).then(res => {
      if(res.data.code == 200){
        wx.hideLoading();
        that.setData({
          myfull_listdata: res.data.data.result.splice(0,1),
        });
      }
    }).catch(e => {
        app.showToast({
          title: e.data.msg,
        })
        console.log(e)
      })
  },
  //前往活动详情
  goToActivity(e) {
    let that = this;
    let idle_id = e.currentTarget.dataset.idle;
    let member_id = that.data.member_id;
    let busnesid = e.currentTarget.dataset.busnesid;
    let url = "/pages/mine/myIdle_good/index?member_id=" + member_id + "&idle_id=" + idle_id + "&busnesid=" + busnesid + "&discount_id=" + idle_id
    wx.navigateTo({
      url: url
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
  gotoMyIdle(){
    wx.navigateTo({
      url: '/pages/mine/myIdle/index?member_id=' + wx.getStorageSync('member_id'),
    });
  },
    // 发布闲置物品
    myIdlerelease(e){
      var is_sales = e.currentTarget.dataset.is_sales;
      wx.navigateTo({
        url: '/pages/mine/myIdlerelease/index?is_sales=' + is_sales,
      });
    },
    // gotolottery(){
    //   wx.navigateTo({
    //     url: '/pages/getalllist/getalllist',
    //   })
    // },
    // 去我的闲圈主页
    goToMygroupIndex(){
      wx.reLaunch({
        url: '/packageA/pages/idleGroup/myidleGroupIndex/index?member_id=' + this.data.shangjia_id,
      })
    },
    // 生成海报
  gotoMakephoto() {
    let types = 'xianzhi';
    let ids = this.data.member_id;
    let page_urls = 'pages/mine/myIdle/index';
    let contents = '';
    let icon_paths = '';
    let apiUrls = Makephoto.makeUrl
    if (this.data.shangjia_id){
      ids = this.data.shangjia_id;
    }
    publicMethod.gotoMakephoto(this, types, ids, page_urls, contents, icon_paths, apiUrls);
  },
  // 保存海报
  saveImage(e) {
    publicMethod.saveImage(e, this);
  },
  //图片预览
  previewImage(e) {
    let image_url = [];
    console.log(e)
    image_url.push(e.currentTarget.dataset.img);
    wx.previewImage({
      urls: image_url // 需要预览的图片http链接列表  
    });
  },
  // 关闭海报
  clodmark() {
    this.setData({
      makephoto: false
    })
  },

  //  我的求购
  myBuyingIndex(){
    wx.navigateTo({
      url: '/packageA/pages/idleGroup/myBuyingIndex/index',
    })
  },
  // 发布求购
  createMyBuying(){
    wx.navigateTo({
      url: '/packageA/pages/idleGroup/createMyBuying/index',
    })
  },



  turnto() {
    let pageslist = getCurrentPages();
    console.log(pageslist.length);
    if(pageslist && pageslist.length > 1) {
      wx.navigateBack({delta: -1});
    } else {
      wx.reLaunch({ url: "/pages/getalllist/getalllist"});
    }
  },


  /**
   * 获取小程序二维码参数
   * @param {String} scene 需要转换的参数字符串
   */
  getScene: function (scene = "") {
    if (scene == "") return {}
    let res = {}
    let params = decodeURIComponent(scene).split("&")
    params.forEach(item => {
      let pram = item.split("=")
      res[pram[0]] = pram[1]
    })
    return res
  },
  getinfo_phone(e){
    let that = this;
    let idle_purchase_id= e.target.dataset.id;
    let member_id= wx.getStorageSync('member_id');
    if(!member_id){
      wx.showToast({
        title: '请先登录！',
        icon:'none'
      })
      return
    }
    common.get('/idle/is_phone',{
      idle_purchase_id,
      member_id
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          marsk1: true,
          marsk_name: res.data.data.name,
          marsk_tel: res.data.data.mobile,
        })
      }else if(res.data.code == 206){
        wx.showModal({
          title: '查看电话',
          content: '需支付30积分查看',
          success: function (res) {
            if (res.confirm) {
              common.get('/idle/idle_purchase_phone', {
                idle_purchase_id,
                member_id
              }).then(res => {
                if (res.data.code == 206) {
                  wx.showModal({
                    title: res.data.msg,
                    content: '请先赚取积分',
                    showCancel:false
                  })
                }
                if (res.data.code == 200) {
                  that.setData({
                    marsk1: true,
                    marsk_name: res.data.data.name,
                    marsk_tel: res.data.data.mobile,
                  })
                }

              })
            } else if (res.cancel) {
              console.log('点击了取消')
            }
          }
        })
      }
    })


  },
  delt_btn(e){
    console.log(e)
    let that = this;
    wx.showModal({
      title: '删除信息',
      content: '是否要删除此条信息',
      success(res) {
        if (res.confirm) {
          common.get('/idle/idle_purchase_del', {
            id: e.target.dataset.id
          }).then(res => {
            if (res.data.code == 200) {
              wx.showToast({
                title: res.data.msg,
              })
              that.setData({
                release_marsk: false,
                myfull_listdata: [],
                pageIndex: 1,
                hasMore_full: true,
                fullStatus: false,
              })
              that.getmyfull_list();
            }
            if (res.data.code == 206) {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          }).catch(error => {
            console.log(error);
          })
        } else if (res.cancel) {
          console.log('点击了取消')
        }
      }
    })
  },
  left_btn(){
    this.setData({
      marsk1: false,
    })
  },
  /**调用电话 */
  tel: function () {
    if (this.data.marsk_tel != null) {
      wx.makePhoneCall({
        phoneNumber: this.data.marsk_tel,
      })
    } else {
      app.showToast({
        title: "暂无联系电话"
      })
    }
  },
  //  附近求购
  goToFjQgList(){
    wx.navigateTo({
      url: '/packageA/pages/idleGroup/fjQgList/index',
    })
  },
  goToqgList(){
    wx.navigateTo({
      url: '/packageA/pages/idleGroup/myQgList/index',
    })
  }
  
})
