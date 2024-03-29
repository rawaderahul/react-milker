import React from 'react'
import { Form, Input, Button, Select,Row, Col,Icon} from 'antd';
import EditDeliveryBoy from './modal/editdeliveryboy';

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
      CreateDeliveryBoysData:[],
      editableData:{},
      isEdit:false
    }
  }
  componentDidMount() {
    let CreateRoutesData=JSON.parse(sessionStorage.getItem('CreateRoutesData'))
    let CreateDeliveryBoysData=JSON.parse(sessionStorage.getItem('CreateDeliveryBoysData'))

    if(CreateDeliveryBoysData) {
      this.props.flag()
      this.setState({CreateDeliveryBoysData})
    }
    if(CreateRoutesData) {
      CreateRoutesData.map((item,index) => {
        return(
          this.state.routes.push(<Option value={item.routeName} key={index}>{item.routeName}</Option>)
        )
      })
    }
  }

  showModal = (item,index) => {
    item.id = index;
    this.setState({
      editableData:item,
      isEdit:true,
    });
  };

  handleOk = (values) => {
    console.log(values);
    this.state.CreateDeliveryBoysData.splice(values.id,1)
    delete values.id;
    this.state.CreateDeliveryBoysData.push(values)
    this.setState({
      isEdit:false,
    });
  };

  handleCancel = () => {
    this.setState({
      isEdit:false,
    });
  };
  
  check = () => {
    this.props.form.validateFields((err,values) => {
      if (!err) {
        this.state.CreateDeliveryBoysData.push(values)
        this.props.flag()
        window.sessionStorage.setItem("CreateDeliveryBoysData", JSON.stringify(this.state.CreateDeliveryBoysData));
        this.props.form.resetFields();
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
              <Form.Item {...formItemLayout} label="Delivery Boy Name">
                {getFieldDecorator('workerName', {
                  rules: [
                  {required: true,message: 'Please enter delivery boy name',},
                  { pattern: '[A-Za-z]', message: 'Please enter only characters!' }
                  ],
                })(<Input placeholder="Please input delivery boy name" />)}
              </Form.Item>

              <Form.Item {...formItemLayout} label="Phone Number">
                {getFieldDecorator('contact', {
                  rules: [
                    { required: true, message: 'Please enter phone number!' },
                    { pattern : '[0-9]', message: 'Please enter only digit!' },
                    { max: 10, message: 'Please enter 10 digit number' }
                  ],
                })(<Input   placeholder="Please input phone number!" />)}
              </Form.Item>

              <Form.Item {...formItemLayout} label="Route Number">
              {getFieldDecorator('route', {
                rules: [{ required: true, message: 'Please select route number' }],
              })(
                <Select placeholder="Please input select route number">
                {this.state.routes}
                </Select>
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
                this.state.CreateDeliveryBoysData.length > 0 ? this.state.CreateDeliveryBoysData.map((item,index) => {
                  return (
                  <span style={{ fontSize: '15px'}} key={index}>
                        Boy <b>{item.workerName}</b> is created for {item.route} areas 
                        <Icon type="edit" style={{ fontSize: '30px', color: '#08c' }} onClick={() => this.showModal(item,index)}/><br></br>
                  </span>
                  )
                }) :null
              }
              {this.state.isEdit ?
                <EditDeliveryBoy handleOk={this.handleOk} handleCancel={this.handleCancel}
                editableData={this.state.editableData} routes={this.state.routes} 
                /> : null}
            </Col>
          </Row>    
        </div>
      </div>
    );
  }
}

const CreateDeliveryBoys = Form.create({ name: 'dynamic_rule' })(CreateDeliveryBoysForm);
export default CreateDeliveryBoys;
