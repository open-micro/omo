import React                from "react"
import { Container,
          Row,
          Col,
          Button,
          Modal,
          ModalHeader,
          ModalBody,
          ModalFooter }     from 'reactstrap'
import JsModal              from './JsModal'
import AlertStore           from '../stores/AlertStore'
import FileDownload         from 'js-file-download'
import axios                from "axios"

export default class BlueprintItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {...props}
    this.state.fetchUrl = window.host + '/instance/file/'
  }

  isFile = () => {
      return this.state.type === 'file'
  }

  download = async () => {
    axios.post(window.host + '/instance/fileDownload', {file: this.state.data}).then((response) => {
      FileDownload(response.data, 'task' + this.state.index + '.txt')
    }, (err) => {
      console.log(err)
      AlertStore.createAlert(err)
    })
  }

  render() {
    return (
        <tr>
          <td>
            {'task ' + this.state.index} {this.isFile() && ('(file download)')}
          </td>
          {!this.isFile() && (
            <td>
              <JsModal js={this.state.data} title={'task ' + this.state.index}/>
            </td>
          )}
          {this.isFile() && (
            <td>
              <Button outline={true} color="primary" onClick={this.download}>download</Button>
            </td>
          )}
        </tr>
    )
  }
}
