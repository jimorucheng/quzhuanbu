// pages/bindingAlipay/bindingAlipay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     getName:'',
     getAccount:'',
     getPhone:'',
     getYzm:'',
    yzmTitle:'获取验证码',
    isDisabled:false
  },
  //获取用户的真实姓名
  getName(e){
    this.setData({getName: e.detail.value})
    //console.log(e.detail.value)
  },
  //获取用户的真实账号
  getAccount(e) {
    this.setData({ getAccount: e.detail.value })
    //console.log(e.detail.value)
  },
  //获取用户的手机号码
  getPhone(e) {
    this.setData({ getPhone: e.detail.value })
    //console.log(e.detail.value)
  },
  //获取验证码
  getYzm(e) {
    this.setData({ getYzm: e.detail.value })
    //console.log(e.detail.value)
  },
  //获取验证码
  getYzmBtn(){
    var that = this;
    //得到手机号
    var phoneNum = this.data.getPhone;
    if (phoneNum == ''){
       wx.showToast({
         title: '请输入手机号!',
         icon:'none',
         duration:1000
       })
       return false;
    }
    if (!(/^1[3456789]\d{9}$/.test(phoneNum))){
      wx.showToast({
        title: '手机号码有误!',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    //发送验证码
    wx.request({
      url: 'https://mabao.beijingjiaodian.com/api/sendSms.html',
      data: { uphone: phoneNum, sign:'xcx_zhuan'},
      method:"POST",
      success(resPhone){
        console.log(resPhone)
        if (resPhone.data.code == 200){
          that.sendMsg();
          wx.showToast({
            title: resPhone.data.msg,
            icon: 'none',
            duration: 1000
          })         
        }else{
          wx.showToast({
            title: resPhone.data.msg,
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  //倒计时
  sendMsg(){
    var times = 60;
    var that = this;
    var timer = null;
    clearInterval(timer);
    timer = setInterval(function(){
      times--;
      if(times<=0){
        that.setData({ yzmTitle: '重新获取' ,isDisabled:false});
        clearInterval(timer);
        times = 0;
      }else{
        that.setData({ yzmTitle: times+'秒后重试',isDisabled:true });
      }
    },1000);
  },
  //绑定成功
  bingAlipaySuccess(){
     //得到真实姓名
    var getName1 = this.data.getName;
     //得到真实账户
    var getAccount1 = this.data.getAccount;
     //得到手机号码
    var getPhone1 = this.data.getPhone;
     //得到验证码
    var getYzm1 = this.data.getYzm;
    //判断姓名
    if(getName1 == ''){
      wx.showToast({
        title: '真实姓名不能为空!',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (!(/^[\u4E00-\u9FA5]{2,8}$/).test(getName1)) {
      wx.showToast({
        title: '姓名格式输入错误!',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    //判断账户  不能为空即可
    if (getAccount1 == '') {
      wx.showToast({
        title: '账号不能为空!',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    //判断手机号
    if (getPhone1 == '') {
      wx.showToast({
        title: '请输入手机号!',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (!(/^1[3456789]\d{9}$/.test(getPhone1))) {
      wx.showToast({
        title: '手机号码有误!',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    //判断验证码
    if (getYzm1 == '') {
      wx.showToast({
        title: '验证码不能为空!',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (!(/^\d{4}$/.test(getYzm1))) {
      wx.showToast({
        title: '验证码格式有误!',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    //绑定支付宝
    wx.request({
      url: 'https://mabao.beijingjiaodian.com/wx/paymentAdd.html',
      data:{
        uphone: getPhone1,
        type:'1',
        account_number: getAccount1,
        name: getName1,
        msgnum: getYzm1,
        sign:'xcx_zhuan',
        openid:wx.getStorageSync('openid')
      },
      method:'GET',
      success(resApliy){
        //console.log(resApliy)
        if (resApliy.data.code == 200){
          wx.showToast({
            title: '绑定成功!',
            icon: 'none',
            duration: 1000
          })
          wx.navigateTo({
            url: '../chooseAccount/chooseAccount',
          })
        }else{
          wx.showToast({
            title: resApliy.data.msg,
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  }
})