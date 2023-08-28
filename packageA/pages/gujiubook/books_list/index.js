const app = getApp()
const common = require('../../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnTop: 400,
    btnLeft: 300,
    book_info:[],
    bookinfolen:false,
    truue:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id'),
    })
    /**
      *  获取系统信息
    */
   wx.getSystemInfo({
    success: res => {
      console.log(res)
      let windowHeight = res.windowHeight;
      let windowWidth = res.windowWidth;
      let btnTop = windowHeight - 134;
      this.setData({
        windowHeight,
        windowWidth,
        btnLeft: windowWidth - 65,
        btnTop
        })
      }
    })
    that. getShangjia();
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
    this.getShopByCate();

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
getShopByCate() {
  let that = this;
  wx.showLoading({
    title: '加载中...',
  })
  common.get('/newhome/old_book', {}).then( res => {
    if ( res.data.code == 200 ) {
      wx.hideLoading();
      let book_info = res.data.data;
      if(res.data.data.length <= 0){
        that.setData({
          bookinfolen:true
        })
      }
      that.setData({
        book_info,
      })
    } else if ( res.data.code == 206 ) {
      wx.hideLoading();
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 1000
      })
    }else{
      wx.hideLoading();
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 1000
      })
    }
  }).catch( error => {
    console.log(error);
  })
},

  
  // 按钮开始移动
  buttonStart(e) {
    // 获取起始点
    this.setData({
      startPoint: e.touches[0]
    })
  },

  // 按钮移动中
  buttonMove(e) {
    let {
      startPoint,
      btnTop,
      btnLeft,
      windowWidth,
      windowHeight,
      isIpx
    } = this.data
    // 获取结束点
    let endPoint = e.touches[e.touches.length - 1]
    // 计算移动距离相差
    let translateX = endPoint.clientX - startPoint.clientX
    let translateY = endPoint.clientY - startPoint.clientY
    // 初始化
    startPoint = endPoint
    // 赋值
    btnTop = btnTop + translateY
    btnLeft = btnLeft + translateX

    // 临界值判断
    if (btnLeft + 45 >= windowWidth) {
      btnLeft = windowWidth - 45;
    }
    if (btnLeft <= 0) {
      btnLeft = 0;
    }
    // 根据屏幕匹配临界值
    let topSpace = 100
    if (isIpx) {
      topSpace = 134
    } else {
      topSpace = 100
    }
    if (btnTop + topSpace >= windowHeight) {
      btnTop = windowHeight - topSpace
    }
    // 顶部tab临界值
    if (btnTop <= 43) {
      btnTop = 43
    }
    this.setData({
      btnTop,
      btnLeft,
      startPoint
    })
  },

  //选择图书馆
  chooseLibrary(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let book_info = that.data.book_info;
    let choseChange = "book_info[" + index + "].checked";
    let book_info_checked = book_info[index].checked;
    console.log(book_info_checked)
    if(book_info_checked==true){
      that.setData({
        [choseChange]: ''
      })
    }else{
      that.setData({
        [choseChange]: true
      })
    }

  },

// 前往购物车列表页
goToAcrt(){
  let that = this;
  let member_id = wx.getStorageSync('member_id');
  let book_info = that.data.book_info;
  let new_book_info = [];
  let pay_money = 0;
  let number = 0;
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
    book_info.forEach(ele =>{
      if(ele.checked == true){
        new_book_info.push(ele);
        pay_money += (ele.discount_price - 0);
        number = new_book_info.length;
      }
    })
    new_book_info.forEach( ele =>{
      ele.num = 1;
    })
    console.log(new_book_info)
    let new_book_info1 = {'book_info': new_book_info};
    wx.setStorageSync('book_info3', new_book_info1);
    if(new_book_info.length == 0){
      wx.showToast({
        title: '请先选择图书...',
        icon:'none'
      })
      return
    }
    wx.navigateTo({
      url: '/packageA/pages/gujiubook/memberorder/index?pay_money=' + pay_money.toFixed(2) + '&number=' + number,
    })
  }
},
  //获取可上架人员
  getShangjia() {
    let that = this;
    common.get('/newhome/members_code', {}).then( res => {
      if ( res.data.code == 200 ) {
        let member_id = that.data.member_id;
        let true_memberid = res.data.data.member_id;
        let truue = true_memberid.find(ele =>{
          console.log(ele)
          return ele == member_id
        })
        if(truue){
          that.setData({
            truue:true
          })
        }
      }
    })
  },
  // 前往图书详情
goTobookdetail(e) {
  console.log(e)
  let  id = e.currentTarget.dataset.id;
  wx.navigateTo({
    url:"/packageA/pages/gujiubook/goto_book_detil/goto_book_detil?id=" + id,
  })
},
myshangjia(){
  wx.navigateTo({
    url: '/packageA/pages/gujiubook/putshelf/index',
  })
},
//  修改
chooseLibrary1(e){
  console.log(e)
  let that = this;
  let id = e.currentTarget.dataset.id;
  wx.navigateTo({
    url: '/packageA/pages/gujiubook/putshelf/index?id=' + id ,
  })
},
// 删除
chooseLibrary2(e){
  console.log(e)
  let that = this;
  let id = e.currentTarget.dataset.id;
  let index = e.currentTarget.dataset.index;
  let book_info = that.data.book_info;
  common.get('/newhome/delete_old_book',{
    id,
  }).then( res => {
    if(res.data.code == 200){
      wx.showToast({
        title: '删除成功！',
        icon:'none',
        duration:2000,
        success:function(){
          book_info.splice(index, 1);
          that.setData({
            book_info,
          })
        }
      })
      
    }
  })

  
}
})