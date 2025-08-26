import type common from "./es/common.json"
import type demo from "./es/demo.json"
import type error from "./es/error.json"
import type login from "./es/login.json"
import type settings from "./es/settings.json"
import type footer from "./es/footer.json"

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
