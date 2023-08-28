const common = require("../../../assets/js/common");
const publicMethod = require('../../../assets/js/publicMethod');
import { initData, initTime, timeStamp, currentTime } from '../../../utils/date'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disableText:'已结束',
    undisableText:'可预约',
    dateArr: [], //日期数据
    timeArr: [
      {schedule_start:"10:00",schedule_end:"12:00",schedule_start_t: "10:00-12:00",},
      {schedule_start:"12:00",schedule_end:"14:00",schedule_start_t: "12:00-14:00",},
      {schedule_start:"14:00",schedule_end:"16:00",schedule_start_t: "14:00-16:00",},
      {schedule_start:"16:00",schedule_end:"18:00",schedule_start_t: "16:00-18:00",},
    ], //时间数据
    nowDate: "", // 当前日期
    dateActive: 0, //选中的日期索引
    timeActive: 0, //选中的时间索引
    timeQuanBeginIndex: 0, //时间段开始的下标
    date:'', // 选中的时间不带年份
    selectDate: "", //选择的日期
    selectTime: "", //选择的时间
    timeQuanBegin: "", //时间段开始时间
    timeQuanEnd: "", //时间段结束时间
    is_fmy:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.is_fmy){
      this.setData({
        is_fmy: options.is_fmy
      })
    }

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
    let dateArr =  initData(); // 日期栏初始化
    this.setData({
      channel_index:0,
      dateArr,
    })
    this.selectDateEvent();
    // this.getprojectList();
  },
  // 日期选择事件
  selectDateEvent(e) {
    let that = this;
    let index = e ? e.currentTarget.dataset.index: 0 ;
    let timeArr = that.data.timeArr;  // 所选日期下的时间数据
    that.setData({
      nowDate: currentTime().ymdDate, // 当前系统时间
      dateActive: index,
      date: that.data.dateArr[index].date,
      selectDate: that.data.dateArr[index].allDate
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
      orderDateTime: `${this.data.selectDate} ${e.currentTarget.dataset.item.schedule_start_t}`,
      schedule_start: `${e.currentTarget.dataset.item.schedule_start}`,
      schedule_end: `${e.currentTarget.dataset.item.schedule_end}`

    })
  },


  initOnload(t){
    let that = this;
    let timeArr =  t; //时间选项初始化
    let isFullTime = true;
    timeArr.forEach((item,index) =>{
      //判断是当前这一天，选中时间小于当前时间则禁用
      item.disable = false;
      if (that.data.selectDate == that.data.nowDate && currentTime().time > item.schedule_start) {
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
        let orderDateTime = `${that.data.selectDate} ${that.data.timeArr[i].schedule_start_t}`;
        let schedule_start = `${that.data.timeArr[i].schedule_start}`;
        let schedule_end = `${that.data.timeArr[i].schedule_end}`;

        let timeActive = i;
        that.setData({
          orderDateTime,
          schedule_start,
          schedule_end,
          timeActive
        })

        return
      }
    }
    console.log(that.data.selectDate)
  },
  reserve_btn(){
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 2];
    if(this.data.is_fmy == '1'){
      currentPage.data.selectDeta = {
        order_date: this.data.selectDate,
        order_start_time: this.data.schedule_start,
        order_end_time: this.data.schedule_end,
      }
    }else{
      currentPage.data.selectDeta =( this.data.orderDateTime == "暂无选择"?'':this.data.orderDateTime);
    }
    wx.navigateBack();
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

  }
})