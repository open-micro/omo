import React            from 'react'
import axios            from 'axios'
import JSONPretty       from 'react-json-pretty'
import { Button,
          Modal,
          ModalHeader,
          ModalBody,
          ModalFooter } from 'reactstrap'
import AlertStore       from '../stores/AlertStore'

export default class JsModal extends React.Component {
  constructor(props) {
    super(props)
    this.state.js = props.js
  }

  loadJs = async () => {
    try {
      this.setState({js: (await axios.get(this.state.fetchUrl)).data})
    } catch (err) {
      console.log(err)
      AlertStore.createAlert(err)
    }
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
            <JSONPretty id="json-pretty" json={this.state.js}/>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}
