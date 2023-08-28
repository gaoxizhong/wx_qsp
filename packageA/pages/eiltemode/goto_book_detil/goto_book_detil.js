const app = getApp();
const common = require('../../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    id:'',
    library_id:'',
    book_info:{},
    stock:'',
    is_height:true,
    title:'',
    isfenxiang:0,
    canIUseGetUserProfile: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
      that.setData({
        id:options.id,
        library_id:options.library_id,
      })
      let member_id = wx.getStorageSync('member_id');
      that.setData({
        member_id: wx.getStorageSync('member_id')
      })
    // 登录
    wx.login({
      success: function (data) {
        console.log(data)
        that.setData({
          loginData: data
        })
      }
    })
    if(this.options.isfenxiang == 1){
      that.setData({
        isfenxiang:this.options.isfenxiang,
        parent_member_id:this.options.member_id
      })
      if (!member_id) {
        that.setData({
          pop2: true
        })
      } else {
        that.setData({
          member_id: member_id,
          pop2: false
        })
        that.addIntegral();
      }
    }

},
 
  /**
   * 生命周期函数--监听页面初次渲染完成
  **/

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    console.log('触发了onshow')

    that.setData({
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
      personalInfo: wx.getStorageSync('personalInfo'),
    })
    that.getData();
  },
getData(){
  let that = this;
  that.get_book_detail();
},


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(res)
    let that = this
    let id = that.data.id;
    let library_id = that.data.library_id;
    let book_info = that.data.book_info;
    let imageUrl = that.data.book_info.images_medium;
    if (res.from === 'button') {
      return {
        title: '好友送你一次免费领书的机会，还包邮到家哦！',
        imageUrl: imageUrl,
        path: '/packageA/pages/eiltemode/goto_book_detil/goto_book_detil?library_id=' + library_id + '&id=' + id + '&isfenxiang=1',
        success: function (res) {
          that.setData({
            showModel: false
          })
        }
      }
    }
    return {
      title: book_info.book_name,
      imageUrl: imageUrl,
      path: '/packageA/pages/eiltemode/goto_book_detil/goto_book_detil?library_id=' + library_id + '&id=' + id,
      success: function (res) {
        that.setData({
          showModel: false
        })
      }
    }
  },
  /**蒙板禁止滚动  bug 在开发工具模拟器底层页面上依然可以滚动，手机上不滚动*/
  myCatchTouch() {
    return
  },
// 获取图书详情信息
get_book_detail(){
  let that = this;
  let id = that.data.id;
  let library_id = that.data.library_id;
  let member_id = that.data.member_id;
  common.get('/newhome/category_books_detail',{
    id,
    library_id,
    member_id
  }).then(res =>{
    if(res.data.code ==200){
      let title= res.data.data.book_name;
      that.setData({
          book_info:res.data.data,
          stock:res.data.data.stock,
          title,
      })
      console.log(that.data.book_info)
    }
  }).catch(e =>{
    console.log(e)
  })
},





