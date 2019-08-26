class Response {
  constructor() {}
  success(message = '操作成功') {
    return {
      code: 200,
      message
    }
  }
  successData(data = [], message = '数据获取成功') {
    return {
      code: 200,
      message,
      data
    }
  }
  successPage(
    items = [],
    page = 1,
    pageSize = 10,
    total = 0,
    message = '数据获取成功'
  ) {
    return {
      code: 200,
      message,
      data: {
        items,
        page,
        pageSize,
        total
      }
    }
  }
  loginError() {
    return {
      code: 300,
      message: '登录状态异常!'
    }
  }
  parameterError() {
    return {
      code: 301,
      message: '参数错误'
    }
  }
  error(code = 302, message = '未知错误') {
    return {
      code,
      message
    }
  }
}
module.exports = Response
