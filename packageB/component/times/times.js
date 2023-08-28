import { initData, initTime, timeStamp, currentTime } from '../../../utils/date.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    disableText: { //禁用显示的文本
      type: String,
      default: "已约满"
    },
    undisableText: { //未禁用显示的文本
      type: String,
      default: "可预约"
    },
    beginTime: {
      type: String,
      default: "09:00:00"
    },
    endTime: {
      type: String,
      default: "21:00:00"
    },
    selectedTabColor: { // 日期栏选中的颜色
      type: String,
      default: "#ff6000"
    },
    selectedItemColor: { // 时间选中的颜色
      type: String,
      default: "#ff6000"
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    orderDateTime: '暂无选择', // 选中时间
    orderTimeArr: {}, //多选的时间
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
    tel:'', // 预约手机号
    mark:'', // 预约备注
    channelList:[ // 项目列表
      {id:1,name:'项目1'},
      {id:2,name:'项目2'},
      {id:3,name:'项目3'},
      {id:4,name:'项目4'},
      {id:5,name:'项目5'},
      {id:6,name:'项目6'},
      {id:7,name:'项目7'}
    ],
    channel_sel:0,
    channel:'', // 所选项目
  },
  attached(){
    this.setData({
      selectDate: currentTime().date,
      nowDate: currentTime().date,
    })
    this.initOnload();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initOnload(){
      let that = this;
      that.setData({
        dateArr: initData(), // 日期栏初始化
      })
      let timeArr =  initTime(that.data.beginTime, that.data.endTime) //时间选项初始化

      let isFullTime = true;

      timeArr.forEach((item,index) =>{
        //判断是当前这一天，选中时间小于当前时间则禁用
        if (that.data.selectDate == that.data.nowDate && currentTime().time > item.time) {
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
          let orderDateTime = `${that.data.selectDate} ${that.data.timeArr[i].time}`;
          let timeActive = i;
          that.setData({
            orderDateTime,
            timeActive
          })
          return
        }
      }
    },

    // 日期选择事件
    selectDateEvent(e) {
      this.setData({
        dateActive: e.currentTarget.dataset.index,
        selectDate: e.currentTarget.dataset.item.date
      })
      this.initOnload();
    },

    // 时间选择事件
    selectTimeEvent(e) {
      if (e.currentTarget.dataset.item.disable) return
      this.setData({
        timeActive: e.currentTarget.dataset.index,
        selectTime: e.currentTarget.dataset.item.time,
        orderDateTime: `${this.data.selectDate} ${e.currentTarget.dataset.item.time}`
      })
    },



    // 预约人数填写
    inputValue(e){
      this.setData({
        goodnum: e.detail.value
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
      that.data.goodnum ++;
      that.setData({
        goodnum: that.data.goodnum
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
      let orderDateTime = that.data.orderDateTime;
      let goodnum = that.data.goodnum;
      let tel = that.data.tel;
      let mark = that.data.mark;

      wx.navigateTo({
        url: '/packageB/pages/livingHall/reserve_success/index',
      })
    }

  },
    // 选择所属项目
    channel_sel(e){
      let that = this;
      let channelList = that.data.channelList;
      channelList.forEach(ele =>{
        if(ele.id == e.currentTarget.dataset.id){
          that.setData({
            channel: ele.name,
            channel_sel: e.currentTarget.dataset.id,
          })
        }
      })
    },
})
