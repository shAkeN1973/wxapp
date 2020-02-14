/*creatPlans.js*/

const app = getApp()
import mqtt from '../../../library/mqtt.js';

var number=null;
var temp=null;
var numberTime=null;
var tempTime=null;
var upLoadArray=new Array();
var full=true;


var plans= {
  name: "",   //药物名称
  date: "",  //开始服药日期
  timer:[],  //设定的时间数组
  lengthOfTime: null,    //服药时间长度
  frenquency: null,      //一天吃几次
  drugsInOneDay:null,     //一次吃多少
  afterOrBefore: null,   //饭前饭后吃
  interval:null,      //服药间隔天数（若每天都吃则为null)
  };


var upLoadPlans={   //上传数组
  name:"",          //药物名称，可用于校验
  number:null,      //对应的药盒编号
  timer:[],        //每天的服药时间段
  drugsInOneDay:null,   //每天吃多少
  dateArray:[],        //日期数组，可能不会要但是得写上
  afterOrBefore:null   //饭前吃还是饭后吃
};

Page({
  data: {
    client:null,
    test:"",
    isSubmit:false,
    N:{},
    index:null,
    indexTime:null,                                //默认数组的当前下标名
    picker:["1","2","3","4","5","6","7","8"],  //选择有多少种药物
    howMany:"0",
    date1:"2019-07-01",
    array:[],
    timeChanger:[],
    numberArray:[]
  },

  PickerChange(e) {
    //console.log(e);
    this.setData({
      indexTime: e.detail.value,                    //一天以内吃几次的数量（frequency)
    });
    var size =parseInt(this.data.indexTime); 
    numberTime=size;                          
    tempTime=0;                                            
    var arr=new Array();
    for(var i=0;i<size;i++)
    {
      arr.push({"symbolTime":"symbolTime"+i.toString(),time:"12:00"});
    }
    this.setData({
      array: arr,
    }); 
    arr=null;
  },

  TimeChange(e){
    var time= e.detail.value;
    if (number > -1) {
      plans.timer.push(time);
      var toolArray = this.data.array;
      //console.log(plans);
      toolArray[tempTime].time = time;
      this.setData(
        {
          array: toolArray
        }
      );
      toolArray = null;
      tempTime++;
    }
    else {
      wx.showToast({
        title: 'error',
        //icon: 'loading',
        duration: 2000
      })
    }
  },

DateChange(e) {     //将显示的日期改变
    var date=e.detail.value;
    plans.date=date;
      this.setData(
        {
          date1:date
        })
  },

/*表单提交函数*/
Submit: function(e)
{
  if(e.currentTarget.id=='drugName'){
  var name=e.detail.value;
  //console.log(e);
  if(name==plans.name&&name==null)
  {
    wx.showToast({
      title: 'error',
      duration: 2000
    })
  }
  else{
    this.getStorageSlef();
    plans.name=name;
    }
  
  }
  else if (e.currentTarget.id =='lengthOfTime')
  {
    var lengthOfTime = e.detail.value;
   // console.log(e);
    if (lengthOfTime == null) {
      wx.showToast({
        title: 'error',
        icon: "none",
        duration: 2000
      })
    }
    else
      plans.lengthOfTime = lengthOfTime;
  }
  else if (e.currentTarget.id == 'drugInOneDay') {
    var drugInOneDay = e.detail.value;
   // console.log(e);
    if (drugInOneDay == null) {
      wx.showToast({
        title: 'error',
        icon: "none",
        duration: 2000
      })
    }
    else {
      plans.drugsInOneDay = drugInOneDay;
    }
  }
  else if (e.currentTarget.id == 'interval') {
    var interval = e.detail.value;
   // console.log(e);
    if (interval == null) {
      wx.showToast({
        title: 'error',
        icon: "none",
        duration: 2000
      })
    }
    else {
      plans.interval = interval;
      console.log(plans);
    }
  }
  },

getStorageSlef:function(){         //只有在输入药物名称的时候才可以进行下一步操作
  var that = this
  wx.getStorage({
    key: 'nmsl',
    success(res) {
      console.log(res.data)
      for (let i = 0; i < 12; i++) {
        if (res.data[i] == null) {
          upLoadPlans.number = i + 1;           //设置药盒编号
          res.data[i] = "Occupied"
          try {
            wx.setStorage({
              key: "nmsl",
              data: res.data,
            });
          }
          catch (e) {
            console.log(e);
          }
          break;
        }
      }
    }
  })
},


dateCaculator(plans,upLoadPlans)   //计算日期数组
{
  var year=parseInt(plans.date.substring(0,4));
  var month=parseInt(plans.date.substring(5,7));
  var day=parseInt(plans.date.substring(8,10));
  var dateMax=null;
  if(month==2)
{
    if(year%4==0&&year%100!=0)
        dateMax=29;
    else
        dateMax=20;
}
else if(month>6&&month%2==0||month<7&&month%2!==0)
{
    dateMax=31;
}
else{
    dateMax=30;
}
console.log(plans.interval);
for(var i=0;i<plans.lengthOfTime;i++)
{
    var string=new String();
    string=year.toString()+"-"+month.toString()+"-"+day.toString();
    upLoadPlans.dateArray.push(string);
   day = day + 1;
  if (day >= dateMax) {
    day = day % dateMax;
    month++;
  }
    console.log(string);
    string=null;
}
},


upLoad(upLoadPlans){
  var newJson = JSON.stringify(upLoadPlans); //数组转json字符串
    var that = this;
    that.data.client = app.globalData.client;
    that.data.client.on('connect', e => {
      console.log("ok");
      that.data.client.subscribe('presence', function (err) {
        if (!err) {
          that.data.client.publish('presence', newJson)
        }
      })
    });
    that.data.client.on('message', function (topic, message) {
      console.log(message.toString());
      that.data.client.end();
  })
 
},



refresh(plans){     //plans 按值传递
    var toolplans= {
      name: "",
      date: "",
      lengthOfTime: null,
      frenquency: null,
      afterOrBefore: null,
      };
      toolplans.name=plans.name;
      toolplans.date=plans.date;
      toolplans.lengthOfTime=plans.lengthOfTime;
      toolplans.frenquency=plans.frenquency;
      toolplans.afterOrBefore=plans.afterOrBefore;
      return toolplans;
  },
  /*
  plans.name=e.detail.value;
  //console.log(plans);
  this.setData({
    //test:abc,
    isSubmit:true
  });
 /*
  if (this.data.isSubmit){
    const eventChannel=this.getOpenerEventChannel();//注意这里必须新声明一个新的eventChannel
    eventChannel.emit('acceptDataFromHidePlanPage', { data: this.data.test });
   }*/

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //var N=this.getOpenerEventChannel()
    
    const eventChannel = this.getOpenerEventChannel()
    //console.log(eventChannel);  
    eventChannel.emit('acceptDataFromCreatePlanPage', {data: 'get The information'});
    /*
    var that=this
    wx.getStorage({
      key: 'nmsl',
      success(res) {
        console.log(res.data)
        for (let i = 0; i < 12; i++) {
          if (res.data[i] == null) {
            upLoadPlans.number = i + 1;           //设置药盒编号
            res.data[i] ="Occupied"
            try{
            wx.setStorage({
              key: "nmsl",
              data: res.data,
            });}
            catch(e)
            {
              console.log(e);
            }
            break;
          }
        }
      }
    })*/
  },

  SM: function () {
    upLoadPlans.name=plans.name;
    upLoadPlans.drugsInOneDay=plans.drugsInOneDay;
    upLoadPlans.afterOrBefore=plans.afterOrBefore;
    upLoadPlans.timer=plans.timer;
    this.dateCaculator(plans,upLoadPlans);
    console.log(upLoadPlans);
    wx.setStorage({
        key: upLoadPlans.number.toString(),
        data: upLoadPlans,
      });
    this.upLoad(upLoadPlans);
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
   if(this.data.isSubmit)
   {
     
      // console.log("Unload方法被调用");
       //console.log("下面是Data中的数据")
     const newEventChannel = this.getOpenerEventChannel();//注意这里必须新声明一个新的eventChannel
     newEventChannel.emit('acceptDataFromHidePlanPage', { data: this.data.test });
     
   }
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