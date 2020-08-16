  //进行服药计划的显示工作
var util = require('../../../utils/util.js');
var toolNumberArray=null;
Page({
  data: {
    logs: [],
    renderingArray:[],
    number:1
  },
  onLoad: function () {
    var numberArray=wx.getStorageSync('nmsl');//获得缓存中储存的数组元素
    toolNumberArray=numberArray;
    console.log(numberArray);
    var today=util.formatTime(new Date());  //获得今天的日期
    console.log(today,typeof(today));
    var that=this;
    var toolArray = new Array();                           //将渲染数组进行动态显示
    for(let i=0;i<8;i++) 
    {
      if (numberArray[i] =="Occupied")
      {
        var toolPlan=wx.getStorageSync((i+1).toString());
        var anotherPlan={name:"",endDate:"",number:null}     //渲染数组的对象
        anotherPlan.name=toolPlan.name;
        anotherPlan.endDate=toolPlan.dateArray[toolPlan.dateArray.length-1];
        anotherPlan.number=i+1;
        toolArray.push(anotherPlan);
        that.setData({
          renderingArray: toolArray             
        });
      }
  
    }
    


    //从远端获得
    /*this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }*/
  },

  onShow:function(){
    // var numberArray = wx.getStorageSync('nmsl');//获得缓存中储存的数组元素
    // toolNumberArray = numberArray;
    // console.log(numberArray);
    // var today = util.formatTime(new Date());  //获得今天的日期
    // console.log(today, typeof (today));
    // var that = this;
    // for (let i = 0; i < 12; i++) {
    //   if (numberArray[i] == "Occupied") {
    //     var toolPlan = wx.getStorageSync((i + 1).toString());
    //     console.log(toolPlan);
    //     var anotherPlan = { name: "", endDate: "", number: null }     //渲染数组的对象
    //     anotherPlan.name = toolPlan.name;
    //     anotherPlan.endDate = toolPlan.dateArray[toolPlan.dateArray.length - 1];
    //     anotherPlan.number = i + 1;

    //     toolArray.push(anotherPlan);
    //     console.log(toolArray);
    //     that.setData({
    //       renderingArray: toolArray
    //     });
    //   }
    //   console.log()
    


  },

  refresh:function(){       //刷新按钮
    this.onLoad();
  },


  navigateToCondition:function(){  //前往condition页面
  console.log("hahahaa")
    wx.navigateTo({
      url: "../conditions/conditions",
    })
  },


  createNewPlan:function(){
    for(let i=0;i<8;i++){
    if(toolNumberArray[i]==null){
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
      });
    break;
    }
    else{
      console.log("no!");    //这里进行弹窗警告
    }
    }
  },
  onPullDownRefresh(){ //采用下拉刷新的方式进行数据的刷新
    //wx.startPullDownRefresh();
    //可以在这里执行代码逻辑
    setTimeout(function(){wx.stopPullDownRefresh()},1000);
  },

  navigateToCondition:function()
  {
    wx.getStorage({
      key: 'key',
      success (res) {
        console.log(res.data)
      }
    });
   
  }
})
