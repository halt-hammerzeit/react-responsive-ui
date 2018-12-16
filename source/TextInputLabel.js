import React from 'react'
import classNames from 'classnames'

export default function TextInputLabel({ id, value, required, invalid, floats, children })
{
	return (
		<label
			htmlFor={ id }
			className={ classNames('rrui__input-label',
			{
				'rrui__input-label--required'          : required && isEmptyOrBlank(value),
				'rrui__input-label--invalid'           : invalid,
				'rrui__input-label--floating'          : floats,
				'rrui__text-input__label--placeholder' : floats && isEmptyOrBlank(value)
			}) }>
			{ children }
		</label>
	)
}

function isEmptyOrBlank(value) {
	// Whitespace strings are considered empty.
	if (typeof value === 'string') {
		return !value || !value.trim()
	}
	return value === undefined || value === null
}