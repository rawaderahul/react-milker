import React,{Component} from 'react'
import { Modal,Input,Form,Select } from 'antd';
import axios from 'axios';
const {Option}=Select;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};

class ModalForm extends Component{ 
state={
  routeData:[]
}
  addNewCustomer=()=> {
    this.props.form.validateFields((err,values) => {
      if(!err) {
        values.distributerid = 1;
      this.props.addNewCustomer(values)
      }
    })
  }

  componentDidMount() {
    axios.get("http://127.0.0.1:8000/api/GetRoutesByDistributerId/1").then((response) => {
      this.setState({routeData:response.data})
    })
  }
  
  render() {
  const { getFieldDecorator } = this.props.form;
  const  {routeData } =this.state;
  return (
    <div>
      <Modal
        title="Modal"
        visible={true}
        onOk={this.addNewCustomer}
        onCancel={this.props.hideModal}
        okText="Save"
        cancelText="Cancel"
      >
        <Form.Item {...formItemLayout} label="Customer Name">
              {getFieldDecorator('customerName', {
                  rules: [
                  {required: true,message: 'Please input your customer name'},
                  { pattern: '[A-Za-z]', message: 'Please enter only characters!' }
                  ],
              })(<Input placeholder="Please input customer name" />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="Address">
                  {getFieldDecorator('address', {
                      rules: [
                          {required: true,message: 'Please input address',},
                      ],
                  })(<Input placeholder="Please input address" />)}
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="Phone Number">
                  {getFieldDecorator('contact', {
                      rules: [
                          { required: true, message: 'Please input your phone number!' },
                          { pattern : '[0-9]', message: 'Please enter only digit!' },
                          { max: 10, message: 'Please enter 10 digit number' }
                  ],
                  })(<Input placeholder = "Please input your phone number!" style={{ width: '100%' }} />)}
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="Pincode">
                  {getFieldDecorator('pincode', {
                      rules: [
                          { required: true, message: 'Please input your pincode!' },
                          { pattern : '[0-9]', message: 'Please enter only digit!' },
                          { max: 6, message: 'Please enter 6 digit number' }
                  ],
                  })(<Input placeholder = "Please input your pincode!" style={{ width: '100%' }} />)}
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="Email">
                  {getFieldDecorator('email', {
                      rules: [
                          { required: true, message: 'Please input your email!' },
                  ],
                  })(<Input type="email" placeholder = "Please input your email!" style={{ width: '100%' }} />)}
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="Payment Type">
              {getFieldDecorator('paymentType', {
                  rules: [
                  {required: true,message: 'Please input paymentType'},
                  { pattern: '[A-Za-z]', message: 'Please enter only characters!' }
                  ],
              })(<Input placeholder="Please input patyment type" />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="Route Name">
              {getFieldDecorator('routeid', {
                  rules: [
                  {required: true,message: 'Please input route name'},
                  ],
              })( <Select
                style={{ width: '100%' }}
                placeholder="Please Select Route  Pincodes"
            >
                { routeData && routeData.map((item) => {
                  return <Option value={item.rid}>{item.routeName}</Option>;
                })}
            </Select>)}
              </Form.Item>
                  
      </Modal>
    </div>
  );
  }
}
const CustomerModal = Form.create({ name: 'dynamic_rule' })(ModalForm);
export default CustomerModal;