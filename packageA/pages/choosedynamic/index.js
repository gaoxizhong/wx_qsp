const app = getApp();
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_seleNav:'2',
    photos:[],
    is_foucs: false,
    textarea_focus:false,
    textarea:'',
    my_circle:[],  //  我的动态列表
    showFull:[],
    circle_page: 1, //当前展示页数
    sele_idn:0,
    mydynamic_id:'',
    sele_their_idn:0,
    their_id:'',
    their_story:[],
    theirFull:[],
    latitude:'',
    longitude:'',
    makephoto:false,
    notic:'',
    record_data:{},
    is_clock_text2: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
      // 转百度定位坐标
      publicMethod.zhuan_baidu(this);
    let is_seleNav = that.data.is_seleNav;

    if(is_seleNav == '1'){
      // 我的动态
      that.getwenzhang();
      return
    }
    if(is_seleNav == '2'){
      // 他们的故事
      that.getHelist();
      return
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
    let that = this;
    let is_seleNav = that.data.is_seleNav;
    that.setData({
      circle_page: (that.data.circle_page + 1)
    })
    if(is_seleNav == '1'){
      // 我的动态
      that.getwenzhang();
      return
    }
    if(is_seleNav == '2'){
      // 他们的故事
      that.getHelist();

      return
    }
  },


  cliek_fenxiang_btn(){
    let that = this;
    let mydynamic_id = that.data.mydynamic_id;
    let their_id = that.data.their_id;
    let is_seleNav = that.data.is_seleNav;
    let id = '';
    if(is_seleNav == '1'){
      id = mydynamic_id;
    }else{
      id = their_id;
    }
    common.post('/public_welfare/record',{
      type: is_seleNav,
      content_id: id,
      member_id: wx.getStorageSync('member_id'),
      lat: that.data.latitude,
      lng: that.data.longitude
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        let record_data = res.data.data;
        that.setData({
          record_data,
          is_clock_text2: true
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
    })
  },
    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let that = this;
    console.log(e)
    let record_data = that.data.record_data;
    let img = record_data.images[0].url;
    let url = '/packageA/pages/apenny_dynamic_pages/index?contentid=' + record_data.id + '&member_id=' + wx.getStorageSync('member_id');
    if(e.from == "button"){
      console.log(1)
      return{
        title:'为爱而赞，集赞赢大奖！',
        path: url,
        imageUrl: img,
        success: function(res) {
          // 转发成功
         console.log('转发成功1')
        },
        fail: function(res) {
          // 转发失败
        }
      }

    }

  },
  cle_marek2(){
    let that = this;
    that.setData({
      is_clock_text2: false
    })
     wx.navigateBack({
      delta: 1,
     })
  },
  submit_btn(t,id,is_seleNav,fn){
    let that = t;
    let _id = id;
    let _is_seleNav = is_seleNav;
    wx.showLoading({
      title: '加载中...',
    })
    common.post('/public_welfare/record',{
      type: _is_seleNav,
      content_id: _id,
      member_id: wx.getStorageSync('member_id'),
      lat: that.data.latitude,
      lng: that.data.longitude
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        wx.showToast({
          title: '参与成功',
          icon:'none'
        })
        
        let record_data = res.data.data;
        that.setData({
          record_data,
        })
        if( typeof fn == "function"){
          let page_url = 'packageA/pages/apenny_dynamic_pages/index';
          let icon_path = '';
          let member_id= wx.getStorageSync('member_id');
          let type = 'public_welfare';
          let content = record_data.words;
          let id = record_data.id;
          return fn(that,type,id,page_url,content,icon_path,member_id);
        }else{
          setTimeout(function(){
            wx.navigateBack({
              delta: 1,
            })
          },2000)
        }

      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
    })
  },
  seleNav(e){
    let that = this;
    let is_seleNav = e.currentTarget.dataset.index;
    console.log(is_seleNav)
    that.setData({
      is_seleNav,
    })
    if(is_seleNav == '1'){
      that.setData({
        showFull:[],
        my_circle:[],
        sele_idn:0,
        sele_their_idn:0,
        circle_page:1
      })
      // 我的动态
      that.getwenzhang();
      return
    }
    if(is_seleNav == '2'){
      // 他们的故事
      that.getHelist();
      return
    }
  },
  is_foucs(){
    this.setData({
      is_foucs: true,
      textarea_focus: true
    })
  },
  textarea_blur(e){
    let that = this;
    console.log(e)
    let value = e.detail.value;
    if(value == '' || !value){
      that.setData({
        is_foucs: false,
        textarea_focus: false
      })
    }
  },
  //  我的动态列表
  getwenzhang() { 
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/public_welfare/content', {
      member_id: wx.getStorageSync('member_id'),
      page: that.data.circle_page,
    }).then(res => {
      wx.hideLoading();
      let my_circle = res.data.data.list
      if (my_circle.length <= 0) {
        setTimeout(function() {
          that.setData({
            dataStatus: true
          })
        }, 500)
      }
      for (var i = 0; i < my_circle.length; i++) {
        let obj = {}
        obj.leng = my_circle[i].words.length
        obj.status = false
        that.data.showFull.push(obj)
      }
      that.setData({
        showFull: that.data.showFull,
        my_circle,
        mydynamic_id: my_circle[0].id,
      })
    }).catch(e => {
      wx.hideLoading();
      console.log(e)
    })
  },
  // 他们的故事列表
  getHelist() { 
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/public_welfare/storyList', {
      member_id: wx.getStorageSync('member_id'),
      page: that.data.circle_page,
    }).then(res => {
      wx.hideLoading();
      let their_story = res.data.data.storyList;
      for (var i = 0; i < their_story.length; i++) {
        let obj = {}
        obj.leng = their_story[i].content.length
        obj.status = false
        that.data.theirFull.push(obj)
      }
      that.setData({
        theirFull: that.data.theirFull,
        their_story,
        their_id: their_story[0].id,
        notic: res.data.data.notic
      })
    }).catch(e => {
      wx.hideLoading();
      console.log(e)
    })
  },
  //前往发圈 
  goToPublish() {
    wx.navigateTo({
      url: "/pages/publish/publish?is_apenny=1"
    })
  },
  // 选择我的动态
  sele_circle(e){
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let mydynamic_id = e.currentTarget.dataset.id;
    this.setData({
      sele_idn: index,
      mydynamic_id
    })
  },
  // 选择他们的故事
  sele_their(e){
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let their_id = e.currentTarget.dataset.id;
    this.setData({
      sele_their_idn: index,
      their_id
    })
  },
  // 生成海报
  gotoMakephoto(){
    let that = this;
    let mydynamic_id = that.data.mydynamic_id;
    let their_id = that.data.their_id;
    let is_seleNav = that.data.is_seleNav;
    let id = '';
    if(is_seleNav == '1'){
      id = mydynamic_id;
      console.log(id)
    }else{
      id = their_id;
    }
    console.log(that.data.latitude)
    console.log(that.data.longitude)
    that.submit_btn(that,id,is_seleNav,publicMethod.gotoMakephoto);
  },

  // 保存图片
  saveImage(e) {
    let that = this;
    console.log(e)
    wx.showModal({
      content: '保存图片到相册后，可分享至微信朋友圈',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '保存中...',
            mask: true,
          });
          wx.downloadFile({
            url: e.currentTarget.dataset.img,
            success: function (res) {
              console.log(e)
              if (res.statusCode === 200) {
                
                let img = res.tempFilePath;
                wx.saveImageToPhotosAlbum({
                  filePath: img,
                  success(res) {
                    wx.showToast({
                      title: '保存成功',
                      icon: 'success',
                      duration: 2000,
                      success: function () {
                        that.setData({
                          makephoto: false,
                        })
                        setTimeout(function(){
                          wx.navigateBack({
                            delta: 1,
                          })
                        },1500)
                      }
                    });
                  },
                  fail(res) {

                    wx.showToast({
                      title: '保存失败',
                      icon: 'success',
                      duration: 2000
                    });
                  }
                });
              }
            },
            fail(res) {
                  
              wx.showToast({
                title: '保存失败',
                icon: 'success',
                duration: 2000
              });
            }
          });
        }
      }
    })

  },
  //图片预览
  previewImage(e) { 
    let image_url= [];
    image_url.push(e.currentTarget.dataset.img);
    wx.previewImage({
      urls: image_url // 需要预览的图片http链接列表  
    });
  },
  // 关闭海报
  clodmark(){
    this.setData({
      makephoto:false
    })
    setTimeout(function(){
      wx.navigateBack({
        delta: 1,
      })
    },1500)
  },
  openFulltxt(e) { //打开全文
    publicMethod.openFulltxt(e, this)
  },
   //打开他们的故事全文
  openFulltxt1(e) {
    publicMethod.openFulltxt1(e, this)
  },
})