import React from 'react'
import { Form,Input,Modal, Select } from 'antd';
const { Option } = Select;

class ModalForm extends React.Component {
  constructor(props){
    super(props);
  }
  addNewWorker = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.distributerid = 1;
        // values.routeid = 1;
        this.props.addNewWorker(values);
       }
    }); 
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal
          title = "Add Worker"
          visible = { true }
          onOk = { this.addNewWorker }
          onCancel = { this.props.handleOk }
          okText = "Save"
          cancelText = "Cancel"
        >
          <Form>
            <Form.Item
              label = "Worker Name"
              labelCol = {{ span: 6 }}
              wrapperCol = {{ span: 12 }}
            >
              {getFieldDecorator('workerName', {
                rules: [
                  { required: true, message: 'Please enter worker name!' },
                  { pattern: '[A-Za-z]', message: 'Please enter only characters!' }
                ],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              label = "Worker Contact"
              labelCol = {{ span: 6 }}
              wrapperCol = {{ span: 12 }}
            >
              {getFieldDecorator('contact', {
                rules: [
                  { required: true, message: 'Please enter contact number' },
                  { max: 10 , message: "Please enter 10 digit number" },
                  { pattern:'[0-9]', message: "Please enter only number"}
                ],
              })(
                <Input style = {{ width: '100%'}} />
              )}
            </Form.Item>
            <Form.Item
             label = "Route Number"
             labelCol = {{ span: 6 }}
             wrapperCol = {{ span: 12 }}
            >
            { getFieldDecorator('routeid', {
                rules: [
                  { required: true, message: 'Please select route!' },
                ],
              })(
                <Select
                  style = {{ width: '100%' }}>
                    {
                    this.props.routeData &&  this.props.routeData.map((item) => {
                      return <Option value = { item.rid }> { item.routeName } </Option>
                    })
                    }
                </Select>
              ) } 
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

const WorkerModal = Form.create({ name: 'ModalPage' })(ModalForm);
export default WorkerModal;