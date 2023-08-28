const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberid:'',
    prizeList:[], // 每项的奖品
    open_active:[], //  全部可参与的项
    open_info:{}, //  每项
    makephoto:false,
    active_info:[],
    tab_view_id:0,
    show_status:false,
    swiper_index: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      memberid: wx.getStorageSync('member_id'),
    })
     // 转百度定位坐标
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
    that.getPennyinfo();
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


  getPennyinfo(){
    let that = this;
    let tab_view_id = that.data.tab_view_id;
    common.get('/public_welfare/index',{
      member_id: wx.getStorageSync('member_id')
    }).then(res =>{
      if(res.data.code == 200){
        let open_active = res.data.data.open_active;
        let prizeList = [];
        let obj = {};
        let idx = 3;
        for(let i = 1; i<= idx; i++){
          let name = 'prize_name' + i;
          let pic = 'prize_pic' + i;
          let price = 'prize_price' + i;
          obj = {
            prize_name: open_active[tab_view_id][name],
            prize_pic: open_active[tab_view_id][pic],
            prize_price: open_active[tab_view_id][price]
          }
          prizeList.push(obj)
        }
        that.setData({
          tab_view_id,
          open_active,
          open_info: open_active[tab_view_id],
          prizeList,
          end_list: res.data.data.end_list,
          notic: res.data.data.notic
        })
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
  // signActivityBtn(){
  //   let that = this;
  //   setTimeout(function(){
  //     wx.navigateTo({
  //       url: '/packageA/pages/choosedynamic/index',
  //     })
  //   },2000)
  // },
  signActivityBtn(){
    let that = this;
    common.post('/public_welfare/record',{
      type: 2,
      welfare: that.data.open_info.id,
      content_id: that.data.open_info._story.id,
      member_id: wx.getStorageSync('member_id'),
      lat: that.data.latitude,
      lng: that.data.longitude
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
          wx.showToast({
            title: '活动参与成功！',
            icon:'none',
            duration: 2500
          })
          that.getPennyinfo();
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
  goToPast(){
    wx.navigateTo({
      url: '/packageA/pages/pastRank_page/index',
    })
  },
  goToPrize_Activity(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let prizeList = that.data.prizeList;
    app.globalData.apenny_prizedata = prizeList[index];
    wx.navigateTo({
      url: '/packageA/pages/prize_Activity/index',
    })
  },
  gototheir_list(){
    wx.navigateTo({
      url: '/packageA/pages/their_list/index',
    })
  },






// 点击项目列表
  tab_view(e){
    let that = this;
    let open_active = that.data.open_active;
    let tab_view_id = e.currentTarget.dataset.index;
    let prizeList = [];
    let obj = {};
    let idx = 3;
    for(let i = 1; i<= idx; i++){
      let name = 'prize_name' + i;
      let pic = 'prize_pic' + i;
      let price = 'prize_price' + i;
      obj = {
        prize_name: open_active[tab_view_id][name],
        prize_pic: open_active[tab_view_id][pic],
        prize_price: open_active[tab_view_id][price]
      }
      prizeList.push(obj)
    }
    that.setData({
      tab_view_id,
      open_info: open_active[tab_view_id],
      prizeList
    })
  },
    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let that = this;
    console.log(e)
    let my_record = that.data.open_info.my_record[0];
    let content = my_record.content;
    let id = content.id;
    let img = content.images[0].url;
    var url = '/packageA/pages/apenny_dynamic_pages/index?contentid=' + id + '&member_id=' + wx.getStorageSync('member_id');
    if(e.from == "button"){
      console.log(1)
      return{
        title:'为我点个赞呗！',
        path: url,
        imageUrl: img,
        success: function(res) {
          // 转发成功
          that.submit_btn(id);
         console.log('转发成功1')
        },
        fail: function(res) {
          // 转发失败
        }
      }
    }

  },
  // 点击跳转分享点赞页面
  goToAdynamicPages(e){
    let that = this;
    let contentid = e.currentTarget.dataset.contentid;
    var url = '/packageA/pages/apenny_dynamic_pages/index?contentid=' + contentid + '&member_id=' + wx.getStorageSync('member_id');
    wx.navigateTo({
      url,
    })
  },
  // 生成海报
  gotoMakephoto(){
    let that = this;
    let type = 'public_welfare';
    let my_record = that.data.open_info.my_record[0];
    let my_content = my_record.content;
    let content = my_content.words;
    let id = my_content.id;
    let page_url = 'packageA/pages/apenny_dynamic_pages/index';
    let icon_path = '';
    let member_id= wx.getStorageSync('member_id');
    publicMethod.gotoMakephoto(that,type,id,page_url,content,icon_path,member_id);

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
  },
  //打开全文
  openFulltxt() { 
    let that = this;
    that.setData({
      show_status: !that.data.show_status
    })
  },

  gotoshop(e){
    console.log(e)
    let id = e.currentTarget.dataset.id;
    if(id){
      wx.navigateTo({
        url: '/pages/shop/shop?business_id=' + id,
      })
    }

  }
})