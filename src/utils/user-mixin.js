export default class UserMixin {
    constructor(tokenObj) {
      this.tokenObj = tokenObj;
    }

    get token() {
      return this.tokenObj.token
    }
  }
