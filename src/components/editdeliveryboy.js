import React, { Component } from 'react'
import { Form, Input, Button, Select,Row, Col,message,Icon,Modal} from 'antd';

const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };
  
class Edit extends Component {
    handleOk=() => {
        this.props.form.validateFields((err,values) => {
            if (!err) {
                console.log(values);
                values.id=this.props.editableData.id;
                this.props.handleOk(values);
                this.props.form.resetFields();
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        
        return (
            <div>
                   <Modal
                title="Basic Modal"
                visible={true}
                onOk={this.handleOk}
                onCancel={this.props.handleCancel}
              >
                
                <Form.Item {...formItemLayout} label="Enter Delivery Boy Name">
                    {getFieldDecorator('workerName', {
                        initialValue:this.props.editableData.workerName,
                        rules: [
                        {required: true,message: 'Please Enter Delivery Boy Name',},
                        { pattern: '[A-Za-z]', message: 'Please enter only characters!' }
                        ],
                    })(<Input placeholder="Please Enter Delivery Boy Name" />)}
                </Form.Item>
                <Form.Item {...formItemLayout} label="Phone Number">
                    {getFieldDecorator('contact', {
                        initialValue:this.props.editableData.contact,

                        rules: [
                          { required: true, message: 'Please input your phone number!' },
                          { pattern : '[0-9]', message: 'Please enter only digit!' },
                          { max: 10, message: 'Please enter 10 digit number' }
                        ],
                    })(<Input   placeholder="Please input your phone number!" />)}
                </Form.Item>
                <Form.Item {...formItemLayout} label="Select Route Name" >
                {getFieldDecorator('route', {
                        initialValue:this.props.editableData.route,

                    rules: [{ required: true, message: 'Select Route Name' }],
                })(
                    <Select placeholder="Please Select Route Name">
                    {this.props.routes}
                    </Select>,
                )}
                </Form.Item>
                    
              </Modal>
            </div>
        )
    }
}
const EditRoutes = Form.create({ name: 'dynamic_rule' })(Edit);
export default EditRoutes;