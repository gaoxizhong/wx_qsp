const common = require("../../../assets/js/common");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    answerList:[],
    checked: false,
    activity_id:'',
    paper_id:'',
    assistant_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      activity_id:options.activity_id,
      paper_id:options.paper_id,
      assistant_id: options.assistant_id
    })
    this.getprizeList(options.paper_id,options.activity_id);
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
  onShareAppMessage: function (e) {
    let that = this;
    // let img = content.images[0].url;
    var url = '/packageA/pages/cloud_answer/index?assistant_id=' + that.data.assistant_id + '&paper_id=' + that.data.paper_id + '&activity_id=' + that.data.activity_id;
    if(e.from == "button"){
      return{
        title:'宣传调研',
        path: url,
        imageUrl: '',
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
  // 生成海报
  gotoMakephoto(){
    let that = this;
    let type = 'topic_assistant';
    let assistant_id = that.data.assistant_id;
    let page_url = 'packageA/pages/cloud_answer/index';
    let member_id= wx.getStorageSync('member_id');
    wx.showLoading({
      title: "合成中...",
      icon: 'none',
      mark: true,
    })
      common.get('/Makephoto/new_photo', {
        type,
        id:assistant_id,
        page_url,
        member_id,
      }).then(res => {
        if (res.data.code == 200) {
          wx.hideLoading();
          console.log(res);
          that.setData({
            makephoto : true,
            makephoto_img: res.data.data,
          })
        }
      }).catch(e =>{
        wx.hideLoading();
        console.log(e)
      })
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
                          // wx.navigateBack({
                          //   delta: 1,
                          // })
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
  getprizeList(p,a){
    let that = this;
    let paper_id = p;
    common.get('/topic/show',{
      member_id: wx.getStorageSync('member_id'),
      paper_id
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          answerList:res.data.data.list,
          paper_id:res.data.data.paper_id
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
  }
})