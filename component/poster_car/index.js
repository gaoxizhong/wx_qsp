Component({
  behaviors: [],
  properties: {
    rate: {
      type: String,
      value: '0'
    },
    is_poster:{ // 获取父级自定义属性值
      type:Boolean,
      value:false
    },
    poster_tabs:{
      type:Array,
      value:[]
    },
    swiper_index:{
      type:Number,
      value:0
    },
  },
  data: {
    swiper_index:0,
    dongtai_id:1
  },

  attached: function () {
    console.log('attached')
    // console.log(this.dataset.swiper_index)
    // this.setData({
    //   swiper_index:this.dataset.swiper_index
    // })
    // this.getStarArr()
  },
  moved: function () {
    console.log('moved')

  },
  detached: function () {
    console.log('detached')

  },

  methods: {
    // getStarArr: function () {
      
    // },
    // 点击弹窗周围隐藏弹窗
    show_is_poster(){
      console.log(this.data.is_poster)
      let is_poster = !this.data.is_poster;
      this.setData({
        is_poster,
      })
      console.log(is_poster)
      // 'show_poster' 是page页面里子组件标签自定义的方法
      // this.triggerEvent('show_poster',is_poster);
    },
    // 选择点击事件，选中样式
    // select_swiper(e){
    //   //获取选择的id
    //   let dongtai_id = e.currentTarget.dataset.id;
    //   this.setData({
    //     dongtai_id,
    //   })
    //   this.triggerEvent('select_swiper',dongtai_id);
    // },
    // 阻止冒泡
    innerTap(){
     return
    },
    moveServerProSwiper(e){
      this.setData({
        swiper_index:e.detail.current,
      })
    },
    que_btn(){
      let swiper_index = this.data.swiper_index;
      let dongtai_id = Number(swiper_index) + 1;
      let is_poster = !this.data.is_poster;
      this.triggerEvent('que_btn',{dongtai_id,is_poster});
    }
  }
})
