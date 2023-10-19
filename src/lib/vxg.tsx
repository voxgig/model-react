import Patrun from 'patrun'
import Jsonic from '@jsonic/jsonic-next'

import Pkg from '../../package.json'

const config_defaults: any = {}

const util: any = {}

class Vxg {
  match: any
  cmp: any
  util: any
  constructor (config: any) {
    this.match = ({
      allow: new (Patrun as any)({ gex: true })
    } as any)
    this.cmp = {}
    this.config(config)
    this.util = util
  }

  config (this: any, custom_config: any) {
    // TODO: deep, validation
    Object.assign(this.config, config_defaults, custom_config || {})

    this.config.allow = this.config.allow || {}
    this.config.allow.modify = this.config.allow.modify || ((x: any) => x)
    this.config.allow.match = this.config.allow.match || []

    for (const entry of this.config.allow.match) {
      this.match.allow.add(entry, { allow: true })
    }
  }

  allow (this: any, match: any) {
    const mm = Jsonic(match)

    // TODO: handle Aontu array workaround
    const ms = Array.isArray(match) ? match : Object.keys(mm).map((x: any) => mm[x])
    let found = null

    for (const m of ms) {
      const pat = this.config.allow.modify({ ...(m || {}) })
      found = this.match.allow.find(pat)
      if (found) {
        break
      }
    }

    return found ? !!found.allow : false
  }
}

/*
Vxg.info = {
  version: Pkg.version,
  note: 'aaa',
}
 */

export default Vxg
