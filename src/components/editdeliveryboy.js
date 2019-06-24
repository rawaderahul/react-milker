import React, { Component } from 'react'
import { Form, Input,Select,Modal} from 'antd';

const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };
  
class Edit extends Component {

    handleOk = () => {
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
                    title="Worker Modal"
                    visible={true}
                    onOk={this.handleOk}
                    onCancel={this.props.handleCancel}
                >
                    <Form.Item {...formItemLayout} label="Name">
                        {getFieldDecorator('workerName', {
                            initialValue:this.props.editableData.workerName,
                            rules: [
                            {required: true,message: 'Please enter delivery boy name',},
                            { pattern: '[A-Za-z]', message: 'Please enter only characters!' }
                            ],
                        })(<Input placeholder="Please input delivery boy name" />)}
                    </Form.Item>

                    <Form.Item {...formItemLayout} label="Phone Number">
                        {getFieldDecorator('contact', {
                            initialValue:this.props.editableData.contact,

                            rules: [
                            { required: true, message: 'Please enter your phone number!' },
                            { pattern : '[0-9]', message: 'Please enter only digit!' },
                            { max: 10, message: 'Please enter 10 digit number' }
                            ],
                        })(<Input   placeholder="Please input your phone number!" />)}
                    </Form.Item>

                    <Form.Item {...formItemLayout} label="Route Number" >
                    {getFieldDecorator('route', {
                        initialValue:this.props.editableData.route,
                        rules: [{ required: true, message: 'Select route number' }],
                    })(
                        <Select placeholder="Please select route number">
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