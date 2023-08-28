// component.js
const app = getApp();
Component({
  data: {
    from: 'component',
    recovery_place: {
      left: app.data.recovery_place.left,
      top: app.data.recovery_place.top
    },
    animateX: 10,
    animateY: 400,
    isShow : 0
  },
  behaviors: [require('behavior.js')],
  ready() {
    console.log('in component --> ', this.data.from)
    console.log(app.data.recovery_place);
  },
  pageLifetimes : {
    show : function() {
      this.setData({
        "recovery_place.top" : app.data.recovery_place.top,
        "recovery_place.left" : app.data.recovery_place.left
      })
    }
  },
  methods: {
    // 组件移动事件
    keepMove(e) {
      if ( (e.changedTouches[0].clientX - 32) < 0 ) {
        app.data.recovery_place.left = 0;
      } else if ( (e.changedTouches[0].clientX + 32) > app.data.windowWidth ) {
        app.data.recovery_place.left = app.data.windowWidth -64;
      } else {
        app.data.recovery_place.left = e.changedTouches[0].clientX -32;
      }
      if ( (e.changedTouches[0].clientY - 32) < 0 ) {
        app.data.recovery_place.top = 0;
      } else if ( (e.changedTouches[0].clientY + 32) > app.data.windowHeight ) {
        app.data.recovery_place.top = app.data.windowHeight -64;
      } else {
        app.data.recovery_place.top = e.changedTouches[0].clientY -32;
      }
      this.setData({
        "recovery_place.top" : app.data.recovery_place.top ,
        "recovery_place.left" : app.data.recovery_place.left
      })
    },
    //点赞动画
    myevent(x,y) {
      console.log("出现动画");
      console.log(x,y);
      this.setData({
        isShow : 1,
        animateX: x,
        animateY: y
      })
      setTimeout( () => {
        this.setData({
          isShow : 0
        })
      },600)
    }
  },
})