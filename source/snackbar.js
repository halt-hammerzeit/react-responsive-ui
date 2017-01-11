import React, { PureComponent, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import styler from 'react-styling/flat'

// Sits at the bottom of a page and displays notifications
export default class Snackbar extends PureComponent
{
	static propTypes =
	{
		// A timeout for a "snack" to hide itself.
		autoHideTimeout : PropTypes.number,

		// "Snack" hiding CSS animation duration.
		// Is 400 milliseconds by default.
		hideAnimationDuration : PropTypes.number.isRequired,

		// Snackbar value (either a message, or an object)
		value : PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

		// Must reset the `value`.
		reset : PropTypes.func.isRequired
	}

	static defaultProps =
	{
		hideAnimationDuration : 400
	}

	state =
	{
		values: []
	}

	constructor(props, context)
	{
		super(props, context)

		this.next = this.next.bind(this)
	}

	componentWillReceiveProps(new_props)
	{
		// Since Redux won't rerender
		// if the snack value is the same as the previous one,
		// an explicit change detection variable is introduced.
		if (new_props.value)
		{
			this.push(new_props.value)
			this.props.reset()
		}
	}

	push(value)
	{
		this.state.values.push(value)

		if (!this.state.value)
		{
			this.next()
		}
	}

	next()
	{
		const value = this.state.values.shift()
		this.setState({ value, height: undefined, hiding: false })

		if (!value)
		{
			return
		}

		// `show` will be set to `true` later,
		// when the height of the element is measured
		// (after it renders)
		// this.setState({ show: true })

		this.auto_hide_timer = setTimeout(() =>
		{
			this.auto_hide_timer = undefined
			this.setState({ show: false, hiding: true })

			setTimeout(this.next, this.props.hideAnimationDuration)
		},
		this.props.autoHideTimeout || (800 + String(value).length * 100))
	}

	componentDidUpdate()
	{
		// Calculate rendered DOM element height
		// so that the slide-from-bottom animation could be played.
		if (this.state.height === undefined && this.state.value)
		{
			const height = ReactDOM.findDOMNode(this.snackbar).offsetHeight
			const anti_lag_timeout = 100 // Otherwise it would jump to fully shown in Chrome when there's a queue of snacks waiting to be shown
			this.setState({ height }, () => setTimeout(() => this.setState({ show: true }), anti_lag_timeout))
		}
	}

	render()
	{
		const { hideAnimationDuration } = this.props
		const { show, value, height, hiding } = this.state

		let y = 0

		// If no snack is being shown,
		// or if a snack is about to be shown,
		// then shift it under the screen's bottom border
		// to show the slide-from-bottom animation at the next step.
		if (!show && height !== undefined)
		{
			y = `${height}px`
		}

		const container_style =
		{
			...styles.container,
			visibility : show ? 'visible' : 'hidden',
			transform  : `translateY(${y})`,
			transition : `transform ${hideAnimationDuration}ms ease-out, visibility ${hideAnimationDuration}ms ease-out`
		}

		if (!show && !hiding)
		{
			container_style.transition = 'none'
		}

		const snackbar_style = styles.snackbar

		const snackbar_text_style =
		{
			...styles.text,
			opacity    : show ? 1 : 0,
			transition : `opacity ${hideAnimationDuration}ms cubic-bezier(0.23, 1, 0.32, 1) 0ms`
		}

		const markup =
		(
			<div style={container_style} className="rrui__snackbar__container">
				<div ref={ref => this.snackbar = ref} style={snackbar_style} className="rrui__snackbar">
					<div style={snackbar_text_style} className="rrui__snackbar__text">
						{value}
					</div>
				</div>
			</div>
		)

		return markup
	}
}

const styles = styler
`
	container
		display  : flex
		position : fixed
		left     : 0
		right    : 0
		bottom   : 0
		pointer-events : none

	snackbar
		flex-grow : 0
		margin    : auto
		pointer-events : auto

	text
		opacity : 0
		white-space : nowrap
		overflow    : hidden
`