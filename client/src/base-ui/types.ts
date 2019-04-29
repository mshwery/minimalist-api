import { BoxProps } from 'ui-box'
import * as CSS from 'csstype'

export type BaseUIProps = BoxProps & CSS.StandardProperties<number | string | boolean | undefined>
