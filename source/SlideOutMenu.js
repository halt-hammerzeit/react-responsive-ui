import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import createRef from 'react-create-ref'
import createContext from 'create-react-context'

import { Context as PageAndMenuContext } from './PageAndMenu'
import OnFocusOut from './OnFocusOut'

export const Context = createContext()

// `PureComponent` is only available in React >= 15.3.0.
const PureComponent = React.PureComponent || React.Component

export default class ContextAwareSlideoutMenu extends PureComponent {
	slideOutMenu = createRef()
	show = () => this.slideOutMenu.current.show()
	hide = () => this.slideOutMenu.current.hide()
	render() {
		return (
			<PageAndMenuContext.Consumer>
				{context => (
					<SlideoutMenu
						ref={this.slideOutMenu}
						{...this.props}
						registerMenu={context.registerMenu}
						toggleMenu={context.toggleMenu}
						getTogglerNode={context.getTogglerNode}/>
					)
				}
			</PageAndMenuContext.Consumer>
		)
	}
}

// const ContextAwareSlideoutMenu = (props) => (
// 	<PageAndMenuContext.Consumer>
// 		{context => (
// 			<SlideoutMenu
// 				{...props}
// 				registerMenu={context.registerMenu}
// 				toggleMenu={context.toggleMenu}/>
// 			)
// 		}
// 	</PageAndMenuContext.Consumer>
// )

// export default ContextAwareSlideoutMenu

// Swipeable feature example source code:
// https://github.com/mui-org/material-ui/blob/v1-beta/packages/material-ui/src/SwipeableDrawer/SwipeableDrawer.js

// A slideout menu.
class SlideoutMenu extends PureComponent
{
	static propTypes =
	{
		anchor : PropTypes.oneOf([
			'left',
			'right',
			'top',
			'bottom'
		]).isRequired,

		// isOpen : PropTypes.bool.isRequired,

		fullscreen : PropTypes.bool.isRequired,

		// A result of `React.createRef()`.
		// Will be focused when the menu is opened.
		menuRef : PropTypes.object,

		onCollapse : PropTypes.func,
		onExpand : PropTypes.func,

		toggleMenu : PropTypes.func.isRequired,
		registerMenu : PropTypes.func.isRequired,
		getTogglerNode : PropTypes.func.isRequired,

		// CSS style object
		style : PropTypes.object,

		// CSS class
		className : PropTypes.string
	}

	static defaultProps =
	{
		// isOpen : false,
		anchor : 'left',
		fullscreen : false
	}

	state = {
		// show: this.props.isOpen
		show: false
	}

	container = createRef()

	componentDidMount()
	{
		const { registerMenu, menuRef } = this.props
		const { show } = this.state

		this.unregister = registerMenu
		({
			hide    : () => this.setState({ show: false }),
			toggle  : this.toggle,
			isShown : () => this.state.show,
			element : () => this.container.current,
			menu    : () => menuRef ? menuRef.current : this.container.current
		})

		// // Hide on `Back`/`Forward` navigation.
		// window.addEventListener('popstate', this.hide)
	}

	componentWillUnmount()
	{
		this.unregister()

		// window.removeEventListener('popstate', this.hide)
	}

	// componentDidUpdate(prevProps)
	// {
	// 	const { isOpen } = this.props

	// 	if (prevProps.isOpen && !isOpen) {
	// 		this.hide()
	// 	} else if (!prevProps.isOpen && isOpen) {
	// 		this.show()
	// 	}
	// }

	toggle = (show, callback) => {
		const { onCollapse, onExpand } = this.props
		if (show === undefined) {
			show = !this.state.show
		}
		if (show) {
			onExpand && onExpand()
		} else {
			onCollapse && onCollapse()
		}
		this.setState({ show }, callback)
	}

	hide = () =>
	{
		const { toggleMenu } = this.props
		const { show } = this.state

		if (show) {
			toggleMenu()
		}
	}

	onKeyDown = (event) => {
		const { toggleMenu } = this.props
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}
		switch (event.keyCode) {
			// Collapse on "Escape".
			case 27:
				event.preventDefault()
				return toggleMenu()
		}
	}

	onBlur = (event) => this.onFocusOutRef.onBlur(event)

	storeOnFocusOutRef = (ref) => this.onFocusOutRef = ref
	getContainerNode = () => this.container.current

	onFocusOut = () => {
		const { toggleMenu } = this.props
		toggleMenu(false)
	}

	render()
	{
		const {
			anchor,
			fullscreen,
			getTogglerNode,
			className,
			children,
			// rest
			menuRef,
			onExpand,
			onCollapse,
			toggleMenu,
			registerMenu,
			...rest
		} = this.props

		const { show } = this.state

		// ARIA menu notes:
		// https://www.w3.org/TR/wai-aria-practices/examples/menu-button/menu-button-links.html

		// `tabIndex="-1"` is for calling `this.container.current.focus()`
		// when no `menuRef` is supplied.

		const element = (
			<div
				{ ...rest }
				ref={ this.container }
				aria-hidden={ !show }
				tabIndex={ -1 }
				onBlur={ this.onBlur }
				onKeyDown={ this.onKeyDown }
				className={ classNames(
					className,
					/* Developers can define custom `:focus` style for the slideout menu. */
					/* (or better add `menuRef` property pointing to a component having `.focus()` method). */
					'rrui__outline',
					'rrui__slideout-menu',
					{
						'rrui__slideout-menu--left'       : anchor === 'left',
						'rrui__slideout-menu--right'      : anchor === 'right',
						'rrui__slideout-menu--top'        : anchor === 'top',
						'rrui__slideout-menu--bottom'     : anchor === 'bottom',
						'rrui__slideout-menu--fullscreen' : fullscreen,
						'rrui__slideout-menu--expanded'   : show
					}
				) }>
				{ children }
			</div>
		)

		return (
			<OnFocusOut
				ref={this.storeOnFocusOutRef}
				getContainerNode={this.getContainerNode}
				getTogglerNode={getTogglerNode}
				onFocusOut={this.onFocusOut}>
				{element}
			</OnFocusOut>
		)
	}
}