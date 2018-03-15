import React                from "react"
import { Button,
          Modal,
          ModalHeader,
          ModalBody,
          ModalFooter }     from 'reactstrap'
import dateformat           from 'dateformat'
import JsModal              from './JsModal'
import * as ApiDispatcher   from '../actions/ApiActions'

export default class BlueprintItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {...props}
    this.state.fetchUrl = window.host + '/blueprint/name/' + props.name
    this.state.modal = false
  }

  modalToggle = () => {
    this.setState({
      modal: !this.state.modal
    })
  }

  startConfirm = () => {
    ApiDispatcher.dispatch('START_BLUEPRINT', this.state._id)
    this.modalToggle()
  }

  render() {
    return (
     <tr>
       <th scope="row">{this.state.name}</th>
       <td>{this.state.triggerName}</td>
       <td>{dateformat(this.state.updated)}</td>
       <td><JsModal fetchUrl={this.state.fetchUrl} title={'Blueprint'}/></td>
       <td>
         <Button outline={true} color={'success'} size={'small'} onClick={this.modalToggle}>start</Button>
         <Modal isOpen={this.state.modal} toggle={this.modalToggle}>
           <ModalHeader>Blueprint</ModalHeader>
           <ModalBody>{'Start blueprint ' + this.state.name + '?'}</ModalBody>
           <ModalFooter>
             <Button color="danger" onClick={this.startConfirm}>Confirm</Button>{' '}
             <Button color="secondary" onClick={this.modalToggle}>Cancel</Button>
           </ModalFooter>
         </Modal>
        </td>
     </tr>
    )
  }
}
