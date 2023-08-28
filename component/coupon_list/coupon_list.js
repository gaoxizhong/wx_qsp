// component/coupon_list/coupon_list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    coupon_list:{
      type: Array,
      value:[]
    },
    select_index:{
      type:Number,
      value:0
    },
    is_mycoupon:{
      type:String,
      value:''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    is_mycoupon:''
  },
  attached: function () {
    console.log('attached')
    // 获取父组件标签上自定义data- 属性
    // console.log(this.dataset)
    this.setData({
      is_mycoupon:this.dataset.is_mycoupon
    })
  },
  moved: function () {

  },
  detached: function () {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    select_items(e){
      let select_index = e.currentTarget.dataset.index;
      this.triggerEvent('select_items',select_index);
    },
    goToActivity(e){
      let id = e.currentTarget.dataset.id;
      let order_number = e.currentTarget.dataset.order_number;
      let stock = e.currentTarget.dataset.stock;
      this.triggerEvent('goToActivity',{order_number,id,stock});
    }
  },

})
