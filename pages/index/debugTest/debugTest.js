/**
   * 用于现场调试药盒旋转，具体选择药仓编号即可开始该药仓旋转
   * 药仓编号：1、2、3、4、5
   * 选择按钮：1、2、3、4、5
   * 开始按钮：开始发送
   * 计时器：开始计算时间
   */
 const app=getApp();
 var client=app.globalData.client;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectNumber:null,//当前选择的数组编号
    numberList:{    //数组编号
      a:{
        number:"1"
      },
      b:{
        number:'2'
      },
      c:{
        number:"3"
      },
      d:{
        number:'4'
      },
      e:{
        number:"5"
      },
      nun:{
        number:'0'
      },
    }
  },


  selectRoom(e){   //选择药仓编号
    this.setData({
      selectNumber:e.currentTarget.id
    })
  },

  beginDebug(){   //开始往药盒publish
    var that=this;
    if(this.data.selectNumber==null){
      console.log("don't do this, please select a Nubmer")
    }
    else{
      console.log("starting debuging...");
      client.subscribe('start',function(err){
        if(!err){
          client.publish('start',that.data.selectNumber)
        }
      })
      }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
})