const app = getApp()
const common = require('../../../../assets/js/common');
const setting = require('../../../../assets/js/setting');
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
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getauditResultList();
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
})