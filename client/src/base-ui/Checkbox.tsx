import React, { InputHTMLAttributes } from 'react'
import Box from 'ui-box'
import { Check, Square } from 'react-feather'
import { BaseUIProps } from './types'
import { scale } from './scale'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
}

export const Checkbox: React.FunctionComponent<Props & BaseUIProps> = ({
  id,
  name,
  disabled,
  checked,
  onChange,
  value,
  ...props
}) => {
  return (
    <Box
      is='label'
      cursor={disabled ? 'not-allowed' : 'pointer'}
      position='relative'
      display='flex'
      {...props}
    >
      <Box
        is='input'
        id={id}
        type='checkbox'
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{
          clip: 'rect(1px, 1px, 1px, 1px)'
        }}
        border='none'
        height={1}
        width={1}
        overflow='hidden'
        padding={0}
        opacity={0}
        position='absolute'
        whiteSpace='nowrap'
      />
      {checked
        ? <Check size={scale(2.5)} color='#2e8ae6' />
        : <Square size={scale(2.5)} color='#A6B1BB' />
      }
    </Box>
  )
}
