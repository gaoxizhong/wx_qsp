const common = require("../../../../assets/js/common");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageType: 1, 
    itemsList:[
      {comment:'社区大集',function_name:'带上闲置来赶集',tag:'sqdj',icon:'https://oss.qingshanpai.com/qhy/icon-qhy-sqdj.png',url:'/packageB/pages/qhyRally/countyActivity/index',status:'1'},
      {comment:'社区图书馆',function_name:'以书换书 积分换书',icon:'https://oss.qingshanpai.com/qhy/icon-qhy-zhhb.png',url:'/packageA/pages/library/index?is_comtype=qhysq',status:'1'},
      {comment:'志愿风采',function_name:'辖区居民 活动风采',icon:'https://oss.qingshanpai.com/qhy/icon-qhy-gxkj.png',url:'/packageB/pages/qhyRally/article/index',status:'1'},
      {comment:'低碳生活+拉分打卡',subtitle:'默默分类 给生活积分',icon:'https://oss.qingshanpai.com/qhy/icon-qhy-ljfldk.png',url:'/packageB/pages/signTaskList/index?is_comtype=qhysq',status:'1'},
      {comment:'旧衣回收-免费上门',function_name:'环保低碳 让温暖循环',icon:'https://oss.qingshanpai.com/qhy/icon-qhy-jyhs.png',url:'/packageA/pages/recyclePlate/recyclePlateClothes/index?is_comtype=qhysq',status:'1'},
      {comment:'纸壳贝儿-上门回收',function_name:'足不出户 让资源变现',icon:'https://oss.qingshanpai.com/qhy/icon-qhy-smhs.png',url:'/packageB/pages/qhyRally/smhs/index?is_comtype=qhysq',status:'1'},
      {comment:'周边福利',function_name:'附近每天有优惠',icon:'https://oss.qingshanpai.com/qhy/icon-qhy-zb.png',url:'/packageB/pages/qhyRally/djShop/index?is_comtype=qhysq',status:'1'},
      {comment:'桶前值守',function_name:'我是志愿者先锋',icon:'https://oss.qingshanpai.com/qhy/icon-qhy-tqzs.png',url:'/packageA/pages/site_clock/index?is_comtype=qhysq',status:'1'},
      {comment:'我的环保积分',function_name:'环境卫士的荣耀',icon:'https://oss.qingshanpai.com/qhy/icon-qhy-wdhbjf.png',url:'/packageB/pages/qhyRally/myJf/index?is_comtype=qhysq',status:'1'},
    ],
    market: {},
    communityInfo:{},
    id:'',  // 获取社区id
    dmList: [], // 弹幕数组
    beList:[],// 初始 弹幕数组
    size:0, // 四分之一数值
    setInter:'',
    is_put: false,  //  持续推广弹窗
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      Object.assign(this.options, this.getScene(options.scene)) // 获取二维码参数，绑定在当前this.options对象上
    }
    console.log(this.options) // 这时候就会发现this.options上就会有对应的参数了
    this.setData({
      id: this.options.id
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
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      wx.showToast({
        title: '请先登录！',
        icon:'none'
      })
      setTimeout(function(){
        wx.navigateTo({
          url: '/pages/login_mark/index',
        })
      },2000)
      return
    }
    // that.getCommunityInfo(that.getPalist);
    that.getCommunityInfo();
    that.getDmList(that,that.setDM);
    that.setData({
      setInter: setInterval(() => {
        that.setData({
          dmList: [], // 弹幕数组
          beList:[],// 初始 弹幕数组
        })
        that.getDmList(that,that.setDM);
      }, 305000)
    })
  },
  // 获取弹幕数据
  getDmList(t,f){
    let that = t;
    common.get('/activity/chat',{}).then(res =>{
      if(res.data.code == 200){
        that.setData({
          beList: res.data.data.chat
        })
        if (typeof f == "function") {
          return f()
        }
      }
    }).catch(e=>{
      console.log(e)
    })
  },

  // 处理弹幕位置
  setDM() {
    let that = this;
    // 处理弹幕参数
    const dmArr = [];
    const _b = that.data.beList; // 接口数据
    //  无序弹幕
    for (let i = 0; i < _b.length; i++) {
      const time = Math.floor(Math.random() * 20);
      const time1 = Math.floor(Math.random() * 6);
      const _time = time < 6 ? 6 + time1 : time;
      // const top = Math.floor(Math.random() * 180) + 10;
      const topArr = [6,24,42,74,98,121,144,168,198,223,256,282,314,348,364,402,421,458,481,502];
      const topIndex = parseInt(Math.random() * 20);
      const top = topArr[topIndex];
      const color = that.randomColor();
      const _p = {
        avater: _b[i].avater,
        content: _b[i].content,
        member_id: _b[i].member_id,
        color,
        top,
        time: _time,
      };
      dmArr.push(_p);
    }
    that.setData({
      dmList: dmArr
    });

    // 有序弹幕
    // for (let i = 0; i < _b.length; i++) {
    //   const color = that.randomColor();
    //   const _p = {
    //     avater: _b[i].avater,
    //     content: _b[i].content,
    //     member_id: _b[i].member_id,
    //     color,
    //   };
    //   dmArr.push(_p);
    // }
    // const size = Math.floor(dmArr.length/4);
    // that.setData({
    //   dmList: dmArr,
    //   size,
    // });
  },
  // 随机弹幕颜色
  randomColor(){
    let red = Math.floor(Math.random() * 255);
    let green = Math.floor(Math.random() * 255);
    let blue = Math.floor(Math.random() * 255);
    return `rgb(${red}, ${green}, ${blue})`
  },



  
  getCommunityInfo(f){
    let that = this;
    common.get('/community_market/community_info',{
      community_info_id: that.data.id
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          communityInfo: res.data.data,
        })
        wx.setNavigationBarTitle({
          title: res.data.data.community_name
        })
        if( typeof f == 'function' ){
          return f();
        }
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
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload')
    clearInterval(this.data.setInter);
    this.setData({
			setInter: null
		})
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
  /**调用电话 */
  tel(e) {
    let tel = e.currentTarget.dataset.mobile;
    if (tel != null || tel != '') {
      wx.makePhoneCall({
        phoneNumber: tel,
      })
    } else {
      wx.showToast({
        title: "暂无联系电话",
        icon:'none'
      })
    }
  },
    // 获取选项列表
    getPalist(){
      let that = this;
      common.get('/community/community_function',{}).then(res =>{
        if(res.data.code == 200){
          let pa_list = res.data.data;
          let interested_function_id = that.data.communityInfo.interested_function_id;
          let arr = interested_function_id.split('-');
          let  newarr = [];
          arr.forEach( ele =>{
            pa_list.filter(function(element,index,obj){
              if(element.id == ele){
                newarr.push(element)
              } 
            })
          })
          that.setData({
            itemsList: newarr,
          })
        }else{
          that.toast.showToast({
            msg: res.data.msg,
            duration: 1500
          });
        }
      }).catch(e =>{
        console.log(e)
      })
    },




  // 点击社区大集
  goTosqdj(e){
    let m = this.data.communityInfo.community_market[0];
    let marketInfo = JSON.stringify(m);
    let url = e.currentTarget.dataset.url + '?marketInfo=' + marketInfo;
    wx.navigateTo({
      url,
    })
  },
  clickItems(e){
    console.log(e)
    let is_tab = e.currentTarget.dataset.is_tab;
    let status = e.currentTarget.dataset.status;
    let url = e.currentTarget.dataset.url;
    let title = e.currentTarget.dataset.title;
    if( status == '2'){
      wx.navigateToMiniProgram({
        appId: 'wx933705429f95c67b',
        path: 'field/index/index',
        envVersion: 'release',
        // extraData: { // 传参
        //   foo: 'bar'
        // },
        success(res) {
          // 打开成功
        }
      })
      return
    }
    if(title == '社区图书馆'){
      url = url + '&library_id=' + this.data.communityInfo.library_id
    }else{
      let m = this.data.communityInfo.community_market[0];
      let marketInfo = JSON.stringify(m);
      url = url+ '&marketInfo=' + marketInfo;
    }
    wx.navigateTo({
      url,
    })
  },
    /**
* 获取小程序二维码参数
* @param {String} scene 需要转换的参数字符串
*/
getScene: function (scene = "") {
  if (scene == "") return {}
  let res = {}
  let params = decodeURIComponent(scene).split("&")
  params.forEach(item => {
    let pram = item.split("=")
    res[pram[0]] = pram[1]
  })
  return res
},
})