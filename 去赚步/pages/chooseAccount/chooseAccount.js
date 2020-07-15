// pages/chooseAccount/chooseAccount.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isChoosedAccount: false,
    accountListArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //账户信息列表
     wx.request({
       url: 'https://mabao.beijingjiaodian.com/wx/paymentSearch.html',
       data: { openid:wx.getStorageSync('openid')},
       method:"GET",
       success(reList){
        // console.log(reList)
         if (reList.data.code == 200){
            that.setData({
              accountListArray: reList.data.data
            })
          }
       }
     })
  },
  
  //点击选中某个账号
  choosedAccount(e){
    var id = e.currentTarget.id;
    var listArray = this.data.accountListArray;
    for (var index in listArray) {
      listArray[index].isChoosedAccount = false;
    }
    listArray[id].isChoosedAccount = true;
    this.setData({
      accountListArray: listArray
    })
    var currentJson = {};
    for (var inx in listArray){
      if (listArray[inx].isChoosedAccount == true){
        currentJson = listArray[inx];
      }
    } 
    wx.navigateTo({
      url: '../cash/cash?current=' + JSON.stringify(currentJson),
    }) 
  },
  //绑定支付宝
  bindingAlipay(){
    var that = this;
    if (that.data.accountListArray.length < 5){
      //console.log(that.data.accountListArray.length)
      wx.navigateTo({
        url: '../bindingAlipay/bindingAlipay',
      })
    }else{
      wx.showToast({
        title: "最多只能绑定5个账号",
        icon: 'none',
        duration: 1000
      })
      return false;
    }     
  }
})