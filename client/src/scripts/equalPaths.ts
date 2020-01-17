import { HOME, LOGIN, REGISTER } from "@scripts/routers";
import { isUndefined } from "util";

class equalPaths {
  isCurrentPagePath(path: string) {
    const {
      location: { pathname }
    } = window.g_history;
    return Object.is(path, pathname);
  }
  isHome(pathname?: string) {
    return isUndefined(pathname)
      ? this.isCurrentPagePath(HOME)
      : Object.is(pathname, HOME);
  }
  get isLogin() {
    return this.isCurrentPagePath(LOGIN);
  }
  get isRegister() {
    return this.isCurrentPagePath(REGISTER);
  }
}

export default new equalPaths();
