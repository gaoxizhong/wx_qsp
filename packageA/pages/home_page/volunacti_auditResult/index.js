const app = getApp()
const common = require('../../../../assets/js/common');
const setting = require('../../../../assets/js/setting');
let videoAd = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    auditResultList:[],
    vol_number:'',
    member_mobile:'',
    member_name: '',
    img:[],
    list:[],
    pageIndex: 1,
    pageSize: 15,
    hasMore: true,
    is_pop: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getauditResultList();

    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-f6ea451e26a50fda'
      })
      videoAd.onLoad(() => {
        console.log('onLoad event emit')
      })
      videoAd.onError((err) => {})
      videoAd.onClose((res) => {
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
        
          common.get('',{
            member_id: wx.getStorageSync('member_id'),
            
          }).then(res =>{
            if(res.data.code == 200){
              wx.showToast({
                title: '提交成功！',
              })
            }else{
              wx.showToast({
                title: res.data.msg,
                icon:'none',
              })
            }
          }).catch(e=>{
            console.log(e)
          })
        } else {
          // 播放中途退出，不下发游戏奖励
          wx.showToast({
            title: '中途退出，未加速',
            icon:'none'
          })
        }
      })
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      list:[],
      listData:[],
      pageIndex: 1,
      hasMore: true,
    })
    that.getauditResultList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    wx.showLoading({
      title: "加载中...",
      icon: 'none',
      mark: true,
    })
    setTimeout(function () {
      that.setData({
        pageIndex: (that.data.pageIndex + 1)
      })
      that.getlistData();
      wx.hideLoading()
    }, 1000)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  listBtn_img(e){
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/packageA/pages/home_page/volunacti_details/index?id=' + id + '&name='+ name,
    })
  },
  // 获取列表
  getauditResultList(){
    let that = this;
    common.get('/activity/my_record_list',{
      member_id: wx.getStorageSync('member_id'),
    }).then( res =>{
      if(res.data.code == 200){
        let data = res.data.data;
        data.forEach(el => {
          el.is_xg = false
        });
        let pageSize = that.data.pageSize; // 获取每页个数
        for(let i = 0; i < data.length; i += pageSize){
          // 分割数组，
          that.data.list.push(data.slice(i, i + pageSize))
        }
        that.setData({
          count: data.length,
        })
        that.getlistData();

      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch( e =>{
      console.log(e)
    })
  },
  getlistData(){ // 前端实现一次获取总数据后分页获取数据
    let that = this;
    if (!that.data.hasMore) {
      wx.showToast({
        title: '已加载全部数据',
        icon: 'none'
      })
      return
    }
    let page = (that.data.pageIndex - 1);
    let list = that.data.list;
    let count = that.data.count;// 获取数据的总数
    let flag = that.data.pageIndex * that.data.pageSize < count;
    that.setData({
      // 将新获取的数据拼接到之前的数组中
      auditResultList: that.data.auditResultList.concat(list[page]),
      hasMore: flag,
    })
  },
  getis_xg(e){
    let index = e.currentTarget.dataset.index;
    let auditResultList = this.data.auditResultList;
    auditResultList[index].is_xg = true;
    this.setData({
      auditResultList,
    })
  },
  savaData(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let auditResultList = that.data.auditResultList;
    let value = e.detail.value;
    if (!(/^1[345678]\d{9}$/.test(value.member_mobile)) ) {
      wx.showToast({
        title: '请输入正确的电话号码！',
        icon: 'none',
      })
      return
    }
    if ( value.vol_number.length > 15 || value.vol_number.length < 15 ) {
      wx.showToast({
        title: '请输入15位志愿编号！',
        icon: 'none',
      })
      return
    }
    that.record_update(auditResultList,index,value,that.activityExt);
  },
  record_update(al,i,vol_n,f){
    let that = this;
    let index = i;
    let auditResultList = al;
    let value = vol_n;
    common.post('/activity/record_update',{
      member_id: wx.getStorageSync('member_id'),
      vol_number: value.vol_number,
      record_id: auditResultList[index].record_id,
      record_image: auditResultList[index].record_image,
      member_name: value.member_name,
      member_mobile: value.member_mobile,
      member_address: auditResultList[index].member_address,
      member_garden: auditResultList[index].member_garden,
      member_school: auditResultList[index].member_school,
      record_remark: auditResultList[index].record_remark?auditResultList[index].record_remark:'',
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: '修改成功！',
          icon:'none'
        })
        setTimeout(function(){
          that.onLoad();
        },1000)
        if(typeof(f) == 'function'){
          return f(auditResultList,index,value);
        }
      }
    })
  },
  activityExt(al,i,vol_n){
    let that = this;
    let index = i;
    let auditResultList = al;
    let value = vol_n;
    let postmsg = {
      member_id: wx.getStorageSync('member_id'),
      vol_number: value.vol_number,
      member_name: value.member_name,
      member_mobile: value.member_mobile,
      member_address: auditResultList[index].member_address,
      member_garden: auditResultList[index].member_garden,
      member_school: auditResultList[index].member_school,
      ext_id : Number(auditResultList[index].ext_id),
    }
    common.post('/activity/ext', postmsg ).then(res =>{
      if(res.data.code == 200){
        let ele = res.data.data;
        wx.setStorageSync('selectedExt', ele);
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  //上传图片
  choosePic(e) { 
    let that = this;
    let index = e.currentTarget.dataset.index;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFiles = res.tempFiles;
        that.upLoadImg(tempFiles, 0,index);
        return;
      }
    })
  },
  //上传图片
  upLoadImg(image,index,list_i) {
    let that = this;
    let i = index;
    let img = image;
    let list_index = list_i;
    if ( i >= img.length ) {
      return
    }
    // debugger;
    let txt = '上传中'+(i+1)+'/'+img.length
    wx.showLoading({
      title:txt
    })
    wx.uploadFile({
      url: setting.apiUrl + '/file/uploadOss',
      filePath: img[i].path,
      name: 'files[]',
      header: {
        'content-type': 'multipart/form-data',
        'token': wx.getStorageSync('token')
      },
      success: function(res) {
        let data = JSON.parse(res.data);
        let auditResultList = that.data.auditResultList;
        console.log(data);
        if ( data.code == 0 ) {
          wx.hideLoading();
          auditResultList[list_index].record_image.push(data.data.url[0]);
          that.setData({
            auditResultList
          })
        } else {
          app.showToast({
            title: "上传失败!",
          })
        }
        wx.hideLoading();
        i++;
        that.upLoadImg(image, i);
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
  },
  // 点击加速审核---按钮
  speed_up(e){
    console.log(e)
    let item = e.currentTarget.dataset.item;
    wx.showModal({
      title:'加速审核',
      content:'可以提前加速一个工作日！每次加速需30积分或者观看30s激励广告',
      cancelText:'积分加速',
      confirmText:'广告加速',
      success(res){
        if(res.confirm){
          console.log('广告加速')
          // 用户触发广告后，显示激励视频广告
          if (videoAd) {
            videoAd.show().catch(() => {
              // 失败重试
              videoAd.load()
              .then(() => videoAd.show())
              .catch(err => {
                console.log('激励视频 广告显示失败')
                wx.showToast({
                  title: '激励视频 广告显示失败',
                  icon:'none'
                })
              })
            })
            
          }
        }
        if(res.cancel){
          console.log('积分加速')

        }
      }
    })

  },
  click_useinter(){
    let that = this;
    that.setData({
      is_pop:false
    })
  },
})