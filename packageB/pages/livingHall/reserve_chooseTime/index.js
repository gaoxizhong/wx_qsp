const common = require("../../../../assets/js/common");
const publicMethod = require('../../../../assets/js/publicMethod');
import { initData, initTime, timeStamp, currentTime } from '../../../../utils/date.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disableText:'已结束',
    undisableText:'可预约',
    dateArr: [], //日期数据
    timeArr: [], //时间数据
    nowDate: "", // 当前日期
    dateActive: 0, //选中的日期索引
    timeActive: 0, //选中的时间索引
    timeQuanBeginIndex: 0, //时间段开始的下标
    selectDate: "", //选择的日期
    selectTime: "", //选择的时间
    timeQuanBegin: "", //时间段开始时间
    timeQuanEnd: "", //时间段结束时间
    goodnum: 1, // 预约人数
    name:'',
    tel:'', // 预约手机号
    mark:'', // 预约备注
    channelList:[], // 项目列表
    channel_sel:1,  // 所选项目id
    channel_index:0, // 选中的项目下标
    sel_schedule:[], // 所选项目下的日期
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    that.getprojectList();
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
  // 获取数据
  getprojectList(){
    let that = this;
    common.get('/life/index?op=project',{}).then(res =>{
      if(res.data.code == 200){
        let projectList = res.data.data.project;
        let sel_schedule = projectList[0].schedule; // 选中的项目下的日期
        let dateArr =  initData(); // 日期栏初始化
        that.setData({
          channel_index:0,
          dateArr,
          sel_schedule,
          projectList: res.data.data.project,
        })
        that.channel_sel();
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
  // 选择所属项目
  channel_sel(e){
    console.log(e)
    let that = this;
    let projectList = that.data.projectList;
    let channel_index = e ? e.currentTarget.dataset.index : 0;

    that.setData({
      channel_index, // 选中的项目下标
      channel_sel: e ? e.currentTarget.dataset.id : projectList[0].id, // 所选项目id
      sel_schedule : projectList[channel_index].schedule ? projectList[channel_index].schedule: projectList[0].schedule,// 所选项目下的日期
      dateActive: 0, //选中的日期索引
    })
    that.selectDateEvent();
  },
  // 日期选择事件
  selectDateEvent(e) {
    let that = this;
    let index = e ? e.currentTarget.dataset.index: 0 ;
    let sel_schedule = that.data.sel_schedule; // 所选项目下的日期数组
    let timeArr = sel_schedule[index].schedule_time;  // 所选项目下的 所选日期下的时间数据
    that.setData({
      nowDate: currentTime().date, // 当前系统时间
      dateActive: index,
      selectDate: that.data.dateArr[index].date
    })
    this.initOnload(timeArr);
  },
  // 时间选择事件
  selectTimeEvent(e) {
    console.log(e)
    if (e.currentTarget.dataset.item.disable) return
    this.setData({
      timeActive: e.currentTarget.dataset.index,
      selectTime: e.currentTarget.dataset.item.time,
      orderDateTime: `${e.currentTarget.dataset.item.schedule_start}`,
      schedule_start: `${e.currentTarget.dataset.item.schedule_start_i}`
    })
  },
  initOnload(t){
    let that = this;
    let timeArr =  t; //时间选项初始化
    let isFullTime = true;
    timeArr.forEach((item,index) =>{
      item.num = 20; // 每个时间段人数上限
      //判断是当前这一天，选中时间小于当前时间则禁用
      item.disable = false;
      if (that.data.selectDate == that.data.nowDate && currentTime().time > item.schedule_start_t) {
        item.disable = true
      }
      // 判断是否当前日期时间都被预约
      if (!item.disable) {
        isFullTime = false
      }
    })
    let orderDateTime = isFullTime ? "暂无选择" : that.data.selectDate;
    that.setData({
      orderDateTime,
      timeActive: -1,
      timeArr,
    })
    for (let i = 0, len = that.data.timeArr.length; i < len; i++) {
      if (!that.data.timeArr[i].disable) {
        let orderDateTime = `${that.data.timeArr[i].schedule_start}`;
        let schedule_start = `${that.data.timeArr[i].schedule_start_i}`;
        let timeActive = i;
        that.setData({
          orderDateTime,
          schedule_start,
          timeActive
        })
        return
      }
    }
  },
  // 预约人数填写
  inputValue(e){
    let goodnum = e.detail.value;
    if(goodnum > 20){
      wx.showToast({
        title: '单次最高限制20人！',
        icon:'none'
      })
      return
    }
    this.setData({
      goodnum: goodnum > 20 ? 20 : goodnum
    })
  },
  // 预约人数点击减号
  minusNum() {
    let that = this;
    that.data.goodnum --;
    if (that.data.goodnum < 1) {
      that.setData({
        goodnum: 1
      })
      wx.showToast({
        title: '最少1人！',
        duration: 1000,
        icon: 'none'
      })
    } else {
      that.setData({
        goodnum: that.data.goodnum
      })
    }
  },
  // 预约人数点击加号
  addNum() {
    let that = this;
    let goodnum = that.data.goodnum;
    goodnum ++;
    if(goodnum > 20){
      wx.showToast({
        title: '单次最高限制20人！',
        icon:'none'
      })
      return
    }
    that.setData({
      goodnum,
    })
  },
  // 预约姓名
  inputname(e){
    this.setData({
      name: e.detail.value
    })
  },
  // 预约电话
  inputTel(e){
    this.setData({
      tel: e.detail.value
    })
  },
  // 预约备注
  inputMark(e){
    this.setData({
      mark: e.detail.value
    })
  },
  // 点击预约按钮
  reserve_btn(){
    let that = this;
    let channel_sel = that.data.channel_sel; // 所选项目id
    let orderDateTime = that.data.orderDateTime; // 预约选择的时间
    let schedule_start = that.data.schedule_start; // 所选时间戳
    let name = that.data.name; //  姓名
    let goodnum = that.data.goodnum; // 人数
    let tel = that.data.tel; //  电话
    let mark = that.data.mark; // 备注
    if(!name || name == ''){
      wx.showToast({
        title: '请填写姓名！',
        icon:'none'
      })
      return
    }
    if(!tel || tel == ''){
      wx.showToast({
        title: '请填写姓名！',
        icon:'none'
      })
      return
    }
    let parmas = {
      member_id: wx.getStorageSync('member_id'),
      project_id: channel_sel,
      schedule_date: orderDateTime,
      schedule_start,
      number: goodnum,
      name,
      mobile: tel,
      remark: mark
    }
    wx.showLoading();
    common.get('/life/index?op=schedule',parmas).then(res =>{
      if(res.data.code == 200){
        setTimeout(() => {
          wx.hideLoading();
          wx.navigateTo({
            url: '/packageB/pages/livingHall/reserve_success/index',
          })
        }, 1500);
      }else{
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
    })


  }
})