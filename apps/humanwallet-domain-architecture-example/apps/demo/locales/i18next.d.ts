import common from "./es/common.json"
import demo from "./es/demo.json"
import error from "./es/error.json"
import login from "./es/login.json"
import settings from "./es/settings.json"
import footer from "./es/footer.json"

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      common: typeof common
      demo: typeof demo
      error: typeof error
      footer: typeof footer
      login: typeof login
      settings: typeof settings
    }
  }
}
