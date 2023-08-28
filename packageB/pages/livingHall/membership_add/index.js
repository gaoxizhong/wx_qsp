const common = require("../../../../assets/js/common")
const publicMethod = require('../../../../assets/js/publicMethod');
const setting = require('../../../../assets/js/setting');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    v_back: '',  //背景
    contact_name : '',
    contact_phone : '',
    garden:'',
    contact_area : '',
    longitude:'',
    latitude:'',
    region:['北京','北京市','东城区'],
    card_type: '',
    config_id:'',
    card_num: '',
    card_price: '',
    is_xiu:'',  //  1、修改信息
    official_type: '', // 1、开通会员
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if(options.is_xiu){
      that.setData({
        is_xiu: options.is_xiu
      })
    }
    if(options.official_type == '1'){
      that.setData({
        card_type: options.card_type,
        config_id: options.config_id,
        card_num: options.card_num,
        card_price: options.card_price,
        official_type: options.official_type
      })
    }
    that.getmy_space();
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
  saveGarden(e) {
    console.log(e)
    this.setData({
      garden: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2])
    })
  },
  //保存资料
  savaData: function(e) {
    let that = this;
    console.log(e)
    let formData = e.detail.value;
    let garden = that.data.garden;
    if ( garden == '' || formData.contact_name == '' || formData.contact_phone == '' || formData.contact_area == '') {
      wx.showToast({
        title: "请将资料填写完整!",
        icon:'none'
      })
      return;
    }
    let postmsg = {
      member_id: wx.getStorageSync('member_id'),
      name: formData.contact_name,
      mobile: formData.contact_phone,
      address: formData.contact_area,
      garden,
      background: that.data.v_back,
    }
    that.sendRegister(postmsg);
  },
  //提交
  sendRegister(data) {
    let that = this;
    let params = data;
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/life/index?op=edit_space',params).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        let is_xiu = that.data.is_xiu;
        if( !is_xiu ){
          setTimeout(() => {
            that.create_order();
          }, 500);
        }else{
          wx.showToast({
            title: '修改成功！',
          })
          setTimeout(() => {
            wx.navigateBack({
              delta:1,
            })
          }, 1500);
        }

      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }).catch( e =>{
      wx.hideLoading();
      console.log(e)
    })
  },
  create_order(){
    let that = this;
    let p = {
      member_id : wx.getStorageSync('member_id'),
      card_num : that.data.card_num,
      card_type : that.data.card_type,
      config_id :  that.data.config_id,
      official_type : '1'
    };
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/life/index?op=create_order_official',p).then( res=> {
      wx.hideLoading();
      if (res.data.code == 200) {
        var is_free = res.data.data.is_free;
        if(is_free == 0){
          var $config = res.data.data.config;
          wx.requestPayment({
            timeStamp: $config['timeStamp'], //注意 timeStamp 的格式
            nonceStr: $config['nonceStr'],
            package: $config['package'],
            signType: $config['signType'],
            paySign: $config['paySign'], // 支付签名
            success: function (res) {
              // 支付成功后的回调函数
              wx.showToast({
                title: '开通成功!',
                duration: 1000,
                icon: 'success'
              })
                // 开通会员
              setTimeout(function () {
                wx.reLaunch({
                  url: '/packageB/pages/livingHall/member_centre/index'
                })
              }, 1500)
  
            },
            fail: function (e) {
              console.log(e)
              wx.showToast({
                title: '支付失败！',
                duration: 1000,
                icon: 'none'
              })
              return;
            }
          });
        }
        if(is_free == 1){
          wx.showToast({
            title: '开通成功！',
            icon: 'success'
          })
          // 开通会员
          setTimeout(function () {
            wx.reLaunch({
              url: '/packageB/pages/livingHall/member_centre/index'
            })
          }, 1500)
        }
        wx.requestPayment({
          timeStamp: $config['timeStamp'], //注意 timeStamp 的格式
          nonceStr: $config['nonceStr'],
          package: $config['package'],
          signType: $config['signType'],
          paySign: $config['paySign'], // 支付签名
          success: function (res) {
            // 支付成功后的回调函数
            wx.showToast({
              title: '开通成功!',
              duration: 1000,
              icon: 'success'
            })
              // 开通会员
            setTimeout(function () {
              wx.reLaunch({
                url: '/packageB/pages/livingHall/member_centre/index'
              })
            }, 1500)

          },
          fail: function (e) {
            console.log(e)
            wx.showToast({
              title: '支付失败！',
              duration: 1000,
              icon: 'none'
            })
            return;
          }
        });
      } else {
        wx.showToast({
          title: res.data.msg,
        })
      }
    }).catch( error=> {
      console.log(error);
      wx.hideLoading();
      wx.showToast({
        title: error.data.message,
        icon:'none'
      })
    })
  },
  //查看我的信息
  getmy_space(){
    let that = this;
    common.get('/life/index?op=my_space',{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        let space = res.data.data.space;
        that.setData({
          contact_name: space.name?space.name:'',
          contact_phone: space.mobile?space.mobile:'',
          garden: space.garden?space.garden:'',
          contact_area : space.address?space.address:'',
          v_back: space.background?space.background:'',
        })
      }else{

      }
    }).catch( e =>{
      console.log(e)
    })
  },
  //选取背景图片
  chooseBack: function() { 
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFiles = res.tempFiles;
        console.log(tempFiles[0]);
        // return;
        wx.showLoading({
          title:"上传图片中..."
        })
        wx.uploadFile({
          url: setting.apiUrl + '/file/uploadOss',
          filePath: tempFiles[0].path,
          name: 'files[]',
          header: {
            'content-type': 'multipart/form-data',
            'token': wx.getStorageSync('token')
          },
          success: function(res) {
            let data = JSON.parse(res.data);
            console.log(data);
            if ( data.code == 0 ) {
              wx.hideLoading();
              that.setData({
                v_back: data.data.url[0]
              })
            } else {
              app.showToast({
                title: "上传失败!",
              })
              wx.hideLoading()
            }
          },
          fail:function() {
            app.showToast({
              title: "上传失败!",
            })
            wx.hideLoading()
          },
          complete:function() {
            wx.hideLoading()
          }
        })
      }
    })
  },


})