// 立即购买
subimt_buy(e) {
    let that = this;
    let book_info = that.data.book_info;

  console.log(book_info);
  wx.login({
    success: function (data) {
      that.setData({
        loginData: data
      })
    }
  })
  let member_id = wx.getStorageSync('member_id')
  if (!member_id) {
    that.setData({
      pop2: true
    })
    return;
  }
    book_info.num = 1;
    let new_book_info = {'book_info':[book_info]};
    let number = 1;
    let pay_money =( book_info.integral_price - 0).toFixed(2);
    wx.setStorageSync('book_info1', new_book_info);
    wx.navigateTo({
      url: '/packageA/pages/eiltemode/memberorder/index?pay_money=' + pay_money + '&number=' + number,
    })
},
see_quanbu(){
  let is_height = this.data.is_height;
  this.setData({
    is_height:!is_height
  })
},
  cancelLogin() {
    console.log('取消授权')
    this.setData({
      pop2: false
    })
    // wx.reLaunch({
    //   url:'/pages/mine/index/index'
    // })
    console.log('取消授权完成')

  },
  getUserProfile(){
    let that = this;
    wx.login({
      success: (data) => {
        console.log(data)
        that.setData({
          code: data.code,
        })
      }
    })
    wx.getUserProfile({
      desc: '获取你的昵称、头像、地区及性别', 
      success: (res) => {
        console.log(res)
        wx.setStorageSync('user_info', res.userInfo);
        that.setData({
          personData: res.userInfo
        })
        common.post('/member/oauth', {
          code: that.data.code,
          encryptedData: res.encryptedData,
          iv: res.iv,
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName,
          gender: res.userInfo.gender,
        }).then(res => {
          console.log(res)
          if (res.data.code == 200) {
            that.setData({
              member_id: res.data.member_id,
              pop2: false
            })
            console.log("授权成功")
            wx.showTabBar()
            wx.setStorageSync('member_id', res.data.member_id);
            if(res.data.api_token){
              wx.setStorageSync('token', res.data.api_token);
            }
            if (that.data.isfenxiang == 1) {
              that.addIntegral();
            } else {
              that.subimt_buy();
            }
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }).catch(e => {
          app.showToast({
            title: "数据异常",
          })
          console.log(e)
        })
        
      }
    })

  },

  // 前往购物车列表页
  goToAcrt(){
    let that = this;
    let url = '/packageA/pages/library/myCart/index?member_id=' + that.data.member_id;
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      wx.showModal({
        title: '登录后才可查看！',
        content: '是否跳转我的页面',
        confirmColor: '#ff1111',
        success: function (res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/mine/index/index'
            })
          }
        }
      })
      return
    }else{
      wx.navigateTo({
        url: url,
      })
    }
  },
  // 点击添加到购物车
  add_ShopCart(e){
    console.log(e)
    let that = this;
    let list_index = e.currentTarget.dataset.index;
    let library_name = e.currentTarget.dataset.library_name;
    let book_id = e.currentTarget.dataset.book_id;
    let stock = e.currentTarget.dataset.stock;
    let name = e.currentTarget.dataset.name;
    let integral_price = e.currentTarget.dataset.integral_price;
    let images_medium = e.currentTarget.dataset.images_medium;
    let member_id = wx.getStorageSync('member_id');

    if (!member_id) {
      wx.showModal({
        title: '登录后才可添加！',
        content: '是否跳转我的页面',
        confirmColor:'#ff1111',
        success:function(res){
          if (res.confirm){
            wx.reLaunch({
              url:'/pages/mine/index/index'
            })
          }
        }
      })
      return
    }else{

      common.get('/library/EditCar',{
        member_id: wx.getStorageSync('member_id'),
        library_id: that.data.library_id,
        library_name,
        book_name: name,
        book_id,
        integral_price,
        images_medium,
        type:'add'
      }).then(res => {
        console.log(res)
        if (res.data.code == 202) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          return
        }
        if(res.data.code == 200){
          wx.showToast({
            title: '添加购物车成功！',
            icon: 'none',
            success: function () {
              let cart_number = that.data.cart_number - 0
              that.setData({
                cart_number: cart_number += 1
              })
            }
          })
        }else if(res.data.code == 201){
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }

      })

    }

  },
  /**
 * 进入图书馆首页 
 */
  goToindex(){
    let that = this;
    let url = "/packageA/pages/eiltemode/class_bookslist/index?library_id=" + that.data.library_id
    wx.navigateTo({
      url: url
    })
  },
  //增加积分
  addIntegral: function(){
    let that = this
    common.get("/newhome/jingrui_integral", {
      member_id: that.data.member_id,
      parent_member_id: that.data.parent_member_id,
    }).then(res => {
      if (res.data.code == 200) {

      } else{
        wx.showToast({
          title: res.data.msg,
          duration: 1000,
          icon: 'none'
        })
      }
    })
  },
})