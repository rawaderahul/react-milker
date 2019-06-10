import React from 'react'
import axios from 'axios'
import { Form, Select, Input, Button,Modal,InputNumber } from 'antd';
const { TextArea } = Input;

class ModalForm extends React.Component {

  addNewWorker = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.distributerid = 1;
        values.routeid = 1;
        this.props.addNewWorker(values);
       }
    }); 
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal
          title="Add Worker"
          visible={true}
          onOk={this.addNewWorker}
          onCancel={this.props.handleOk}
          okText="Save"
          cancelText="Cancel"
        >
          <Form >
            <Form.Item
              label="Name"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              {getFieldDecorator('workerName', {
                rules: [{ required: true, message: 'Please enter worker name!' },
                        { pattern: '[A-Za-z]', message: 'Please enter only characters!' }
              ],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              label="Contact"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              {getFieldDecorator('contact', {
                rules: [{ required: true, message: 'Please enter contact number' },
                       { pattern: '[0-9]', message:'Please enter only digit'}
                      ],
              })(
                <InputNumber style = {{ width: '100%'}} />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

const WorkerModal = Form.create({ name: 'ModalPage' })(ModalForm);
export default WorkerModal;