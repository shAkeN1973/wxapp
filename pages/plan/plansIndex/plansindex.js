  //进行服药计划的显示工作
Page({
  data: {
    logs: [],
  },
  onLoad: function () {//从远端获得
    /*this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }*/
  },
  createNewPlan:function(){
    console.log("progress maked here");
      wx.navigateTo({
      url: "../createPlans/createPlans",  //跳转到创建服药计划页面进行数据通信
      events: {
        acceptDataFromCreatePlanPage: function(data) {  //添加一个监听器，获取从打开页面传来的数据
          //console.log(data)
        },
        acceptDataFromHidePlanPage: function (data) {  //添加一个监听器，获取从打开页面传来的数据
          //console.log(data)
        }
      },
      success: function(res) {
        console.log("接口调用成功");
        // 通过eventChannel向被打开页面传送数据,此代码用于将本页面的数据传送给至将要打开的页面
        //res.eventChannel.emit('acceptDataFromCreatePlanPage', { data: 'test' }) 
      }
      }
    )
  },
  onPullDownRefresh(){ //采用下拉刷新的方式进行数据的刷新
    //wx.startPullDownRefresh();
    //可以在这里执行代码逻辑
    setTimeout(function(){wx.stopPullDownRefresh()},1000);
  },

  navigateToCondition:function()
  {
    wx.navigateTo({
      url: "../conditions/conditions",
    })
  }
})
