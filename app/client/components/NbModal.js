import React            from 'react'
import axios            from 'axios'
//import Notebook         from 'react-notebook'
import { Button,
          Modal,
          ModalHeader,
          ModalBody,
          ModalFooter } from 'reactstrap'
import AlertStore       from '../stores/AlertStore'

export default class NbModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {...props}
    this.state.modal = false
  }


  toggle = async () => {
    this.setState({
      modal: !this.state.modal
    })

    if (!this.state.modal && !this.state.js)
      this.loadJs()
  }

  render() {
    return (
      <div>
        <Button outline={true} color="primary" onClick={this.toggle}>{this.state.label || 'view'}</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{this.state.title}</ModalHeader>
          <ModalBody>

          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}
