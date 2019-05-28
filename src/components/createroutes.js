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
function handleChange(value) {
  // console.log(`selected ${value}`);
}

class CreateRoutesInfoForm extends React.Component {
  constructor() {
    super();
    this.state = {
      locationData:[],
            areas:[],
            pincodes:[],
            routeCreate:false,
            routeData:[],
    }
  }
  componentDidMount() {
    axios.get("http://localhost:3005/Distributer").then((response) => {
      this.setState({locationData:response.data})
      this.state.locationData.map((data) => {
        for(let item in data) {
          if(item==='distributerServiceAreas'){
            data[item].map((menu,index) => {
              return(
                this.state.areas.push(<Option value={menu} key={index}>{menu}</Option>) 
              )
            })
          }
          else if(item==='distributerServicePincodes') {
            data[item].map((menu,index) => {
              return(
                this.state.pincodes.push(<Option value={menu} key={index}>{menu}</Option>) 
              )
           })
          }
        }
      })
    })
    }
    
  check = () => {
    this.props.form.validateFields((err,values) => {
      if (!err) {
        this.props.nextFlag("data");
        values.distributerid = 1;
        values.routeAreas = values.routeAreas.join(',');
        values.routePincodes = values.routePincodes.join(',');
        console.log(values);
        axios.post("http://127.0.0.1:8000/api/Route",values).then((response) => {
          message.success("All information of Route created succesfully")
          this.setState({routeData:values})
          console.log(response.data);
          this.setState({routeCreate:true})
          this.props.form.resetFields();
        })
      }
    });
  };
  routeCreated = () => {
    return <span>Route <b>{this.state.routeData.routeName}</b> is created for {this.state.routeData.routeAreas} areas </span>
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
    <div>
      <div className="formbox">
      <h2> Step 2: Create Routes </h2>
        <Row>
            <Col span={12}>
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

        <Form.Item {...formItemLayout} label="Select Route  Areas" hasFeedback>
                {getFieldDecorator('routeAreas', {
                    rules: [{ required: true, message: 'Please select Route  areas!' }],
                })(
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Please select Route  areas!"
                        // defaultValue={['a10', 'c12']}
                        onChange={handleChange}
                    >
                        {this.state.areas}
                    </Select>,
                )}
        </Form.Item>

        <Form.Item {...formItemLayout} label=" Select Route Pincodes" hasFeedback>
                {getFieldDecorator('routePincodes', {
                    rules: [{ required: true, message: 'Please Select Route  Pincodes' }],
                })(
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Please Select Route  Pincodes"
                        // defaultValue={['a10', 'c12']}
                        onChange={handleChange}
                    >
                        {this.state.pincodes}
                    </Select>,
                )}
        </Form.Item>   
       
        <Form.Item {...formTailLayout}>
          <Button type="primary" onClick={this.check}>
            Create Route
          </Button>
        </Form.Item>

            </Col>
            <Col span={12}>
              {
                this.state.routeCreate ? this.routeCreated() :null
              }
            </Col>
        </Row>    
      </div>
      </div>
    );
  }
}


const CreateRoutes = Form.create({ name: 'dynamic_rule' })(CreateRoutesInfoForm);
export default CreateRoutes;

