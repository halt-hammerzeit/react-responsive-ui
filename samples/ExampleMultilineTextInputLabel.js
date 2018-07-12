window.ExampleMultilineTextInputLabel = React.createClass
({
	getInitialState() { return {} },

	render()
	{
		return (
			<Example name="multiline-text-input-floating-label" title="Multiline Text Input">

					<TextInput
						multiline
						name="description"
						style={input_style}
						className="column-width"
						value={this.state.value}
						onChange={value => this.setState({ value })}
						label="Text"/>

					Value:  {this.state.value}

<Highlight lang="jsx">{`
<TextInput
  multiline
  label="Text"
  value={...}
  onChange={...} />
`}</Highlight>

<Highlight lang="css">{`
/* See \`variables.css\` for height/padding customization. */
`}</Highlight>

			</Example>
		)
	}
})