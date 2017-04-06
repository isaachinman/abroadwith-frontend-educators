export default (fieldObject) => {
  return this.setState({
    validatedFields: Object.assign({}, this.state.validatedFields, fieldObject),
  })
}
