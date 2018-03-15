import React                from "react"
import { Container,
         Row,
         Col,
         Button,
         Modal,
         ModalHeader,
         ModalBody,
         ModalFooter,
         Table }            from 'reactstrap'
import axios                from 'axios'
import InstanceItem         from '../components/InstanceItem'
import AlertStore           from '../stores/AlertStore'
import InstanceStore        from '../stores/InstanceStore'
import Instance             from './Instance'
import * as ApiDispatcher   from '../actions/ApiActions'

export default class Instances extends React.Component {
  constructor(props) {
    super(props)
    this.state = {instances: [], modal: false}
  }

  componentWillUnmount() {
    InstanceStore.removeListener("instances", this.getInstances);
  }

  componentWillMount = async () => {
    this.getInstances()
    InstanceStore.on("instances", this.getInstances)
  }

  getInstances = async () => {
    try {
      this.setState({instances: (await axios.get(window.host + '/instance')).data})
    } catch (err) {
      console.log(err)
      AlertStore.createAlert(err)
    }
  }

  modalToggle = () => {
    this.setState({
      modal: !this.state.modal
    })
  }

  deleteConfirm = () => {
    ApiDispatcher.dispatch('DELETE_DONE_INSTANCES')
    this.modalToggle()
  }

  render() {
    return (
      <Container>
        <Row>
          <Col xs="2">
            <Button outline={true} color={'danger'} size={'small'} onClick={this.modalToggle}>delete<br/>done<br/>instances</Button>
            <Modal isOpen={this.state.modal} toggle={this.modalToggle}>
              <ModalHeader>Instance Delete</ModalHeader>
              <ModalBody>Delete all done instances?</ModalBody>
              <ModalFooter>
                <Button color="danger" onClick={this.deleteConfirm}>Confirm</Button>{' '}
                <Button color="secondary" onClick={this.modalToggle}>Cancel</Button>
              </ModalFooter>
            </Modal>
          </Col>
          <Col>
            <Table>
             <thead>
               <tr>
                 <th>Blueprint</th>
                 <th>Started</th>
                 <th>Updated</th>
                 <th>Current Step</th>
                 <th>Manage</th>
               </tr>
             </thead>
             <tbody>
              {this.state.instances.map((instance) => <InstanceItem key={instance._id} {...instance}/>)}
             </tbody>
           </Table>
          </Col>
        </Row>
      </Container>
    )
  }
}
