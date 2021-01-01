import React, { InputHTMLAttributes } from 'react'
import { css } from '@emotion/css'
import { Check, Square } from 'react-feather'
import Box from 'ui-box'
import { BaseUIProps } from './types'
import { scale } from './scale'
import { colors } from './colors'

type Props = InputHTMLAttributes<HTMLInputElement>

export const Checkbox: React.FunctionComponent<Props & BaseUIProps> = ({
  id,
  name,
  disabled,
  checked,
  onChange,
  value,
  ...props
}) => {
  const cursor = disabled ? 'not-allowed' : 'pointer'
  return (
    <Box
      is="label"
      cursor={cursor}
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flex="none"
      {...props}
    >
      <Box
        is="input"
        id={id}
        type="checkbox"
        name={name}
        cursor="inherit"
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        border="none"
        height="100%"
        width="100%"
        top={0}
        right={0}
        bottom={0}
        left={0}
        overflow="hidden"
        margin={0}
        padding={0}
        opacity={0}
        position="absolute"
        whiteSpace="nowrap"
        zIndex={1}
        className={css`
          &:focus + svg {
            box-shadow: 0 0 0 3px ${colors.fill.primary}25;
          }
        `}
      />
      {checked ? (
        <Check size={scale(2.5)} color={colors.fill.primary} />
      ) : (
        <Square size={scale(2.5)} color={colors.fill.secondary} />
      )}
    </Box>
  )
}
