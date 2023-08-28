const app = getApp()
const common = require('../../assets/js/common');
const QR = require('../../assets/js/qrcode')
const publicMethod = require('../../assets/js/publicMethod');
Page({
  data: {
    img_url: app.data.imgUrl,
    activityList: [],
    toBindActivityId: '',
    toBindActivityIndex: '',  //要绑定的活动，一次只允许绑定一个
    toDelActivityIndex: [],  //要删除的活动,
    toDelActivityId: [],
    manage_flag: 1,  //  1为绑定模式，2为下架模式
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
      userInfo: app.globalData.userInfo,
    })

    if ( options.business_id ) {
      that.setData({
        business_id: options.business_id
      })
    }
    console.log(options);
    that.getAllActivity();
  },
  onShow: function(){
    let member_id = wx.getStorageSync('member_id')

  },
  //获取所有的活动
  getAllActivity() {
    let that = this;
    common.get("/business/getBusinessDiscount", {
      business_id: that.data.business_id,
      discount_id: '',
    }).then( res => {
      if ( res.data.code == 200 ) {
        res.data.data.forEach( ele => {
          ele.checked = false;
          let obtain_type = JSON.parse(ele.obtain_type);
          console.log(obtain_type);
          if (obtain_type) {
            if (obtain_type.length == 2) {
              ele.obtain_type = '到店自提，付费邮寄'
            } else {
              obtain_type[0] == '1' ? ele.obtain_type = '到店自提' : ele.obtain_type = '付费邮寄'
            }
          }
        })
        that.setData({
          activityList: res.data.data
        })
      }
    })
  },
  //绑定活动
  bindActivity() {
    let that = this;
    if ( that.data.manage_flag == 1 ) {
      let url = "/pages/publish/publish?business_id=" + that.data.business_id + "&discount_id=" + that.data.toBindActivityId;
      let findItem = that.data.activityList.find( ele => {
        return ele.id == that.data.toBindActivityId
      })
      wx.setStorageSync("discount_id",that.data.toBindActivityId);
      wx.setStorageSync("discount_title",findItem.title);
      if (findItem.stand == 2){
        wx.showToast({
          icon: 'none',
          title: '活动已下架不可选取!'
        })
        return;
      }
      wx.navigateBack({
        delta: 1
      })
    } else if ( that.data.manage_flag == 2 ) {
      common.post("/business/administerDiscount", {
        business_id: that.data.business_id,
        discount_id: that.data.toDelActivityId
      }).then( res => {
        if ( res.data.code == 200 ) {
          wx.showToast({
            icon: 'success',
            duration: 1000,
            title: res.data.msg
          })
          that.getAllActivity();
        }
      })
    }
  },
  edit(e){
    var that = this
    var discount_id = e.currentTarget.dataset.discountid
    wx.navigateTo({
      url: '/pages/create_activity/create_activity?discount_id=' + discount_id + '&business_id=' + that.data.business_id,
    })
  },
  //选择活动
  checkboxChange(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id
    console.log(index)
    if ( that.data.manage_flag == 2 ) {
      //删除模式
      let hasfind = that.data.toDelActivityIndex.findIndex( ele => {
        return ele == index
      })
      if ( hasfind == -1 ) {
        that.data.toDelActivityId.push(id);
        that.data.toDelActivityIndex.push(index);
        that.data.activityList[index].checked = true;
        that.setData({
          toDelActivityId: that.data.toDelActivityId,
          toDelActivityIndex: that.data.toDelActivityIndex,
          activityList: that.data.activityList
        })
      } else {
        that.data.toDelActivityIndex.splice(hasfind,1);
        that.data.toDelActivityId.splice(hasfind,1);
        that.data.activityList[index].checked = false;
        that.setData({
          toDelActivityId: that.data.toDelActivityId,          
          toDelActivityIndex: that.data.toDelActivityIndex,
          activityList: that.data.activityList
        })
      }
      
    } else if ( that.data.manage_flag == 1 ) {
      //绑定模式
      if ( that.data.toBindActivityIndex === '' ) {
        that.data.activityList[index].checked = true;
        that.setData({
          toBindActivityIndex: index,
          toBindActivityId: id,
          activityList: that.data.activityList
        })
      } else {
        if ( index == that.data.toBindActivityIndex ) {
        that.data.activityList[that.data.toBindActivityIndex].checked = false;
          that.setData({
            toBindActivityId: '',
            toBindActivityIndex: '',
            activityList: that.data.activityList          
          })
        } else {
          that.data.activityList[that.data.toBindActivityIndex].checked = false;
          that.data.activityList[index].checked = true;
          that.setData({
            toBindActivityId: id,
            toBindActivityIndex: index,
            activityList: that.data.activityList          
          })
        }

      }
    }
  },
  //上下架活动
  stand(e){
    let that = this
    let stand = e.currentTarget.dataset.stand
    let discountid = e.currentTarget.dataset.discountid
    let index      = e.currentTarget.dataset.index
    let activityList = that.data.activityList
    let stand_text = stand == 1 ? '上架' : '下架'
    wx.showModal({
      content: '确定进行' + stand_text,
      success:function(res){
          if(res.confirm){
            common.post("/business/setBusinessDiscountStand", {
              business_id: that.data.business_id,
              discount_id: discountid,
              stand: stand
            }).then(res => {
              if (res.data.code == 200) {
                wx.showToast({
                  icon: 'success',
                  duration: 1000,
                  title: stand_text + '成功'
                })
                activityList[index]['stand'] = stand
                that.setData({
                  activityList: activityList
                })
              }else{
                wx.showToast({
                  icon: 'fail',
                  duration: 1000,
                  title: stand_text + '失败'
                })
              }
            })
          }
      }
    })
  },
  //进入退出管理模式
  manage() {
    let that = this;
    if ( that.data.manage_flag == 1 ) {
      that.data.activityList.forEach( ele => {
        ele.checked = false;
      })
      that.setData({
        manage_flag: 2,
        toBindActivityId: '',
        toBindActivityIndex: '',
        activityList: that.data.activityList
      })
    } else if ( that.data.manage_flag == 2 ) {
      that.data.activityList.forEach( ele => {
        ele.checked = false;
      })
      that.setData({
        manage_flag: 1,
        toDelActivityId: [],
        toDelActivityIndex: [],
        activityList: that.data.activityList
      })
    }
  }
})