import type { Spec } from './basic-types'

import { Gubu } from 'gubu'

const { Open, Child } = Gubu

const Shape = Gubu(
  Open({
    name: String,
    prefix: String,
    ent: String,
    order: [String],
    field: Child({}, {}),
  }),
  { name: 'BasicEntityEdit' }
)

function VxgBasicEntityEditPlugin (this: any, options: any) {
  const seneca = this

  const spec = Shape(options.spec)

  const slot = spec.prefix + spec.name

  const fields = spec.order.reduce(
    (a: any, fn: any) => (
      fixField(fn, spec.field[fn], spec), a.push(spec.field[fn]), a
    ),
    []
  )

  for (const field of fields) {
    if ('Date' === field.ux.kind) {
      seneca
        .add(
          'aim:app,on:BasicLed,modify:edit,view:' + spec.name,
          async function modify_edit_Date (this: any, msg: any) {
            const out = await this.prior(msg)

            let item = { ...out }

            if (!item[field.name + '_orig$']) {
              const dt = util.dateTimeFromUTC(item[field.name])
              item[field.name + '_orig$'] = item[field.name]
              item[field.name + '_udm$'] = dt.udm
              item[field.name] = dt.locald
              console.log('modify_edit_Date', item[field.name])
            }

            return item
          }
        )

        .add(
          'aim:app,on:BasicLed,modify:save',
          { view: spec.name },
          async function modify_save_Date (this: any, msg: any) {
            const out = await this.prior(msg)

            let item = { ...out }

            const dt = util.localDateTimeToUTC(item[field.name])
            item[field.name] = dt

            return item
          }
        )
    } else if ('Time' === field.ux.kind) {
      seneca
        .add(
          'aim:app,on:BasicLed,modify:edit,view:' + spec.name,
          async function modify_edit_Time (this: any, msg: any) {
            const out = await this.prior(msg)

            let item = { ...out }

            if (!item[field.name + '_orig$']) {
              const dt = util.dateTimeFromUTC(item[field.name])
              item[field.name + '_orig$'] = item[field.name]
              item[field.name + '_udm$'] = dt.udm
              item[field.name] = dt.localt
              console.log('modify_edit_Time', item[field.name])
            }

            return item
          }
        )

        .add(
          'aim:app,on:BasicLed,modify:save',
          { view: spec.name },
          async function modify_save_Time (this: any, msg: any) {
            const out = await this.prior(msg)

            let item = { ...out }

            const dt = util.localTimeToUTC(item[field.name])
            item[field.name] = dt

            return item
          }
        )
    } else if ('DateTime' === field.ux.kind) {
      seneca
        .add(
          'aim:app,on:BasicLed,modify:edit,view:' + spec.name,
          async function modify_edit_Datetime (this: any, msg: any) {
            const out = await this.prior(msg)

            let item = { ...out }

            if (!item[field.name + '_orig$']) {
              const dt = util.dateTimeFromUTC(item[field.name])
              item[field.name + '_orig$'] = item[field.name]
              item[field.name + '_udm$'] = dt.udm
              item[field.name] = dt.locald + 'T' + dt.localt
            }

            return item
          }
        )

        .add(
          'aim:app,on:BasicLed,modify:save',
          { view: spec.name },
          async function modify_save_Datetime (this: any, msg: any) {
            const out = await this.prior(msg)

            let item = { ...out }

            const dt = util.localDateTimeToUTC(item[field.name])
            item[field.name] = dt

            return item
          }
        )
    } else if ('Slider' === field.ux.kind) {
      // console.log('VxgBasicEntityEditPlugin', 'Slider')
      seneca
        .add(
          'aim:app,on:BasicLed,modify:edit',
          { view: spec.name },
          async function modify_edit_Slider (this: any, msg: any) {
            const out = await this.prior(msg)

            let item = { ...out }

            if (!item[field.name + '_orig$']) {
              item[field.name + '_orig$'] = item[field.name]
              item[field.name] = Number(item[field.name]) / 60
            }

            // return { ...msg, item }
            return item
          }
        )

        .add(
          'aim:app,on:BasicLed,modify:save',
          { view: spec.name },
          async function modify_save_Slider (this: any, msg: any) {
            const out = await this.prior(msg)

            let item = { ...out }

            item[field.name] = Number(item[field.name]) * 60

            return item
          }
        )
    }
  }

  options.setPlugin(true)

  return {
    exports: {
      handle: {
        spec,
        slot,
        fields,
      },
      util,
    },
  }
}

function fixField (name: string, field: any, spec: any) {
  field.id = 'vxg-field-' + spec.name + '-' + name
  field.name = name
  field.ux = field.ux || {}
  field.ux.size = null == field.ux.size ? 4 : parseInt(field.ux.size, 10)
}

const util = {
  dateTimeFromUTC: (utc: number, tz?: string) => {
    const date = new Date(utc)
    const iso = date.toISOString()
    const isod = iso.split('T')[0]
    const isot = iso.split('T')[1].split('.')[0]

    // UTC millis into day (since midnight)
    const udm =
      date.getUTCHours() * 60 * 60 * 1000 +
      date.getUTCMinutes() * 60 * 1000 +
      date.getUTCSeconds() * 1000 +
      date.getUTCMilliseconds()

    let out: any = {
      utc,
      date,
      isod,
      isot,
      udm,
    }

    tz = tz || Intl.DateTimeFormat().resolvedOptions().timeZone
    const dateFormatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })

    const timeFormatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })

    const [{ value: day }, , { value: month }, , { value: year }] =
      dateFormatter.formatToParts(date)
    const [{ value: hour }, , { value: minute }, , { value: second }] =
      timeFormatter.formatToParts(date)

    out.locald = `${year}-${month}-${day}`
    out.localt = `${hour}:${minute}:${second}`

    return out
  },
  localTimeToUTC: (timeString: string, tz?: string) => {
    tz = tz || Intl.DateTimeFormat().resolvedOptions().timeZone
    const now = new Date()

    const [hours, minutes, seconds] = timeString.split(':').map(Number)

    const localDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      seconds
    )

    const utcTimestamp = Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(),
      localDate.getHours(),
      localDate.getMinutes(),
      localDate.getSeconds()
    )

    const tzOffset = new Date(utcTimestamp).getTimezoneOffset() * 60000

    return utcTimestamp - tzOffset
  },
  localDateTimeToUTC: (dateOrDateTimeString: string, tz?: string) => {
    const date = new Date(dateOrDateTimeString)

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date or datetime string')
    }

    // If a timezone is provided, adjust the date
    if (tz) {
      const tzDate = new Date(date.toLocaleString('en-GB', { timeZone: tz }))
      const offset = date.getTime() - tzDate.getTime()
      return date.getTime() + offset
    }

    // If no timezone is provided, assume the input is already in local time
    return date.getTime()
  },
}

Object.assign(VxgBasicEntityEditPlugin, {
  defaults: {
    spec: {},
    setPlugin: Function,
  },
})

Object.defineProperty(VxgBasicEntityEditPlugin, 'name', {
  value: 'VxgBasicEntityEditPlugin',
})

export { VxgBasicEntityEditPlugin }
