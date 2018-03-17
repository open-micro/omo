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
    InstanceStore.removeListener("instances", this.setInstances)
    this.state.pollInstances = false
  }

  componentWillMount = async () => {
    this.setInstances(await InstanceStore.fetchInstances())
    InstanceStore.on("instances", this.setInstances)
    this.setState({pollInstances: true})
    this.pollInstances()
  }

  setInstances = (instances) => {
    console.log(instances)
    if (!instances)
      console.log('NO INSTANCES')
    else {
      this.setState({instances: instances})
      instances.forEach((instance) => {
        if (this.refs[instance._id]) {
          this.refs[instance._id].update(instance)
        }
      })
    }
  }

  pollInstances = () => {
      setTimeout(() => {
        ApiDispatcher.dispatch('UPDATE_INSTANCES')
        if (this.state.pollInstances)
          this.pollInstances()
      }, 2000)
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
              {this.state.instances.map((instance) => <InstanceItem ref={instance._id} key={instance._id} {...instance}/>)}
             </tbody>
           </Table>
          </Col>
        </Row>
      </Container>
    )
  }
}
