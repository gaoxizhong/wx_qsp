const common = require("../../../assets/js/common");

// packageA/pages/points_gifts/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prizeList:[],
    i:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getprizeList();
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
    // chooseLibrary(e) {
    //   let that = this;
    //   let index = e.currentTarget.dataset.index;
    //   let prizeList = that.data.prizeList;
    //   let choseChange = "prizeList[" + index + "].checked";
    //   let prizeList_checked = prizeList[index].checked;
    //   if(prizeList_checked==true){
    //     that.setData({
    //       [choseChange]: ''
    //     })
    //   }else{
    //     that.setData({
    //       [choseChange]: true
    //     })
    //   }
    // },

    chooseLibrary(e) {
      let that = this;
      let index = e.currentTarget.dataset.index;
      let prizeList = that.data.prizeList;
      let number = 0;
      let choseChange = "prizeList[" + index + "].checked";
      let prizeList_checked = prizeList[index].checked;
      prizeList.forEach( ele =>{
        if(ele.checked == true){
          number++
        }
      })
      if(number >= 2){
        if(prizeList_checked==true){
          that.setData({
            [choseChange]: ''
          })
        }else{
          wx.showToast({
            title: '最多可选两个礼品兑换！',
            icon: 'none'
          })
          return
        }
      }else{
        if(prizeList_checked==true){
          that.setData({
            [choseChange]: ''
          })
        }else{
          that.setData({
            [choseChange]: true
          })
        }
      }
    },
    goto_myGift(){
      let that = this;
      let prizeList = that.data.prizeList;
      let number = 0;
      let gifts = []
      prizeList.forEach( ele =>{
        if(ele.checked == true){
          gifts.push(ele.id);
          number++
        }
      })
      console.log(gifts)
      if(number > 2){
        wx.showToast({
          title: '最多可选两个礼品兑换！',
          icon: 'none'
        })
        return
      }else{
        console.log('正确')
        common.post('/topic/gift',{
          member_id: wx.getStorageSync('member_id'),
          gifts
        }).then(res =>{
          if(res.data.code == 200){
            wx.showToast({
              title: '兑换成功！',
              icon: 'none'
            })
            setTimeout(()=>{
              wx.reLaunch({
                url: '/packageA/pages/myGift_pages/index',
              })
            },1500)
          }else{
            wx.showToast({
              title: res.data.data,
              icon:'none'
            })
          }
        }).catch(e =>{
          console.log(e)
        })

      }
    },
    goto_answer_parsing(){
      wx.navigateTo({
        url: '/packageA/pages/community_answer_parsing/index',
      })
    },
    getprizeList(){
      let that = this;
      common.get('/topic/index',{
        member_id: wx.getStorageSync('member_id')
      }).then(res =>{
        if(res.data.code == 200){
          that.setData({
            i: res.data.data.done.i,
            prizeList:res.data.data.gift
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