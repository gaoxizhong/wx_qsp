// component/leave_com/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    leavecom_list:{
      type:Object,
      value:{}
    },
    title_text:{
      type:String,
      value:''
    },
    is_you:{ // 获取父级自定义属性值
      type:Boolean,
      value:false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  attached: function () {
    console.log('attached')
    // 获取组件标签上自定义data- 属性
    console.log(this.dataset)
    console.log(this.is_you)

    this.setData({
      title_text:this.dataset.title_text
    })

  },
  moved: function () {
    console.log('moved')
    console.log(this.is_you)


  },
  detached: function () {
    console.log('detached')
    console.log(this.is_you)


  },
  /**
   * 组件的方法列表
   */
  methods: {
    goTolist_detail(){
      this.triggerEvent('goTolist_detail');
    },
    release_btn(){
      this.triggerEvent('release_btn');
    }
  }
})
