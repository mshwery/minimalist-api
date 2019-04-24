declare module 'evergreen-ui' {
  import { ComponentClass, ReactNode } from 'react'
  import { BoxProps } from 'ui-box'
  import { IconNames, IconName } from '@blueprintjs/icons'
  import * as CSS from 'csstype'

  type CSSProps = CSS.StandardProperties<number | string | boolean | undefined>

  export type EvergreenProps = CSSProps | BoxProps | { boxSizing?: string }

  export type Intent = 'none' | 'success' | 'warning' | 'danger'
  export type Appearance = 'default' | 'card'
  export type Elevation = 0 | 1 | 2 | 3 | 4
  export type IconName = IconName

  interface Colors {
    background: {
      blueTint: string
      greenTint: string
      orangeTint: string
      overlay: string
      purpleTint: string
      redTint: string
      tealTint: string
      tint1: string
      tint2: string
      yellowTint: string
    }
    border: {
      default: string
      muted: string
    }
    icon: {
      danger: string
      default: string
      disabled: string
      info: string
      muted: string
      selected: string
      success: string
      warning: string
    }
    intent: {
      danger: string
      none: string
      success: string
      warning: string
    }
    text: {
      danger: string
      dark: string
      default: string
      info: string
      muted: string
      selected: string
      success: string
      warning: string
    }
  }

  interface SolidFills {
    blue: {
      backgroundColor: string
      color: string
    }
    green: {
      backgroundColor: string
      color: string
    }
    neutral: {
      backgroundColor: string
      color: string
    }
    orange: {
      backgroundColor: string
      color: string
    }
    purple: {
      backgroundColor: string
      color: string
    }
    red: {
      backgroundColor: string
      color: string
    }
    teal: {
      backgroundColor: string
      color: string
    }
    yellow: {
      backgroundColor: string
      color: string
    }
  }

  interface SubtleFills {
    blue: {
      backgroundColor: string
      color: string
    }
    green: {
      backgroundColor: string
      color: string
    }
    neutral: {
      backgroundColor: string
      color: string
    }
    orange: {
      backgroundColor: string
      color: string
    }
    purple: {
      backgroundColor: string
      color: string
    }
    red: {
      backgroundColor: string
      color: string
    }
    teal: {
      backgroundColor: string
      color: string
    }
    yellow: {
      backgroundColor: string
      color: string
    }
  }

  interface Fills {
    options: string[]
    solid: SolidFills
    subtle: SubtleFills
  }

  interface Palette {
    blue: {
      base: string
      dark: string
      light: string
      lightest: string
    }
    green: {
      base: string
      dark: string
      light: string
      lightest: string
    }
    neutral: {
      base: string
      dark: string
      light: string
      lightest: string
    }
    orange: {
      base: string
      dark: string
      light: string
      lightest: string
    }
    purple: {
      base: string
      dark: string
      light: string
      lightest: string
    }
    red: {
      base: string
      dark: string
      light: string
      lightest: string
    }
    teal: {
      base: string
      dark: string
      light: string
      lightest: string
    }
    yellow: {
      base: string
      dark: string
      light: string
      lightest: string
    }
  }

  interface ColorScales {
    blue: {
      B1: string
      B10: string
      B1A: string
      B2: string
      B2A: string
      B3: string
      B3A: string
      B4: string
      B4A: string
      B5: string
      B5A: string
      B6: string
      B6A: string
      B7: string
      B7A: string
      B8: string
      B8A: string
      B9: string
    }
    neutral: {
      N1: string
      N10: string
      N1A: string
      N2: string
      N2A: string
      N3: string
      N3A: string
      N4: string
      N4A: string
      N5: string
      N5A: string
      N6: string
      N6A: string
      N7: string
      N7A: string
      N8: string
      N8A: string
      N9: string
    }
  }

  interface Typography {
    fontFamilies: {
      display: string
      mono: string
      ui: string
    }
    headings: {
      100: {
        color: string
        fontFamily: string
        fontSize: string
        fontWeight: number
        letterSpacing: string
        lineHeight: string
        marginTop: number
        textTransform: string
      }
      200: {
        color: string
        fontFamily: string
        fontSize: string
        fontWeight: number
        lineHeight: string
        marginTop: number
      }
      300: {
        color: string
        fontFamily: string
        fontSize: string
        fontWeight: number
        letterSpacing: string
        lineHeight: string
        marginTop: number
      }
      400: {
        color: string
        fontFamily: string
        fontSize: string
        fontWeight: number
        letterSpacing: string
        lineHeight: string
        marginTop: number
      }
      500: {
        color: string
        fontFamily: string
        fontSize: string
        fontWeight: number
        letterSpacing: string
        lineHeight: string
        marginTop: number
      }
      600: {
        color: string
        fontFamily: string
        fontSize: string
        fontWeight: number
        letterSpacing: string
        lineHeight: string
        marginTop: number
      }
      700: {
        color: string
        fontFamily: string
        fontSize: string
        fontWeight: number
        letterSpacing: string
        lineHeight: string
        marginTop: number
      }
      800: {
        color: string
        fontFamily: string
        fontSize: string
        fontWeight: number
        letterSpacing: string
        lineHeight: string
        marginTop: number
      }
      900: {
        color: string
        fontFamily: string
        fontSize: string
        fontWeight: number
        letterSpacing: string
        lineHeight: string
        marginTop: number
      }
    }
    paragraph: {
      300: {
        fontSize: string
        fontWeight: number
        letterSpacing: string
        lineHeight: string
        marginTop: number
      }
      400: {
        fontSize: string
        fontWeight: number
        letterSpacing: string
        lineHeight: string
        marginTop: number
      }
      500: {
        fontSize: string
        fontWeight: number
        letterSpacing: string
        lineHeight: string
        marginTop: number
      }
    }
    text: {
      300: {
        fontSize: string
        fontWeight: number
        letterSpacing: string
        lineHeight: string
        marginTop: number
      }
      400: {
        fontSize: string
        fontWeight: number
        letterSpacing: string
        lineHeight: string
        marginTop: number
      }
      '500': {
        fontSize: string
        fontWeight: number
        letterSpacing: string
        lineHeight: string
        marginTop: number
      }
      600: {
        fontFamily: string
        fontSize: string
        fontWeight: number
        letterSpacing: string
        lineHeight: string
        marginTop: number
      }
    }
  }

  export interface ITheme {
    avatarColors: string[]
    badgeColors: string[]
    colors: Colors
    elevations: Elevation[]
    fills: Fills
    overlayBackgroundColor: string
    palette: Palette
    scales: ColorScales
    spinnerColor: string
    typography: Typography
    getIconColor(color: string): string
    getAvatarProps(args: {
      isSolid?: boolean
      color: string
      hashValue?: string
    }): { color: string; backgroundColor: string }
  }

  export const defaultTheme: ITheme

  export function majorScale(val: number): number
  export function minorScale(val: number): number

  export type AlertProps =
    | EvergreenProps
    | {
        intent?: Intent
        title?: ReactNode
        hasTrim?: boolean

        /**
         * When true, show a icon on the left matching the type,
         */
        hasIcon?: boolean

        /**
         * When true, show a remove icon button.
         */
        isRemoveable?: boolean

        /**
         * The appearance of the alert.
         */
        appearance?: Appearance

        /**
         * Function called when the remove button is clicked.
         */
        onRemove?(event: React.MouseEvent<HTMLButtonElement>): void
      }
  export const Alert: ComponentClass<AlertProps>

  export type PopoverProps =
    | EvergreenProps
    | {
        content: (arg: object) => void | object
      }
  export const Popover: ComponentClass<PopoverProps>

  // Use <Pane/> instead of <Menu/> for parent
  namespace Menu {
    export const Group: ComponentClass<EvergreenProps>
    export const Item: ComponentClass<EvergreenProps>
    export const Divider: ComponentClass<EvergreenProps>
  }

  export type InlineAlertProps =
    | EvergreenProps
    | {
        intent?: Intent

        /**
         * When true, show a icon on the left matching the type,
         */
        hasIcon?: boolean

        /**
         * The size of the Text.
         */
        size?: keyof Typography['text']
      }
  export const InlineAlert: ComponentClass<InlineAlertProps>

  export type IconProps =
    | EvergreenProps
    | {
        icon: IconName

        /**
         * Color of icon. Equivalent to setting CSS `fill` property.
         */
        color?: string

        /**
         * Size of the icon, in pixels.
         * Blueprint contains 16px and 20px SVG icon images,
         * and chooses the appropriate resolution based on this prop.
         */
        size?: number

        /**
         * Description string.
         * Browsers usually render this as a tooltip on hover, whereas screen
         * readers will use it for aural feedback.
         * By default, this is set to the icon's name for accessibility.
         */
        title?: string

        /**
         * CSS style properties.
         */
        style?: CSS.StandardProperties
      }
  export const Icon: ComponentClass<IconProps>

  export type SelectProps =
    | EvergreenProps
    | {
        /**
         * The initial value of an uncontrolled select
         */
        defaultValue?: string

        /**
         * The value of the select.
         */
        value?: string

        /**
         * When true, the select is required.
         */
        required?: boolean

        /**
         * When true, the select should auto focus.
         */
        autoFocus?: boolean

        /**
         * When true, the select is invalid.
         */
        isInvalid?: boolean

        /**
         * The appearance of the select. The default theme only supports default.
         */
        appearance?: string

        /**
         * Function called when value changes.
         */
        onChange?(event: React.ChangeEvent<HTMLSelectElement>): void
      }
  export const Select: ComponentClass<SelectProps>

  type HeadingProps =
    | EvergreenProps
    | {
        size?: keyof Typography['headings']
      }
  export const Heading: ComponentClass<HeadingProps>

  export type TextProps =
    | EvergreenProps
    | {
        size?: keyof Typography['text']
      }
  export const Text: ComponentClass<TextProps>

  export type StrongProps =
    | EvergreenProps
    | {
        size?: keyof Typography['text']
      }
  export const Strong: ComponentClass<StrongProps>

  export type ParagraphProps =
    | EvergreenProps
    | {
        size?: keyof Typography['paragraph']
      }
  export const Paragraph: ComponentClass<ParagraphProps>

  export const Code: ComponentClass<TextProps>

  export const Label: ComponentClass<TextProps>

  export const Small: ComponentClass<TextProps>

  export type TextareaProps =
    | EvergreenProps
    | {
        required?: boolean
        disabled?: boolean
        isInvalid?: boolean
        spellCheck?: boolean
        grammarly?: boolean
        appearance?: string
        name?: string
        placeholder?: string
        theme?: object
        className?: string
      }
  export const Textarea: ComponentClass<TextareaProps>

  export type SideSheetProps = EvergreenProps | {}
  export const SideSheet: ComponentClass<SideSheetProps>

  export type PaneProps =
    | EvergreenProps
    | {
        elevation?: Elevation
        hoverElevation?: Elevation
        activeElevation?: Elevation
      }
  export const Pane: ComponentClass<PaneProps>

  export type CardProps =
    | EvergreenProps
    | {
        elevation?: Elevation
        hoverElevation?: Elevation
        activeElevation?: Elevation
      }
  export const Card: ComponentClass<CardProps>

  type ButtonAppearance = 'default' | 'minimal' | 'primary'
  export type ButtonProps =
    | EvergreenProps
    | {
        intent?: Intent
        appearance?: ButtonAppearance
        /**
         * When true, show a loading spinner before the children.
         * This also disables the button.
         */
        isLoading?: boolean
        /**
         * Forcefully set the active state of a button.
         * Useful in conjuction with a Popover.
         */
        isActive?: boolean
        /**
         * Sets an icon before the text. Can be any icon from Evergreen.
         */
        iconBefore?: IconName
        /**
         * Sets an icon after the text. Can be any icon from Evergreen.
         */
        iconAfter?: IconName
        /**
         * When true, the button is disabled.
         * isLoading also sets the button to disabled.
         */
        disabled?: boolean
        /**
         * Theme provided by ThemeProvider.
         */
        theme?: ITheme
        /**
         * Class name passed to the button.
         * Only use if you know what you are doing.
         */
        className?: string
      }
  export const Button: ComponentClass<ButtonProps>

  export type TextDropdownButtonProps =
    | EvergreenProps
    | {
        /**
         * Forcefully set the active state of a button.
         * Useful in conjuction with a Popover.
         */
        isActive?: boolean
        /**
         * When true, the button is disabled.
         * isLoading also sets the button to disabled.
         */
        disabled?: boolean
        /**
         * Name of a Blueprint UI icon, or an icon element, to render.
         * This prop is required because it determines the content of the component, but it can
         * be explicitly set to falsy values to render nothing.
         *
         * - If `null` or `undefined` or `false`, this component will render nothing.
         * - If given an `IconName` (a string literal union of all icon names),
         *   that icon will be rendered as an `<svg>` with `<path>` tags.
         * - If given a `JSX.Element`, that element will be rendered and _all other props on this component are ignored._
         *   This type is supported to simplify usage of this component in other Blueprint components.
         *   As a consumer, you should never use `<Icon icon={<element />}` directly; simply render `<element />` instead.
         */
        icon: string
      }
  export const TextDropdownButton: ComponentClass<TextDropdownButtonProps>

  type IconButtonAppearance = 'default' | 'minimal' | 'primary'
  export type IconButtonProps =
    | EvergreenProps
    | ButtonProps
    | {
        /**
         * Name of a Blueprint UI icon, or an icon element, to render.
         */
        icon?: IconName
        /**
         * Specifies an explicit icon size instead of the default value.
         */
        iconSize?: number
        /**
         * The intent of the button.
         */
        intent?: Intent
        /**
         * The appearance of the button.
         */
        appearance?: IconButtonAppearance
        /**
         * Forcefully set the active state of a button.
         * Useful in conjuction with a Popover.
         */
        isActive?: boolean
        /**
         * When true, the button is disabled.
         * isLoading also sets the button to disabled.
         */
        disabled?: boolean
        /**
         * Theme provided by ThemeProvider.
         */
        theme?: ITheme
        /**
         * Class name passed to the button.
         * Only use if you know what you are doing.
         */
        className?: string
      }
  export const IconButton: ComponentClass<IconButtonProps>

  export type ImageProps =
    | EvergreenProps
    | {
        src?: string
      }
  export const Image: ComponentClass<ImageProps>

  export type UnorderedListProps = EvergreenProps
  export const UnorderedList: ComponentClass<UnorderedListProps>

  export type ListItemProps = EvergreenProps
  export const ListItem: ComponentClass<ListItemProps>

  export type TextInputFieldProps =
    | EvergreenProps
    | {
        /**
         * The label used above the input element.
         */
        label?: ReactNode

        /**
         * Passed on the label as a htmlFor prop.
         */
        labelFor?: string

        /**
         * Wether or not show a asterix after the label.
         */
        isRequired?: boolean

        /**
         * A optional description of the field under the label, above the input element.
         */
        description?: ReactNode

        /**
         * A optional hint under the input element.
         */
        hint?: ReactNode

        /**
         * If a validation message is passed it is shown under the input element
         * and above the hint.
         */
        validationMessage?: ReactNode

        /**
         * The height of the input element.
         */
        inputHeight?: number

        /**
         * The width of the input width.
         */
        inputWidth?: [number, string]
      }

  export const TextInputField: ComponentClass<TextInputFieldProps>

  export type CheckboxProps =
    | EvergreenProps
    | {
        /**
         * The id attribute of the checkbox.
         */
        id?: string

        /**
         * The id attribute of the radio.
         */
        name?: string

        /**
         * Label of the checkbox.
         */
        label?: ReactNode

        /**
         * The value attribute of the radio.
         */
        value?: string

        /**
         * The checked attribute of the radio.
         */
        checked?: boolean

        /**
         * State in addition to "checked" and "unchecked".
         * When true, the radio displays a "minus" icon.
         */
        indeterminate?: boolean

        /**
         * When true, the radio is disabled.
         */
        disabled?: boolean

        /**
         * When true, the aria-invalid attribute is true.
         * Used for accessibility.
         */
        isInvalid?: boolean

        /**
         * The appearance of the checkbox.
         * The default theme only comes with a default style.
         */
        appearance?: string

        /**
         * Theme provided by ThemeProvider.
         */
        theme?: ITheme

        /**
         * Function called when state changes.
         */
        onChange?(event: React.ChangeEvent<HTMLInputElement>): void
      }
  export const Checkbox: ComponentClass<CheckboxProps>

  export type SwitchProps =
    | EvergreenProps
    | {
        checked?: boolean
        onChange?(event: React.ChangeEvent<HTMLInputElement>): void
      }
  export const Switch: ComponentClass<SwitchProps>

  export type FormFieldProps =
    | EvergreenProps
    | {
        /**
         * The label used above the input element.
         */
        label?: ReactNode

        /**
         * Passed on the label as a htmlFor prop.
         */
        labelFor?: string

        /**
         * Wether or not show a asterix after the label.
         */
        isRequired?: boolean

        /**
         * A optional description of the field under the label, above the input element.
         */
        description?: ReactNode

        /**
         * A optional hint under the input element.
         */
        hint?: ReactNode

        /**
         * If a validation message is passed it is shown under the input element
         * and above the hint.
         */
        validationMessage?: ReactNode

        /**
         * The height of the input element.
         */
        inputHeight?: number

        /**
         * The width of the input width.
         */
        inputWidth?: [number, string]
      }

  export const FormField: ComponentClass<FormFieldProps>

  export type SpinnerProps =
    | EvergreenProps
    | {
        /**
         * Delay after which spinner should be visible.
         */
        delay?: boolean

        /**
         * The size of the spinner.
         */
        size: number
      }

  export const Spinner: ComponentClass<SpinnerProps>

  export type BackButtonProps = EvergreenProps // TODO
  export const BackButton: ComponentClass<BackButtonProps>

  export type SelectFieldProps = EvergreenProps // TODO
  export const SelectField: ComponentClass<SelectFieldProps>

  export type TextInputProps = EvergreenProps
  export const TextInput: ComponentClass<TextInputProps>

  export type RadioProps = EvergreenProps
  export const Radio: ComponentClass<RadioProps>

  export enum Position {
    TOP = 'top',
    TOP_LEFT = 'top-left',
    TOP_RIGHT = 'top-right',
    BOTTOM = 'bottom',
    BOTTOM_LEFT = 'bottom-left',
    BOTTOM_RIGHT = 'bottom-right',
    LEFT = 'left',
    RIGHT = 'right'
  }

  type TooltipAppearance = 'default' | 'card'
  export type TooltipStatelessProps =
    | EvergreenProps
    | {
        /**
         * The appearance of the tooltip.
         */
        appearance?: TooltipAppearance
        /**
         * Theme provided by ThemeProvider.
         */
        theme?: ITheme
      }
  export type TooltipProps =
    | EvergreenProps
    | {
        /**
         * The appearance of the tooltip.
         */
        appearance?: TooltipAppearance
        /**
         * The position the Popover is on.
         */
        position?: Position
        /**
         * The content of the Popover.
         */
        content?: ReactNode
        /**
         * Time in ms before hiding the Tooltip.
         */
        hideDelay?: number
        /**
         * When true, manually show the Tooltip.
         */
        isShown?: boolean
        /**
         * Properties passed through to the Tooltip.
         */
        statelessProps?: TooltipStatelessProps
      }
  export const Tooltip: ComponentClass<TooltipProps>

  export interface SelectMenuItem {
    label: string
    value: string | number
    labelInList?: string
    disabled?: boolean
  }
  export type SelectMenuPropsViewCallback = (args: { close(): void }) => ReactNode
  export type SelectMenuProps =
    | EvergreenProps
    | {
        /**
         * The title of the Select Menu.
         */
        title?: string
        /**
         * The width of the Select Menu.
         */
        width?: number
        /**
         * The height of the Select Menu.
         */
        height?: number
        /**
         * The options to show in the menu.
         */
        options?: SelectMenuItem[]
        /**
         * The selected value/values.
         */
        selected?: string | string[]
        /**
         * When true, multi select is accounted for.
         */
        isMultiSelect?: boolean
        /**
         * When true, show the title.
         */
        hasTitle?: boolean
        /**
         * When true, show the filter.
         */
        hasFilter?: boolean
        /**
         * The position of the Select Menu.
         */
        position?: Position
        /**
         * Can be a function that returns a node, or a node itself, that is
         * rendered on the right side of the Select Menu to give additional
         * information when an option is selected.
         */
        detailView?: ReactNode | SelectMenuPropsViewCallback
        /**
         * Can be a function that returns a node, or a node itself, that is
         * rendered instead of the options list when there are no options.
         */
        emptyView?: ReactNode | SelectMenuPropsViewCallback
        /**
         * Function that is called when an option is selected.
         */
        onSelect?(item: SelectMenuItem): void
        /**
         * Function that is called when an option is deselected.
         */
        onDeselect?(item: SelectMenuItem): void
        /**
         * Function that is called as the onChange() event for the filter.
         */
        onFilterChange?(searchValue: string): void
      }
  export const SelectMenu: ComponentClass<SelectMenuProps>

  export type AvatarProps =
    | EvergreenProps
    | {
        /** When provided, the first and last initial of the name will be used.
         * For example: Foo Bar -> FB
         */
        name?: string
      }

  export const Avatar: ComponentClass<AvatarProps>

  /**
   * @deprecated Using Table in a Typescript file will result in the error:
   * "JSX element type 'Table' does not have any construct or call signatures."
   * In this case, use Pane instead.
   */
  namespace Table {
    export type HeadProps =
      | EvergreenProps
      | {
          /**
           * The height of the table head.
           */
          height?: number
          /**
           * This should always be true if you are using TableHead together with a TableBody.
           * Because TableBody has `overflowY: scroll` by default.
           */
          accountForScrollbar?: boolean
        }
    export const Head: ComponentClass<HeadProps>

    export const Body: ComponentClass<EvergreenProps>

    export type VirtualBodyProps =
      | EvergreenProps
      | {
          /**
           * Default height of each row.
           * 48 is the default height of a TableRow.
           */
          defaultHeight?: number
          /**
           * When true, support `height="auto"` on children being rendered.
           * This is somewhat of an expirmental feature.
           */
          allowAutoHeight?: boolean
          /**
           * The overscanCount property passed to react-tiny-virtual-list.
           */
          overscanCount?: number
          /**
           * When passed, this is used as the `estimatedItemSize` in react-tiny-virtual-list.
           * Only when `allowAutoHeight` and`useAverageAutoHeightEstimation` are false.
           */
          estimatedItemSize?: number
          /**
           * When allowAutoHeight is true and this prop is true, the estimated height
           * will be computed based on the average height of auto height rows.
           */
          useAverageAutoHeightEstimation?: boolean
          /**
           * The scrollToIndex property passed to react-tiny-virtual-list
           */
          scrollToIndex?: number
          /**
           * The scrollOffset property passed to react-tiny-virtual-list
           */
          scrollOffset?: number
          /**
           * The scrollToAlignment property passed to react-tiny-virtual-list
           */
          scrollToAlignment?: 'start' | 'center' | 'end' | 'auto'
        }
    export const VirtualBody: ComponentClass<VirtualBodyProps>

    export type RowProps =
      | EvergreenProps
      | {
          /**
           * The height of the row. Remember to add paddings when using "auto".
           */
          height?: number | string
          /**
           * Makes the TableRow selectable.
           */
          isSelectable?: boolean
          /**
           * Makes the TableRow selected.
           */
          isSelected?: boolean
          /**
           * Manually set the TableRow to be highlighted.
           */
          isHighlighted?: boolean
          /**
           * The intent of the alert.
           */
          intent?: Intent
          /**
           * The appearance of the table row. Default theme only support default.
           */
          appearance?: string
          /**
           * Theme provided by ThemeProvider.
           */
          theme?: ITheme
          /**
           * Class name passed to the table row.
           * Only use if you know what you are doing.
           */
          className?: string
          /**
           * Function that is called on click and enter/space keypress.
           */
          onSelect?(): void
          /**
           * Function that is called on click and enter/space keypress.
           */
          onDeselect?(): void
        }
    export const Row: ComponentClass<RowProps>

    type CellPropsArrowKeysOverrideCallback = () => void
    export interface CellPropsArrowKeysOverrides {
      up?: string | CellPropsArrowKeysOverrideCallback | JSX.Element | false
      down?: string | CellPropsArrowKeysOverrideCallback | JSX.Element | false
      left?: string | CellPropsArrowKeysOverrideCallback | JSX.Element | false
      right?: string | CellPropsArrowKeysOverrideCallback | JSX.Element | false
    }
    export type CellProps =
      | EvergreenProps
      | {
          /**
           * Makes the TableCell focusable. Used by EditableCell.
           * Will add tabIndex={-1 || this.props.tabIndex}.
           */
          isSelectable?: boolean
          /**
           * The appearance of the table row. Default theme only support default.
           */
          appearance?: string
          /**
           * Optional node to be placed on the right side of the table cell.
           * Useful for icons and icon buttons.
           */
          rightView?: ReactNode
          /**
           * Theme provided by ThemeProvider.
           */
          theme?: ITheme
          /**
           * Advanced arrow keys overrides for selectable cells.
           * A string will be used as a selector.
           */
          arrowKeysOverrides?: CellPropsArrowKeysOverrides
          /**
           * Class name passed to the table cell.
           * Only use if you know what you are doing.
           */
          className?: string
        }
    export const Cell: ComponentClass<CellProps>

    export type TextCellProps =
      | CellProps
      | {
          /**
           * Adds textAlign: right and fontFamily: mono.
           */
          isNumber?: boolean
          /**
           * Pass additional props to the Text component.
           */
          textProps?: TextProps
        }
    export const TextCell: ComponentClass<TextCellProps>

    export type HeaderCellProps = CellProps
    export const HeaderCell: ComponentClass<HeaderCellProps>

    export type TextHeaderCellProps =
      | HeaderCellProps
      | {
          /**
           * Pass additional props to the Text component.
           */
          textProps?: TextProps
        }
    export const TextHeaderCell: ComponentClass<TextHeaderCellProps>

    export type SearchHeaderCellProps =
      | HeaderCellProps
      | {
          /**
           * The value of the input.
           */
          value?: string
          /**
           * Sets whether the component should be automatically focused on component render.
           */
          autoFocus?: boolean
          /**
           * Sets whether to apply spell checking to the content.
           */
          spellCheck?: boolean
          /**
           * Text to display in the input if the input is empty.
           */
          placeholder?: string
          /**
           * Handler to be called when the input changes.
           */
          onChange?(value: string): void
        }
    export const SearchHeaderCell: ComponentClass<SearchHeaderCellProps>

    export type EditableCellProps =
      | CellProps
      | {
          /**
           * Makes the TableCell focusable.
           * Will add tabIndex={-1 || this.props.tabIndex}.
           */
          isSelectable?: boolean
          /**
           * When true, the cell can't be edited.
           */
          disabled?: boolean
          /**
           * Optional placeholder when children is falsy.
           */
          placeholder?: ReactNode
          /**
           * The size used for the TextTableCell and Textarea.
           */
          size?: 300 | 400
          /**
           * This is the value of the cell.
           */
          children?: string | number
          /**
           * Function called when value changes.
           */
          onChange?(value: string): void
        }
    export const EditableCell: ComponentClass<EditableCellProps>

    export type SelectMenuCellProps =
      | CellProps
      | {
          /**
           * Makes the TableCell focusable.
           * Will add tabIndex={-1 || this.props.tabIndex}.
           */
          isSelectable?: boolean
          /**
           * When true, the cell can't be edited.
           */
          disabled?: boolean
          /**
           * Optional placeholder when children is falsy.
           */
          placeholder?: ReactNode
          /**
           * The size used for the TextTableCell and Textarea.
           */
          size?: 300 | 400
          /**
           * The size used for the TextTableCell and Textarea.
           */
          selectMenuProps?: SelectMenuProps
        }
    export const SelectMenuCell: ComponentClass<SelectMenuCellProps>
  }

  type LinkProps =
    | EvergreenProps
    | {
        /**
         * This attribute names a relationship of the linked document to the current document.
         * Common use case is: rel="noopener noreferrer".
         */
        rel?: string

        /**
         * Specifies the URL of the linked resource. A URL might be absolute or relative.
         */
        href?: string

        /**
         * Target atrribute, common use case is target="_blank."
         */
        target?: string

        /**
         * The color (and styling) of the Link. Can be default, blue, green or neutral.
         */
        color?: string
      }
  export const Link: ComponentClass<LinkProps>

  type BadgeProps =
    | EvergreenProps
    | StrongProps
    | {
        /**
         * The color used for the badge. When the value is `automatic`, use the hash function to determine the color.
         */
        color?: 'automatic' | 'neutral' | 'blue' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'purple'
        /**
         * Whether or not to apply hover/focus/active styles.
         */
        isInteractive?: boolean
        /**
         * Whether or not to apply hover/focus/active styles.
         */
        theme?: ITheme
        isSolid?: boolean
      }
  export const Badge: ComponentClass<BadgeProps>

  type PillProps = BadgeProps
  export const Pill: ComponentClass<PillProps>

  /**
   * Optional settings that can be set when creating a new Toast.
   */
  interface ToasterSettings {
    /**
     * A description of the toast which is rendered as the children of the Toast's Alert component.
     */
    description?: ReactNode

    /**
     * How long the Toast will be visible (in seconds). Defaults to 5 seconds.
     */
    duration?: number

    /**
     * Assign a Toast an id if you want only one instance of that toast visible at any given time.
     * When a new toast with an id is opened, any visible toasts with the same id will be closed.
     */
    id?: string

    /**
     * Whether to show a close button on the Toast. Defaults to true.
     */
    hasCloseButton?: boolean
  }

  interface Toast {
    /**
     * The id of the Toast.
     */
    id: string

    /**
     * The title of the Toast.
     */
    title: ReactNode

    /**
     * The description of the Toast.
     */
    description?: ReactNode

    /**
     * Whether the Toast is showing a close button.
     */
    hasCloseButton: boolean

    /**
     * How long the Toast is visible for.
     */
    duration: number

    /**
     * Close will close this Toast.
     */
    close: () => void

    /**
     * The intent of this Toast. One of none, success, warning, or danger.
     */
    intent: Intent
  }

  /**
   * The toaster is used to show toasts (alerts) on top of an overlay. The toasts will close
   * themselves when the close button is clicked, or after a timeout — the default is 5 seconds.
   */
  export const toaster: {
    /**
     * Opens a Toast with an intent of none.
     */
    notify: (title: string, settings?: ToasterSettings) => void

    /**
     * Opens a Toast with an intent of success.
     */
    success: (title: string, settings?: ToasterSettings) => void

    /**
     * Opens a Toast with an intent of warning.
     */
    warning: (title: string, settings?: ToasterSettings) => void

    /**
     * Opens a Toast with an intent of danger.
     */
    danger: (title: string, settings?: ToasterSettings) => void

    /**
     * Closes all visible Toasts.
     */
    closeAll: () => void

    /**
     * Returns all visible Toasts.
     */
    getToasts: () => Toast[]
  }

  export const TabNavigation: ComponentClass<{}>

  interface TabProps {
    /**
     * Function triggered when tab is selected.
     */
    onSelect?: () => {}
    isSelected?: boolean
    disabled?: boolean
  }

  export const Tab: ComponentClass<TabProps | EvergreenProps>

  interface DialogProps {
    /**
     * Children can be a string, node or a function accepting `({ close })`.
     * When passing a string, <Paragraph /> is used to wrap the string.
     */
    children?: ReactNode | (({ close }: { close: () => void }) => void)

    /**
     * The intent of the Dialog. Used for the button. Defaults to none.
     */
    intent?: Intent

    /**
     * When true, the dialog is shown. Defaults to false.
     */
    isShown?: boolean

    /**
     * Title of the Dialog. Titles should use Title Case.
     */
    title?: string

    /**
     * When true, the header with the title and close icon button is shown.
     * Defaults to true.
     */
    hasHeader?: boolean

    /**
     * When true, the footer with the cancel and confirm button is shown.
     * Defaults to true.
     */
    hasFooter?: boolean

    /**
     * When true, the cancel button is shown. Defaults to true.
     */
    hasCancel?: boolean

    /**
     * When true, the close button is shown. Defaults to true.
     */
    hasClose?: boolean

    /**
     * Function that will be called when the exit transition is complete.
     */
    onCloseComplete?: () => void

    /**
     * Function that will be called when the enter transition is complete.
     */
    onOpenComplete?: () => void

    /**
     * Function that will be called when the confirm button is clicked.
     * This does not close the Dialog. A close function will be passed
     * as a paramater you can use to close the dialog.
     * If unspecified, this defaults to closing the Dialog.
     */
    onConfirm?: (close: () => void) => void

    /**
     * Label of the confirm button. Default to 'Confirm'.
     */
    confirmLabel?: string

    /**
     * When true, the confirm button is set to loading. Defaults to false.
     */
    isConfirmLoading?: boolean

    /**
     * When true, the confirm button is set to disabled. Defaults to false.
     */
    isConfirmDisabled?: boolean

    /**
     * Function that will be called when the cancel button is clicked.
     * This closes the Dialog by default.
     */
    onCancel?: (close: () => void) => void

    /**
     * Label of the cancel button. Defaults to 'Cancel'.
     */
    cancelLabel?: string

    /**
     * Boolean indicating if clicking the overlay should close the overlay.
     * Defaults to true.
     */
    shouldCloseOnOverlayClick?: boolean

    /**
     * Boolean indicating if pressing the esc key should close the overlay.
     * Defaults to true.
     */
    shouldCloseOnEscapePress?: boolean

    /**
     * Width of the Dialog.
     */
    width?: string | number

    /**
     * The space above the dialog.
     * This offset is also used at the bottom when there is not enough vertical
     * space available on screen — and the dialog scrolls internally.
     */
    topOffset?: string | number

    /**
     * The space on the left/right sides of the dialog when there isn't enough
     * horizontal space available on screen.
     */
    sideOffset?: string | number

    /**
     * The min height of the body content.
     * Makes it less weird when only showing little content.
     */
    minHeightContent?: string | number

    /**
     * Props that are passed to the dialog container.
     */
    containerProps?: object

    /**
     * Props that are passed to the content container.
     */
    contentContainerProps?: object

    /**
     * Whether or not to prevent scrolling in the outer body. Defaults to false.
     */
    preventBodyScrolling?: boolean
  }

  export const Dialog: ComponentClass<DialogProps>
}
