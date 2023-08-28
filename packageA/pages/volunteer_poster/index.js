const app = getApp()
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_id: '',
    contentid: '',
    text:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      activity_id: options.activity_id,
      contentid: options.contentid,
      text: options.notice
    })
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
    this.gotoMakephoto();
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
    // 生成海报
    gotoMakephoto(){
      let that = this;
      let type = 'activity';
      let content = '';
      let id = that.data.contentid;
      let page_url = 'packageA/pages/vol_act_pages/index';
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
    // goto_pages(){
    //   wx.navigateTo({
    //     url: '/packageA/pages/vol_act_pages/index',
    //   })
    // }
      // 点击复制
  fuzhi_btn(){
    let that = this;
    let text = that.data.text;
    wx.setClipboardData({
      data: text,
      success (res) {
        wx.getClipboardData({
          success (res) {
            wx.showToast({
              title: '复制成功！',
            })
          }
        })
      }
    })
  },
})