/*creatPlans.js*/
var number=null;
var temp=null;
var upLoadArray=new Array();
var plans= {
  name: "",
  date: "",
  lengthOfTime: null,
  frenquency: null,
  drugInOneDay:null,
  afterOrBefore: null,
  }

Page({
  data: {
    test:"",
    isSubmit:false,
    N:{},
    index:null,                                //默认数组的当前下标名
    picker:["1","2","3","4","5","6","7","8"],  //选择有多少种药物
    howMany:"0",
    date1:"2019-07-01",
    date2: "2019-07-01",
    array:[],
  },

  PickerChange(e) {
    this.setData({
      index: e.detail.value,
    });
    var size =parseInt(this.data.index);  //index为字符串，parseInt将其转化为数值
    number=size;                        //设立哨兵
    temp=0;                          
    var arr=new Array();
    for(var i=0;i<size+1;i++)
    {
      arr.push({"symbol":"symbol"+i.toString(),date:"2019-01-01"});
    }
    this.setData({
      array: arr,
    }); 
  },


DateChange(e) {
    var date=e.detail.value;
    if(number>-1)
    {
      plans.date=date;
      var toolArray=new Array();
      toolArray=this.data.array;
      toolArray[temp].date=date;
      //upLoadArray[temp].date=date;
      this.setData(
        {
          array:toolArray
        }
      );
      
    //this.upLoad(plans);
      toolArray=null;
    }
    else{
      wx.showToast({
        title: 'error',
        //icon: 'loading',
        duration: 2000
      })
    }
  },

/*表单提交函数*/
Submit: function(e)
{
  if(e.currentTarget.id=='drugName'){
  var name=e.detail.value;
  console.log(e);
  if(name==plans.name&&name==null)
  {
    wx.showToast({
      title: 'error',
      duration: 2000
    })
  }
  else
    plans.name=name;
  }
  else if (e.currentTarget.id =='drugDays')
  {
    var lengthOfTime = e.detail.value;
    console.log(e);
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
  else if (e.currentTarget.id == 'frenquency') {
    var frenquency = e.detail.value;
    console.log(e);
    if (frenquency == null) {
      wx.showToast({
        title: 'error',
        icon: "none",
        duration: 2000
      })
    }
    else{
      plans.frenquency = frenquency;
}
  }
  else if (e.currentTarget.id == 'drugInOneDay') {
    var drugInOneDay = e.detail.value;
    console.log(e);
    if (drugInOneDay == null) {
      wx.showToast({
        title: 'error',
        icon: "none",
        duration: 2000
      })
    }
    else {
      plans.drugInOneDay = drugInOneDay;
      this.upLoad(plans);
    }
  }
  
    
  },


upLoad(plans){
  if(number>-1&&plans.name!=null&&plans.date!=null)
  {
    upLoadArray.push(this.refresh(plans));
    number--; 
    temp++;
    console.log(upLoadArray);
  }
  else{
    wx.showToast({
      title: 'error',
      icon: 'none',
      duration: 2000
    })
  }
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
  },

  SM: function () {
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