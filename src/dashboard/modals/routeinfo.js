import React,{Component} from 'react'
import { Modal,Input, Form ,Select} from 'antd';

const { Option} = Select;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};

class ModalForm extends Component{ 

  addNewRoute=()=> {
    this.props.form.validateFields((err,values) => {
      if(!err) {
        values.distributerid = 1;
        values.routeAreas=values.routeAreas.join(",");
        values.routePincodes=values.routePincodes.join(",");
      this.props.addNewRoute(values)
      }
    })
  }

  render() {
    
  const { getFieldDecorator } = this.props.form;
  return (
    <div>
      <Modal
        title="Modal"
        visible={true}
        onOk={this.addNewRoute}
        onCancel={this.props.hideModal}
        okText="Save"
        cancelText="Cancel"
      >
           <Form.Item {...formItemLayout} label="Enter Route Name">
            {getFieldDecorator('routeName', {
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
                    rules: [{ required: true, message: 'Please select Route  areas!' }],
                })(
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Please select Route  areas!"
                    >
                        {this.props.areas.map((item) => {
                          return(
                            <Option key={item}>{item}</Option>
                          )
                        })}
                    </Select>,
                )}
        </Form.Item>

        <Form.Item {...formItemLayout} label=" Select Route Pincodes" >
                {getFieldDecorator('routePincodes', {
                    rules: [{ required: true, message: 'Please Select Route  Pincodes' }],
                })(
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Please Select Route  Pincodes"
                    >
                     {this.props.pincodes.map((item) => {
                          return(
                            <Option key={item}>{item}</Option>
                          )
                        })}
                    </Select>,
                )}
        </Form.Item> 
                  
      </Modal>
    </div>
  );
  }
}
const RouteModal = Form.create({ name: 'dynamic_rule' })(ModalForm);
export default RouteModal;