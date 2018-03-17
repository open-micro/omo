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
import TaskResult           from '../components/TaskResult'
import * as ApiDispatcher   from '../actions/ApiActions'

export default class Instance extends React.Component {
  constructor(props) {
    super(props)
    this.state = {...props.location.state.instance}
    this.state.modal = false
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
    let badgeColor = 'primary'
    if (this.state.status === 'done')
      badgeColor = 'secondary'
    if (this.state.status === 'error')
      badgeColor = 'danger'

    return (
      <Container>
        <Row>
          <Col md="3">
          <CardBody className={'border border-secondary'}>
            <Row>
              <Col>
                <Badge color={badgeColor}>{this.state.status}</Badge> <b>Instance ID:</b> {this.state._id}
              </Col>
            </Row>
            <Row>
              <Col>
                 <b>Blueprint:</b> {this.state.blueprint.name}
              </Col>
            </Row>
            <Row>
              <Col>
                 <b>Started:</b> {dateformat(this.state.created, config.dateFormat)}
              </Col>
            </Row>
            <Row>
              <Col>
                 <b>Last Updated:</b> {timeAgo(new Date(this.state.created))}
              </Col>
            </Row>
            <Row style={{marginTop:'20px'}}>
              <Col>
                <JsModal js={this.state} title="raw instance" label="view raw instance"/>
              </Col>
            </Row>
            <Row style={{marginTop:'20px'}}>
              <Col>
                <Button outline={true} color={'danger'} onClick={this.modalToggle}>delete</Button>
                <Modal isOpen={this.state.modal} toggle={this.modalToggle}>
                  <ModalHeader>Instance Delete</ModalHeader>
                  <ModalBody>Delete instance ({this.state._id})?</ModalBody>
                  <ModalFooter>
                    <Button color="danger" onClick={this.deleteConfirm}>Confirm</Button>{' '}
                    <Button color="secondary" onClick={this.modalToggle}>Cancel</Button>
                  </ModalFooter>
                </Modal>
              </Col>
            </Row>
          </CardBody>
        </Col>
          <Col lg="auto">
            <Row>
            <Col>
              <CardBody className={'border border-secondary'}>
                <CardTitle>Task Results</CardTitle>
                <Table>
                  <tbody>
                    {this.state.taskResults.map((result, index) => <TaskResult ref={index} key={index} index={index} {...result}/>)}
                  </tbody>
                </Table>
              </CardBody>
            </Col>
              <Col>
                <CardBody className={'border border-secondary'}>
                  <CardTitle>Initial Context</CardTitle>
                  <JsModal js={this.state.initialContext || {}} title={'view'}/>
                </CardBody>
              </Col>
              <Col>
                <CardBody className={'border border-secondary'}>
                  <CardTitle>Global Document</CardTitle>
                  <JsModal js={this.state.global || {}} title={'view'}/>
                </CardBody>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
}
