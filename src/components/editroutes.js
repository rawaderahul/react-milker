import React, { Component } from 'react'
import { Form, Input,Select,Modal} from 'antd';

const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };
  
  function handleChange(value) {
    // console.log(`selected ${value}`);
  }
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
                
                  <Form.Item {...formItemLayout} label="Enter Route Name">
            {getFieldDecorator('routeName', {
              initialValue:this.props.editableData.routeName,
                rules: [
                {
                    required: true,
                    message: 'Please input your Route name',
                },
                ],
            })(<Input placeholder="Please input your Route name" />)}
            </Form.Item>

        <Form.Item {...formItemLayout} label="Select Route  Areas" >
                {getFieldDecorator('routeAreas', {
                  initialValue:this.props.editableData.routeAreas,
                    rules: [{ required: true, message: 'Please select Route  areas!' }],
                })(
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Please select Route  areas!"
                        onChange={handleChange}
                    >
                        {this.props.areas}
                    </Select>,
                )}
        </Form.Item>

        <Form.Item {...formItemLayout} label=" Select Route Pincodes" >
                {getFieldDecorator('routePincodes', {
                  initialValue:this.props.editableData.routePincodes,
                    rules: [{ required: true, message: 'Please Select Route  Pincodes' }],
                })(
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Please Select Route  Pincodes"
                    >
                        {this.props.pincodes}
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