//cash.js  提取现金

Page({
  data: {
    isHasAccount:true,
    inputVals:2,
    balanceAll:0,
    accountName:'',
    accountNum:'',
    accountId:''
  },
  onLoad(options) {
    this.setData({ balanceAll: wx.getStorageSync('balance') });
    if (options.current){
      this.setData({
        isHasAccount: false,
        accountName: JSON.parse(options.current).name,
        accountNum: JSON.parse(options.current).account_number,
        accountId: JSON.parse(options.current).id
      })
    }
    //console.log(options)
  },
  //添加收款账户
  addCollectionAccount(){
    wx.navigateTo({
      url: '../chooseAccount/chooseAccount',
    })
  },
  //改变提现额度
  cashNum(e){
    this.setData({ inputVals: e.detail.value })
  },
  //全部提现
  balanceAll(){
    this.setData({ inputVals: this.data.balanceAll})
  },
  //提现
  cashMoney(){
    var that = this;
    var inputVals = that.data.inputVals * 100;
    if (inputVals == ''){
      wx.showToast({
        title: "输入金额不能为空",
        icon: 'none',
        duration: 1000
      })
      return  false;
    }
    var accountId = that.data.accountId;
    if (accountId == '') {
      wx.showToast({
        title: "请选择账户",
        icon: 'none',
        duration: 1000
      })
      return false;
    }    
    wx.request({
      url: 'https://mabao.beijingjiaodian.com/wx/applicationForCash.html',
      data:{
        sign:"xcx_zhuan",
        openid:wx.getStorageSync('openid'),
        mid:'9',
        payid: accountId,
        amount: inputVals
      },
      method:'GET',
      success(resCash){
        console.log(resCash)
        console.log(that.data.inputVals)
        if (resCash.data.code==200){
          wx.showToast({
            title: resCash.data.msg,
            icon: 'none',
            duration: 1000
          })
          //返回赚步列表
          wx.switchTab({
            url: '../logs/logs',
          })
        }
      }
    })
  }
})