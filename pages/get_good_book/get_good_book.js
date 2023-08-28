const app = getApp();
const common = require('../../assets/js/common');
const publicMethod = require('../../assets/js/publicMethod');
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataStatus:false,
    savaStatus: true,
    book_listaa:[],
    btnTop: 400,
    btnLeft: 300,
    windowHeight: '',
    windowWidth: '',
    car_num:0,
    is_car:'/images/acrt.png',
    is_car_1: '/images/acrt-1.png',
    hasMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let member_id = wx.getStorageSync('member_id');

    console.log(this.options)
        if(this.options.books_id){
          this.setData({
            books_id:this.options.books_id,
          })
        }
    this.setData({
      member_id
    })

    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        let btnTop = windowHeight - 134;
        this.setData({
          windowHeight,
          windowWidth,
          btnLeft: windowWidth - 75,
          btnTop
        })
      },
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
    this.setData({
    book_listaa:[],
    })
    this.get_good_book_list();
  },

  searclick(){
    let search_info = this.data.search_info;
    this.search(search_info);
  },

// 点击添加到购物车
  add_ShopCart(e){
    console.log(e)
    let that = this;
    let library_id = e.currentTarget.dataset.library_id;
    let library_name= e.currentTarget.dataset.library_name;
    let book_list = that.data.book_listaa;
    let list_index = e.currentTarget.dataset.index;
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
        library_id,
        library_name,
        book_name: name,
        book_id,
        integral_price,
        images_medium,
        type:'add',
        form: 'all',
      }).then(res => {
        console.log(res)
        if(res.data.code == 200){
          wx.showToast({
            title: '添加购物车成功！',
            icon: 'none',
            success: function () {
              let car_num = that.data.car_num - 0
              book_list[list_index].is_car = true // 1.改变当前图书的选中状态
              that.setData({
                book_listaa: book_list,  // 2.重新更新图书列表
                car_num: car_num += 1
              })
            }
          })
        }else {
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }

      })

    }

  },
  // 前往购物车列表页
  goToAcrt(){
    let that = this;
    let url = '/packageA/pages/library/myCart/index?member_id=' + that.data.member_id;
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      wx.showModal({
        title: '登录后才可跳转！',
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
  onPullDownRefresh() { 

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
book_cost(e){
  let search_info2 = e.detail.value;
  let tem = 0;
  tem =  tem + (search_info2 * 1);
  let tot = tem.toFixed(2);
  this.setData({
    search_info2,
    get_integral:tot
  })
},

// 禁止穿透滚动
myCatchTouch(){
  return
},

  logintest(e) {
    console.log('校验是否登录');
    let member_id = wx.getStorageSync('member_id')
    if (!member_id) {
      console.log('未授权用户')
      wx.showModal({
        title: '预约送书，请先登录！',
        success: function (res) {
          if (res.confirm) {
            console.log('点击了确认');
            wx.reLaunch({
              url: '/pages/mine/index/index'
            })
          } else if (res.cancel) {
            console.log('点击了取消')
          }
        }
      })
      // return;
    }
  },

   get_good_book_list(){
        let that = this;
        let books_id =that.data.books_id;
        common.get('/service/get_good_book_detail',{
        member_id:wx.getStorageSync('member_id'),
          books_id,
        }).then(res =>{
          if(res.data.code == 200){

      that.setData({
              book_listaa:res.data.data.book_info,
              car_num:res.data.data.car_num
            })
           
          }else{
            setTimeout(function () {
              that.setData({
                dataStatus: true
              })
            }, 500)
            return
          }
          if (that.data.book_listaa.length <= 0) {
            console.log(1)
            setTimeout(function () {
              that.setData({
                dataStatus: true
              })
            }, 500)
          }
        })
      },

    
})