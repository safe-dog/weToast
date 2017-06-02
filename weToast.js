/**
 * weToast::v0.1
 * 微信小程序自定义通知信息模块
 * 作者：safedog.cc
 */

/**
 * 默认配置
 */
const defaultState = {
  weToastTitle: '',
  weToastContent: '',
  weToastBoxBG: 'rgba(76, 175, 80, 0.9)',
  weToastAnimation: {}
}

class weToast {
  /**
   * 初始化
   * page = Page对象(this)
   */
  constructor (page) {
    this.page = page;
    this.page.setData(defaultState);

    this.animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease'
    });
    // 初始化动画
    this._hide();
  }

  /**
   * 显示消息
   */
  _show (opt) {
    this.animation.bottom(100).opacity(1).scale(1).step();
    this.page.setData({
      weToastTitle: opt['title'],
      weToastContent: opt['content'],
      weToastBoxBG: opt['style'] || defaultState['weToastBoxBG'],
      weToastAnimation: this.animation.export()
    });
    setTimeout(this._hide.bind(this), 2000);
  }

  /**
   * 隐藏消息
   */
  _hide () {
    this.animation.bottom(-100).opacity(0).scale(0).step();
    this.page.setData({
      weToastTitle: '',
      weToastContent: '',
      weToastAnimation: this.animation.export()
    });
  }

  /**
   * 成功消息
   */
  success (content, title = '') {
    this._show({
      title, content,
      style: 'rgba(76, 175, 80, 0.9)'
    })
  }

  /**
   * 提示消息
   */
  info (content, title = '') {
    this._show({
      title, content,
      style: 'rgba(0, 188, 212, 0.9)'
    })
  }

  /**
   * 警告消息
   */
  warning (content, title = '') {
    this._show({
      title, content,
      style: 'rgba(255, 152, 0, 0.9)'
    })
  }

  /**
   * 错误消息
   */
  error (content, title = '') {
    this._show({
      title, content,
      style: 'rgba(244, 67, 54, 0.9)'
    })
  }
}

module.exports = weToast;