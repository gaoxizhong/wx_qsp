const common = require("../../../../assets/js/common");
const publicMethod = require('../../../../assets/js/publicMethod');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile:'',
    beusedList: [],
    is_member:'',
    isShowConfirm:false,
    num: 0,
    o_id: 0,
    card_id: 0,
    is_t: false,
    use_name: '',
    use_mobile: '',
    member_id: wx.getStorageSync('member_id'), // 当前用户id
    memid: '',// 目标用户id
    my_coin:0, // 可用余额
    num_coin:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      wx.showToast({
        title: '请先登录！',
        icon: 'none'
      })
      setTimeout( ()=>{
        wx.navigateTo({
          url: '/pages/login_mark/index',
        })
      },1500)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  clickQr(){
    this.setData({
      isShowConfirm: false
    })
  },
  /*验证手机号是否正确 */
  judge_linbarrnum(e){
    let that = this;
    console.log(e)
    let mobile = e.detail.value.mobile;
    if (mobile==''){
      app.showToast({
        title: "请输入对方手机号"
      })
    }else{
      wx.showLoading({
        title: '加载中...',
      })
      common.get('/life/index?op=check_card', {
        member_mobile: mobile,
        member_id: wx.getStorageSync('member_id'),
        // official_type:'1'
      }).then(res => {
        wx.hideLoading();
        if(res.data.code==200){
          let beusedList = res.data.data.list;
          if(beusedList.length > 0){
            let memid = beusedList[0].member_id;
            that.setData({
              memid
            })
            wx.showToast({
              title: '查询成功！',
              duration:2000
            })
            beusedList.forEach(ele => {
              ele.goodnum = 1
            });
            setTimeout(()=>{
              that.setData({
                // isShowConfirm: true,
                beusedList
              })
            },1500)
            if( wx.getStorageSync('member_id') == beusedList[0].member_id ){
              setTimeout( () =>{
                wx.reLaunch({
                  url: '/packageB/pages/livingHall/member_beused/index',
                })
              },1500)
            }
          }else{
            wx.showToast({
              title: '无会员信息，请核对后重新输入',
              icon:'none',
              duration:2000
            })
          }

        }else{
          wx.showToast({
            title: '无会员信息，请核对后重新输入',
            icon:'none'
          })
        }
      }).catch( e =>{
        console.log(e)
        wx.hideLoading();
        wx.showToast({
          title: '数据异常',
          icon:'none'
        })
      })
    }
  },
  inputValue(e){
    let that = this;
    let beusedList = that.data.beusedList;
    let index = e.currentTarget.dataset.index; // 订单id
    let num = Number(e.detail.value);
    let valid_num = Number(beusedList[index].card.valid_num);
    if( num > valid_num){
      wx.showToast({
        title: '不得超过待使用数！',
        icon:'none'
      })
      beusedList[index].goodnum = valid_num;
      that.setData({
        beusedList
      })
    }else{
      beusedList[index].goodnum = num;
      that.setData({
        beusedList
      })
    }

  },
  // 点击增加
  addNum(e) {
    let that = this;
    let beusedList = that.data.beusedList;
    let o_id = e.currentTarget.dataset.o_id; // 订单id
    beusedList.forEach(ele =>{
      if(ele.id == o_id){
        if( ele.goodnum >= ele.card.valid_num){
          wx.showToast({
            title: '不得超过待使用数！',
            icon:'none'
          })
        }else{
          ele.goodnum++ 
        }
      }
    })
    that.setData({
      beusedList
    })
  },
  // 点击减少
  minusNum(e) {
    let that = this;
    let beusedList = that.data.beusedList;
    let o_id = e.currentTarget.dataset.o_id; // 订单id
    beusedList.forEach(ele =>{
      if(ele.id == o_id){
        if( ele.goodnum >= ele.card.valid_num){
          wx.showToast({
            title: '不得超过待使用数！',
            icon:'none'
          })
        }else if(ele.goodnum <= 1 ){
          wx.showToast({
            title: '数量最少为1',
            duration: 1000,
            icon: 'none'
          })
        }else{
          ele.goodnum--
        }
      }
    })
    that.setData({
      beusedList
    })
  },

  //点击核销
  clickQx(e){
    let that = this;
    let beusedList = that.data.beusedList;
    let  card_id = e.currentTarget.dataset.c_id; // 会员卡id
    let  o_id = e.currentTarget.dataset.o_id; // 订单id
    let  m_id = e.currentTarget.dataset.m_id; // 会员卡用户id
    let member_id = wx.getStorageSync('member_id'); // 使用者用户id
    let num = 0;
    beusedList.forEach(ele =>{
      if(ele.id == card_id){
        num = ele.goodnum;
      }
    })
    that.setData({
      num,
      o_id,
      card_id,
    })
    if( member_id == m_id ){
      that.gettt();
    }else{
      that.setData({
        is_t: true,
      })
    }

  },
  userMember(e){
    let c_id = e.currentTarget.dataset.c_id;
    let type = e.currentTarget.dataset.type;

    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      c_id,
      c_name: type == '1'?'基础卡':'畅玩卡'
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  gettt(){
    let that = this;
    let num = that.data.num;
    let card_id = that.data.card_id;
    let o_id = that.data.o_id;
    let my_coin = that.data.my_coin; // 可兑换余额
    wx.showModal({
      title: '确认核销',
      content: '到店请工作人员当面核销！',
      success(res) {
        if (res.confirm) {
          common.get('/life/index?op=confirm_project_card',{
            member_id:wx.getStorageSync('member_id'),
            card_id,
            num,
            use_name: that.data.use_name,
            use_mobile: that.data.use_mobile,
            coin_value: my_coin
          }).then(res =>{
            if(res.data.code == 200){
              wx.showToast({
                title: '核销成功',
              })
              setTimeout(() => {
                let beusedList = that.data.beusedList;
                beusedList.forEach(ele =>{
                  if(ele.id == o_id){
                    ele.card.valid_num = ( Number(ele.card.valid_num) - Number(num) );
                    ele.goodnum = 1;
                  }
                })
                that.setData({
                  beusedList
                })
                // 获取可用余额
                that.getCodeSession();
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
        } else if (res.cancel) {
          console.log('点击了取消')
        }
      }
    })
  },
  judge_t(e){
    let that = this;
    let use_name = e.detail.value.use_name;
    let use_mobile = e.detail.value.use_mobile;
    if(!use_name || use_name == ''){
      wx.showToast({
        title: '请输入姓名',
        icon:'none'
      })
      return
    }
    if(!use_mobile || use_mobile == ''){
      wx.showToast({
        title: '请输入手机号',
        icon:'none'
      })
      return
    }
    that.setData({
      use_name,
      use_mobile,
      is_t: false
    })
    setTimeout(()=>{
      that.gettt();
    },500)

  },
  clickCover(){
    this.setData({
      is_t: false
    })
  },
    // 获取可用余额
    getCodeSession(){
      let that = this;
      common.get('/life/index?op=check_num', {
        member_id: that.data.memid,
      }).then(res => {
        if (res.data.code == 200) {
          that.setData({
            my_coin:res.data.data.my_coin, // 我的余额
          });
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }).catch(e => {
        app.showToast({
          title: "数据异常",
        })
        console.log(e)
      })
    },
  // 点击抵扣余额
  inputnumCoin(e){
    let that = this;
    let num = e.detail.value;
    if(num > 20 ){
      wx.showToast({
        title: '不得超过20元！',
        icon:'none'
      })
      that.setData({
        num_coin: 20
      })
    }else{
      that.setData({
        num_coin: e.detail.value
      })
    }
  },
})