import React from 'react'
import classNames from 'classnames'

export default function Divider({ style, className }) {
	return (
		<div
			role="separator"
			style={style}
			className={classNames(className, 'rrui__divider')}>
			<hr className="rrui__divider__line"/>
		</div>
	)
}

// Workaround for `react-hot-loader`.
// https://github.com/gaearon/react-hot-loader#checking-element-types
Divider.displayName = 'Divider'