const common = require("../../../../assets/js/common");
const publicMethod = require('../../../../assets/js/publicMethod');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mid:'', // 查看的那人的memberId
    member_id:'', // 登录的人的 member_id
    img:['https://oss.qingshanpai.com/huanbaobi/c68aaa27352931b4c34bafaa571d1649.jpeg'],
    currentTab: 1, // 1售卖 2展示
    pageIndex: 1,
    work_list:[],
    is_cler: false,
    del_id: '', // 删除功能 选中的id
    del_index: '', // 删除功能 选中下标
    like_status: true,
    savaStatus: true,
    textVal: '',
    inpPlaceholder: '发表留言...',
    com_id:'',  // 留言功能 选中的 id
    com_index:'',   // 留言功能 选中下标
    is_more:'',
    is_share: '1',  // 1、正常分享 2、从点赞分享页面进来 3、从付款页面进来
    v_back:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    that.setData({
      mid: options.mid,
      member_id: wx.getStorageSync('member_id'),
      is_more: options.is_more
    })
    if(options.is_share){
      that.setData({
        is_share: options.is_share
      })
    }
    this.imageerror();
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
    let that = this;
    that.setData({
      pageIndex: 1,
      work_list:[],
    })
    that.getData();
  },
  // 请求数据
  getData(){
    let that = this;
    let currentTab = that.data.currentTab;
    that.setData({
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
    })
    that.getworkList(currentTab);
    let mid = that.data.mid;
    that.getmy_space(mid);
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    let that = this
    var cur = e.currentTarget.dataset.current;
    that.setData({
      currentTab: cur,
      pageIndex: 1,
      work_list:[],
    })
    that.getworkList(cur);
  },
  //列表接口
  getworkList(sale) { 
    let that = this;
    let is_sale = sale;
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/life/index?op=work_list', {
      member_id: that.data.mid,
      page: that.data.pageIndex,
      is_sale,
    }).then(res => {
      wx.hideLoading();
      let work_list = that.data.work_list.concat(res.data.data.work_list);
      that.setData({
        work_list,
      })
    }).catch(e => {
      wx.hideLoading();
      console.log(e)
    })
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
    let that = this;
    let is_sale = that.data.currentTab;
    that.setData({
      pageIndex:(that.data.pageIndex + 1),
    })
    that.getworkList(is_sale);

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log(e)
    let that = this;
    let is_share = that.data.is_share;
    let textData = '';
    if(is_share == '1'){
      textData = '为手工作品点赞！喜欢可以买下来'
    }
    if(is_share == '2'){
      textData = '为手工作品点赞'
    }
    if(is_share == '3'){
      textData = '推荐购买手工作品'
    }
    if(e.from == 'button'){
      if(e.target.dataset.is_sharepage == '1'){  // 头部主页信息分享按钮
        return {
          title: textData,
          imageUrl: '',
          path: '/packageB/pages/livingHall/personal_home/index?mid=' + that.data.mid + '&is_sharepage=1',
          success: function(res) {
            // 转发成功
            console.log(res)
          },
          fail: function(res) {
            // 转发失败
            console.log(res)
          }
        }
      }else{
        let id = e.target.dataset.id;
        let bg_img = e.target.dataset.img;
        let shareTxt = e.target.dataset.title;
        that.getshareCount(id);
        return {
          title: that.data.currentTab == '2'?'为手工作品点赞':textData,
          path: '/packageB/pages/livingHall/goodsDetails/index?id=' + id + '&inv_member_id=' + wx.getStorageSync('member_id'),
          imageUrl: bg_img,
          success: function(res) {
            // 转发成功
            console.log(123)
          },
          fail: function(res) {
            // 转发失败
            console.log(321)

          }
        }
      }

    }
    return {
      title: '',
      imageUrl: '',
      path: 'packageB/pages/livingHall/personal_home/index?mid=' + that.data.mid + '&is_sharepage=1',
      success: function(res) {
        // 转发成功
        console.log(res)
      },
      fail: function(res) {
        // 转发失败
        console.log(res)
      }
    }
  },
  // 删除功能
  clickDelete(e){
    console.log(e);
    let that = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;

    that.setData({
      is_cler: true,
      del_id: id,
      del_index: index,
    })
  },
  // 点击删除弹窗 -- 取消按钮
  cler_marsk(){
    this.setData({
      is_cler:false,
      del_id: '',
      del_index: '',
    })
  },
  // 点击删除弹窗 -- 确定按钮
  submit_btn(){
    let that = this;
    let work_list = that.data.work_list;
    let del_id = that.data.del_id;
    let del_index = that.data.del_index;

    common.get('/life/index?op=delete_work',{
      member_id: that.data.mid,
      work_id: del_id
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: '删除成功！',
          icon:'none',
          duration: 1500
        })
        setTimeout(() => {
          work_list.splice(del_index, 1);
          that.setData({
            is_cler:false,
            work_list
          })
        }, 1000);
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  like(e){
    console.log(e)
    let that = this;
    let id = e.currentTarget.dataset.id;
    let ind = e.currentTarget.dataset.index;
    let like_status = that.data.like_status;
    if(!like_status){
      wx.showToast({
        title:'请勿频繁点击！',
        icon:'none'
      })
      return
    }
    that.setData({
      like_status: false
    })
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    common.get('/life/index?op=work_like', {
      member_id: wx.getStorageSync('member_id'),
      work_id: id,
    }).then( res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        wx.showToast({
          title: res.data.msg,
          icon:'none',
        })
        let work_list = that.data.work_list;
        work_list[ind].like_count = parseFloat(that.data.work_list[ind].like_count) + 1;
        work_list[ind].laud_status = 1;
        that.setData({
          like_status: true,
          work_list
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none',
        })
        that.setData({
          like_status: true,
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      that.setData({
        like_status: true
      })
      console.log(e)
    })
  },
  clickXg(){
    wx.navigateTo({
      url: '',
    })
  },
  // 跳转商品详情页
  gotogoodsdetails(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/packageB/pages/livingHall/goodsDetails/index?id=' + id,
    })
  },
  // 跳转修改信息
  gotomemberInfo(){
    wx.navigateTo({
      url: '/packageB/pages/livingHall/membership_add/index?is_xiu=1',
    })
  } ,
    //查看我的信息
  getmy_space(m_d){
    let that = this;
    common.get('/life/index?op=my_space',{
      member_id: m_d ? m_d : wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        let getmy_space = res.data.data;
        let space = res.data.data.space;
        that.setData({
          getmy_space,
          space,
        })
      }else{

      }
    }).catch( e =>{
      console.log(e)
    })
  },
  // 作品展品修改
  workBj(e){
    wx.navigateTo({
      url: '/packageB/pages/livingHall/create_work/index?discount_id='+ e.currentTarget.dataset.id,
    })
  },
    // 点击留言按钮
    clickcomment(e){
      let com_id = e.currentTarget.dataset.id;
      let com_index = e.currentTarget.dataset.index;
      this.setData({
        pop1: true,
        com_id,
        com_index
      })
    },
    bindTextChange(e) { //留言val
     let that = this;
      that.setData({
        textVal: e.detail.value
      })
    },
    sendComment(e) { //评论
      let that = this;
      let com_id = that.data.com_id;
      let com_index = that.data.com_index;
      let savaStatus = that.data.savaStatus;
      let hfStatus = that.data.hfStatus;
      if (!savaStatus) {
        return
      }
      if (that.data.textVal == '' || that.data.textVal == null) return;
      that.setData({
        savaStatus: false
      })
  
      let params = {
        member_id: wx.getStorageSync('member_id'), 
        work_id: com_id,  
        content: that.data.textVal,  //留言内容
      }
    //回复评论
      // if (hfStatus == 1) {
      //   params.replay_member_id = that.data.replay_member_id
      // }
  
      common.get('/life/index?op=work_comment', params).then(res => {
        that.setData({
          savaStatus: true
        })
        if (res.data.code == 200) {
          wx.showToast({
            title: '留言成功！',
          })
          that.setData({
            pop1: false,
            textVal: '',
            inpPlaceholder: '发表评论',
          })
          let work_list = that.data.work_list;
          work_list[com_index].comment_count = parseFloat(that.data.work_list[com_index].comment_count) + 1;
          that.setData({
            work_list
          })
        } else {
          console.log(res)
          wx.showToast({
            title: res.data.msg,
            icon:'none',
          })
        }
      }).catch(e => {
        that.setData({
          savaStatus: true
        })
        console.log(e)
      })
    },
    popLock(){
      this.setData({
        pop1: false
      })
    },
    // 提交分享次数接口
    getshareCount(i){
      let that = this;
      common.get('/life/index?op=work_share',{
        member_id:wx.getStorageSync('member_id'),
        work_id: i
      }).then( res =>{
      }).catch(e =>{
        console.log(e)
      })
    },
    imageerror(e){
      console.log(e)
      this.setData({
        v_back: 'https://oss.qingshanpai.com/banner/shopbg-error.png'
      })
    },
})