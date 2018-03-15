import React                from 'react'
import { ButtonDropdown,
        DropdownToggle,
        DropdownMenu,
        DropdownItem }      from 'reactstrap'
import  * as ApiDispatcher  from '../actions/ApiActions'

export default class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dropdownOpen: false,
      disabled: false,
      title: props.title,
      color: props.color,
      actions: props.actions
    }
  }

  updateStatus = (status) => {
      this.setState({title: status.title,
                    actions: status.actions,
                    color: status.color,
                    disabled: false})
  }

  fireAction = (action) => {
    ApiDispatcher.dispatch(action.apiAction, action.triggerName)
    this.setState({
      disabled: true
    })
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }

  render() {
    return (
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret color={this.state.color} disabled={this.state.disabled}>
          {this.state.title}
        </DropdownToggle>
        <DropdownMenu>
          {this.state.actions.map((action) => <DropdownItem key={action.triggerName} onClick={() => this.fireAction(action)}>{action.buttonName}</DropdownItem>)}
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}
