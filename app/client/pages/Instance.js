import React               from 'react'
import { Container,
          Row,
          Col,
          Badge,
          Button,
          CardBody,
          CardTitle,
          CardSubtitle,
          CardText,
          Modal,
          ModalHeader,
          ModalBody,
          ModalFooter,
          Table }           from 'reactstrap'
import dateformat           from 'dateformat'
import timeAgo              from 'epoch-timeago'
import config               from '../config'
import JsModal              from '../components/JsModal'
import NbModal              from '../components/NbModal'
import TaskResult           from '../components/TaskResultItem'
import * as ApiDispatcher   from '../actions/ApiActions'
import InstanceStore        from '../stores/InstanceStore'

export default class Instance extends React.Component {
  constructor(props) {
    super(props)
    this.state = {modal: false}
    this.setInstance()
  }

  setInstance = async () => {
    this.setState({instance: await InstanceStore.getInstance(this.props.match.params.instanceId)})
  }

  modalToggle = () => {
    this.setState({
      modal: !this.state.modal
    })
  }

  deleteConfirm = () => {
    ApiDispatcher.dispatch('DELETE_INSTANCE', this.state._id)
    this.modalToggle()
    this.props.history.goBack()
  }

  render() {
    if (this.state.instance) {
      let instance = this.state.instance
      let badgeColor = 'primary'
      if (instance.status === 'done')
        badgeColor = 'secondary'
      if (instance.status === 'error')
        badgeColor = 'danger'

      return (
        <Container>
          <Row>
            <Col md="3">
              <CardBody className={'border border-secondary'}>
                <Row>
                  <Col>
                    <Badge color={badgeColor}>{instance.status}</Badge> <b>Instance ID:</b> {instance._id}
                  </Col>
                </Row>
                <Row>
                  <Col>
                     <b>Blueprint:</b> {instance.blueprint.name}
                  </Col>
                </Row>
                <Row>
                  <Col>
                     <b>Started:</b> {dateformat(instance.created, config.dateFormat)}
                  </Col>
                </Row>
                <Row>
                  <Col>
                     <b>Last Updated:</b> {timeAgo(new Date(instance.created))}
                  </Col>
                </Row>
                <Row style={{marginTop:'20px'}}>
                  <Col>
                    <JsModal js={instance} title="raw instance" label="view raw"/>
                  </Col>
                  <Col>
                    <Button outline={true} color={'danger'} onClick={this.modalToggle}>delete</Button>
                    <Modal isOpen={this.state.modal} toggle={this.modalToggle}>
                      <ModalHeader>Instance Delete</ModalHeader>
                      <ModalBody>Delete instance ({instance._id})?</ModalBody>
                      <ModalFooter>
                        <Button color="danger" onClick={this.deleteConfirm}>Confirm</Button>{' '}
                        <Button color="secondary" onClick={this.modalToggle}>Cancel</Button>
                      </ModalFooter>
                    </Modal>
                  </Col>
                </Row>
              </CardBody>
                <CardBody className={'border border-secondary'}>
                  <CardTitle>Initial Context</CardTitle>
                  <JsModal js={instance.initialContext || {}} title={'view'}/>
                </CardBody>
                <CardBody className={'border border-secondary'}>
                  <CardTitle>Global Document</CardTitle>
                  <JsModal js={instance.global || {}} title={'view'}/>
                </CardBody>
            </Col>
            <Col lg="auto">
              <Row>
              <Col>
                <CardBody className={'border border-secondary'}>
                  <CardTitle>Task Results</CardTitle>
                  <Table>
                    <thead>
                      <tr>
                        <th>Task #</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {instance.taskResults.map((result, index) => <TaskResult ref={index} key={index} index={index}
                                            name={instance.blueprint.tasks[index].name} {...result}/>)}
                    </tbody>
                  </Table>
                </CardBody>
              </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      )
    } else {
      return null
    }
  }
}
