const app = getApp();
import mqtt from '../../../library/mqtt.js';
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    client:null,             //获取全局对象
    scroll:0,
    number:null,
    dateArray:[],
    name:null,
    condition:"无异常",
    todayDate:null,
    persent:"0",
    persent2:0,
    timer:[],
    toolArray:[],
    show:false,
    showLoading:true,
    showAll:false,
    showSaveHelp:false
  },
  

  goToSaveHelp:function()       //跳转至存药页面
  {
    var urlNumber="../../index/saveHelp/saveHelp?number="+this.data.number.toString();    //拼接url
    wx.redirectTo({
      url: urlNumber,
    }, success => {
      console.log('sucess')
    })
  },



  backToPlansIndex:function(){   //当点击模态窗口上的红×时跳转回planINdex页面
    wx.navigateTo({
      url: "../plansIndex/plansindex.js",
    })
  },



  detail:function(e){         //显示当天的服药时间
    console.log(e);
    var obj=this.data.toolArray;
    // console.log(obj)
    for(let i=0;i<obj.length;i++){
      if (obj[i].date == e.currentTarget.id)
      {
        this.setData({
          timer:obj[i].timer
        })
        break;
      }
    }
    if(this.data.timer.length==0){
      console.log("error");
    }
    else{
      console.log("success",this.data.timer)
    }
    this.setData({
      show:true
    })
  },


  hideModal:function(){           //隐藏服药时间模态窗口
    this.setData({
      show: false
    })
  },


  mqttConnet:function(e){       //进行mqtt的连接，此链接是获得当天的服药时间
    // var that = this;
    // that.data.client = app.globalData.client;
    // that.data.client.on('connect', e => {
    //   console.log("ok");
    //   that.data.client.subscribe('ask', function (err) {
    //     if (!err) {
    //       console.log("here")
    //       that.data.client.publish('ask', that.data.number.toString())
    //     }
    //   })
    // });
    // that.data.client.subscribe('ask'+that.data.number.toString(),function(err){
    //   if(!err){
    //     that.data.client.on('message',function(topic,message){
    //       var obj=JSON.parse(message);
    //       if(obj instanceof Array){
    //         //write somthing
    //         that.setData({
    //           toolArray:obj
    //         })
    //         // console.log(obj,that.data.toolArray);
    //       }
    //     })
    //   }
    // })
  },



  
  scrollSteps:function() {     //进行横向日期的更改
    var that=this;
    for (let i = 0; i < this.data.dateArray.length;i++)
    {
      var toolDate = this.date2(this.data.dateArray[i]);
      console.log(toolDate.year)
      if (toolDate.year <=this.data.todayDate.year && toolDate.month <= this.data.todayDate.month && toolDate.day <= this.data.todayDate.day){
        var str = parseInt(((i + 1) / this.data.dateArray.length) * 100);
        var str2 = str.toString() + "%"
        this.setData({                              //设置滚动的日期
          scroll: this.data.scroll + 1,
          persent2: str,
          persent: str2,
        })
      }
      else{
        break;                  //满足条件时跳出循环
      }
      toolDate=null;
    }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var toolPlan = wx.getStorageSync(options.number.toString());    //从缓存中获取药物数据
    if (!toolPlan.start){ //如果缓存中start值为假，则进行mqtt传输测试,这里是为了在机器上操作后没有在小程序上操作
      var that = this;
      that.data.client = app.globalData.client;
      // console.log(this.subscribeTopicConnect(toolPlan.name));
      that.data.client.subscribe(this.subscribeTopicConnect(toolPlan.name),function(err){if(!err){console.log('订阅成功')}})
      that.data.client.on('message',function(topic,message){//监听器只能获得字样，而不能判断是否有消息传送...
        console.log(message.toString())
        var exp=new RegExp('ok','g'); //设立正则表达式，匹配message中的ok字样
        if(exp.test(message.toString())) 
        {
          //若有存药，则将等待标志去除
          that.setData({
            showLoading:false,
            showAll:true
          })
          toolPlan.start=true;         //设定已经存药
          wx.setStorage({
            key:options.number.toString() ,
            data: toolPlan,
          });
        }
      });
      setTimeout(function(){
        if(!that.data.showAll)
        {
          that.setData({
          showLoading:false,
          showSaveHelp:true
          })
          // that.data.client.end();
        }
      },3000)
    }
    else{
      this.setData({
        showLoading: false,
        showAll: true
      })
    }

    var today = util.formatTime(new Date());  //获得今天的日期
    var toolTodayDate=this.date1(today);
   this.setData(                          //从plansIndex页面传过来的number
     {
       number:options.number,
       dateArray:toolPlan.dateArray,
       name:toolPlan.name,
       todayDate:toolTodayDate
     }
   );
    this.scrollSteps();
    this.mqttConnet();
  },



  subscribeTopicConnect:function(mName){                             //进行mqtt的topic的拼接
    return app.globalData.client_ID.toString()+'/plans/'+mName.toString()+'/save'
  },



  date1: function (today) {                                   //对设定的日期数组进行分离
    var todayDate = {
      year: null,
      month: null,
      day: null,
      hour: null,
      minute: null
    }
    todayDate.year = parseInt(today.substring(0, 4));
    todayDate.month = parseInt(today.substring(5, 7));
    todayDate.day = parseInt(today.substring(8, 10));    
    todayDate.hour = parseInt(today.substring(11, 13));
    todayDate.minute = parseInt(today.substring(14, 17));
    return todayDate;
  },



  date2: function (today) {             //获取当天日期进行
    var todayDate = {
      year: null,
      month: null,
      day: null,
      hour: null,
      minute: null
    }
    todayDate.year = parseInt(today.substring(0, 4));
    todayDate.month = parseInt(today.substring(5, 7));
    todayDate.day = parseInt(today.substring(7, 9));
    todayDate.hour = parseInt(today.substring(11, 13));
    todayDate.minute = parseInt(today.substring(14, 17));
    // console.log(todayDate);
    return todayDate;
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
    
  }
})

// function date(today){
//   var todayDate={
//     year:null,
//     month:null,
//     day:null,
//     hour:null,
//     minute:null
//   }
//    todayDate.year = parseInt(today.substring(0, 4));
//    todayDate.month= parseInt(today.substring(5, 7));
//    todayDate.day= parseInt(today.substring(8, 10));
//   todayDate.hour = parseInt(today.substring(12, 14));
//   todayDate.minute = parseInt(today.substring(15, 17));
//   return todayDate;
// }