import React from 'react'
import { Form, Input, Button, Select,Row, Col,message } from 'antd';
import axios from 'axios';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 8 },
};
const { Option } = Select;

class CreateDeliveryBoysForm extends React.Component {
  constructor() {
    super();
    this.state = {
      routesData:[],
      routes:[],
      boyCreate:false,
      boyData:[]
    }
  }
  componentDidMount() {
    axios.get('http://localhost:3005/Route').then((response)=> {
      this.setState({routesData:response.data})
      this.state.routesData.map((data,index) => {
        return(
          this.state.routes.push(<Option value={data.routenumber} key={index}>{data.routenumber}</Option>)
        )
      })
    })
  }

  boyCreated=()=> {
    return <span>Delivery boy <b>{this.state.boyData.workerName}</b> is created for <b>{this.state.boyData.route}</b> areas </span>
  }
  check = () => {
    this.props.form.validateFields((err,values) => {
      if (!err) {
        this.props.nextFlag("data");
        values.distributerid = 1;
        values.routeid = 7; 
         axios.post('http://127.0.0.1:8000/api/WorkerDetail',values).then((response) => {
          message.success("All information of Route created succesfully")
          this.setState({boyCreate:true,boyData:values})
          this.props.form.resetFields();
         })
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
        <div>
      <div className="formbox">
      <h2> Step 3:  Create Delivery Boy   </h2>
        <Row>
            <Col span={12}>
                <Form.Item {...formItemLayout} label="Enter Delivery Boy Name">
                    {getFieldDecorator('workerName', {
                        rules: [
                        {required: true,message: 'Please Enter Delivery Boy Name',},
                        { pattern: '[A-Za-z]', message: 'Please enter only characters!' }
                        ],
                    })(<Input placeholder="Please Enter Delivery Boy Name" />)}
                </Form.Item>
                <Form.Item {...formItemLayout} label="Phone Number">
                    {getFieldDecorator('contact', {
                        rules: [
                          { required: true, message: 'Please input your phone number!' },
                          { pattern : '[0-9]', message: 'Please enter only digit!' },
                          { max: 10, message: 'Please enter 10 digit number' }
                        ],
                    })(<Input   placeholder="Please input your phone number!" />)}
                </Form.Item>
                <Form.Item {...formItemLayout} label="Select Route Name" hasFeedback>
                {getFieldDecorator('route', {
                    rules: [{ required: true, message: 'Select Route Name' }],
                })(
                    <Select placeholder="Please Select Route Name">
                    {this.state.routes}
                    </Select>,
                )}
                </Form.Item>
                <Form.Item {...formTailLayout}>
                    <Button type="primary" onClick={this.check}>
                    Create Delivery Boy 
                    </Button>
                </Form.Item>
            </Col>
            <Col span={12}>
              {
                this.state.boyCreate ? this.boyCreated() :null
              }
            </Col>
        </Row>    
      </div>
      </div>
    );
  }
}

const CreateDeliveryBoys = Form.create({ name: 'dynamic_rule' })(CreateDeliveryBoysForm);
export default CreateDeliveryBoys;
