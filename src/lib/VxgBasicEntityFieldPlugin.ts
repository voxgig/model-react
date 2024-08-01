import { BasicEntityCheckboxField } from './BasicEntityCheckboxField'
import { BasicEntityAutocompleteField } from './BasicEntityAutocompleteField'
import { BasicEntitySliderField } from './BasicEntitySliderField'
import { BasicEntityRadioGroupField } from './BasicEntityRadioGroupField'
import { BasicEntityTextBoxField } from './BasicEntityTextBoxField'
import { BasicEntityTextField } from './BasicEntityTextField'
import { BasicEntityDateField } from './BasicEntityDateField'
import { BasicEntityTimeField } from './BasicEntityTimeField'
import { BasicEntityDateTimeField } from './BasicEntityDateTimeField'
import { BasicEntityRatingField } from './BasicEntityRatingField'
import { BasicEntityButtonField } from './BasicEntityButtonField'
import { BasicEntityButtonGroupField } from './BasicEntityButtonGroupField'
import { BasicEntitySelectField } from './BasicEntitySelectField'
import { BasicEntitySwitchField } from './BasicEntitySwitchField'
import { BasicEntityToggleButtonField } from './BasicEntityToggleButtonField'

import type { Spec } from './basic-types'

import { Gubu } from 'gubu'

const { Open, Child } = Gubu

const Shape = Gubu(
  Open({
    field: {},
  }),
  { name: 'BasicEntityField' }
)

const fieldMap: any = {
  Text: BasicEntityTextField,
  TextBox: BasicEntityTextBoxField,
  Date: BasicEntityDateField,
  DateTime: BasicEntityDateTimeField,
  Time: BasicEntityTimeField,
  Checkbox: BasicEntityCheckboxField,
  Autocomplete: BasicEntityAutocompleteField,
  Slider: BasicEntitySliderField,
  RadioGroup: BasicEntityRadioGroupField,
  Rating: BasicEntityRatingField,
  Button: BasicEntityButtonField,
  ButtonGroup: BasicEntityButtonGroupField,
  Select: BasicEntitySelectField,
  Switch: BasicEntitySwitchField,
  ToggleButton: BasicEntityToggleButtonField,
}

function VxgBasicEntityFieldPlugin (this: any, options: any) {
  const seneca = this

  const spec = Shape(options.spec)

  const field: any = spec.field
  const Field: any = fieldMap[field.ux.kind]

  console.log('VxgBasicEntityFieldPlugin', 'init', field.name, field.ux.kind)

  // if ('Slider' === field.ux.kind) {
  //   console.log(
  //     'VxgBasicEntityFieldPlugin',
  //     'seneca.add',
  //     field.name,
  //     field.ux.kind
  //   )
  //   seneca.add(
  //     'aim:app,on:BasicLed,modify:edit,view:podcast',
  //     function modify_edit_Slider (this: any, msg: any) {
  //       const item = msg.item

  //       const out = this.prior(msg)

  //       console.log('VxgBasicLedPlugin', 'modify:edit', 'Slider', out)

  //       return item
  //     }
  //   )
  // }

  // seneca.add('aim:app,on:BasicLed,modify:save', function (msg: any) {})

  options.setPlugin(true)

  return {
    exports: {
      handle: { Field },
    },
  }
}

Object.assign(VxgBasicEntityFieldPlugin, {
  defaults: {
    spec: {},
    setPlugin: Function,
  },
})

Object.defineProperty(VxgBasicEntityFieldPlugin, 'name', {
  value: 'VxgBasicEntityFieldPlugin',
})

export { VxgBasicEntityFieldPlugin }
