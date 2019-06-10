import React from 'react'
import { Form, Input, Button, Select, Row, Col,message } from 'antd';
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


class DistributorInfoDataForm extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            locationData:[],
            states:[],
            citys:[],
            areas:[],
            pincodes:[],

            organizationName:null,
            firstName:null,
            lastName:null,
            contact:null,
            address:null,
            state:[],
            city:[],
            area:[],
            pincode:[],
            serviceAreas:[],
            servicePincodes:[],
            DistributorInfoData:{}
        }
    }
    
   
    componentDidMount() {
        axios.get("http://localhost:3005/location").then((response) => {
        this.setState({locationData:response.data})

        for(let data in this.state.locationData[0]) {
            if(data === 'state') {
                this.state.locationData[0][data].map((item,index) =>{
                    return(
                        this.state.states.push(<Option value={item} key={index}>{item}</Option>) 
                    )
                })
            }
            else if(data === 'city') {
                this.state.locationData[0][data].map((item,index) =>{
                    return(
                        this.state.citys.push(<Option value={item} key={index}>{item}</Option>) 
                    )
                })
            }
            else if(data === 'area') {
                this.state.locationData[0][data].map((item,index) =>{
                    return(
                        this.state.areas.push(<Option value={item} key={index}>{item}</Option>) 
                    )
                })
            }
            else if(data === 'pincode') {
                this.state.locationData[0][data].map((item,index) =>{
                    return(
                        this.state.pincodes.push(<Option value={item} key={index}>{item}</Option>) 
                    )
                })
            }
            }
        })
        
        
        let DistributorInfoData = JSON.parse(sessionStorage.getItem('DistributorInfoData'))

        if(DistributorInfoData) {
            this.props.flag()
            this.setState({
                organizationName: DistributorInfoData.organizationName,
                firstName:DistributorInfoData.firstName, 
                lastName: DistributorInfoData.lastName ,
                contact: DistributorInfoData.contact,
                address: DistributorInfoData.address ,
                state: DistributorInfoData.state ,
                city: DistributorInfoData.city, 
                area: DistributorInfoData.area ,
                pincode:DistributorInfoData.pincode ,
                serviceAreas:DistributorInfoData.serviceAreas,
                servicePincodes:DistributorInfoData.servicePincodes,

            }) 

        }

    }
    
    
  check = () => {
    this.props.form.validateFields((err,values) => {

        if (!err) {
            values.deliveryCharge = 0;
            values.email= "trush@gmail.com";
            this.setState({
                DistributorInfoData:values,
                organizationName:null,
                firstName:null,
                lastName:null,
                contact:null,
                address:null,
                state:[],
                city:[],
                area:[],
                pincode:[],
                serviceAreas:[],
                servicePincodes:[],
            })
            this.props.flag()

           this.props.form.resetFields();
           
    window.sessionStorage.setItem("DistributorInfoData", JSON.stringify(values));

      }
    });

  };

  render() {
    const { getFieldDecorator } = this.props.form;
    
    return (
      <div>
      <div className="formbox">
      <h2> Step 1: Distributor Information  </h2>
        <Row>
            <Col span={12}>
                <Form.Item {...formItemLayout} label="Company Name">
                {getFieldDecorator('organizationName', {
                    initialValue:this.state.organizationName ,
                    rules: [
                    {required: true,message: 'Please input your company name'},
                    { pattern: '[A-Za-z]', message: 'Please enter only characters!' }
                    ],
                })(<Input placeholder="Please input company name" />)}
                </Form.Item>

                    <Form.Item {...formItemLayout} label="First Name">
                    {getFieldDecorator('firstName', {
                        initialValue:this.state.firstName,
                        rules: [
                            {required: true,message: 'Please input first name'},
                            { pattern: '[A-Za-z]', message: 'Please enter only characters!' }
                        ],
                    })(<Input placeholder="Please input first name" />)}
                    </Form.Item>

                    <Form.Item {...formItemLayout} label="Last Name">
                    {getFieldDecorator('lastName', {
                        initialValue:this.state.lastName,
                        rules: [
                            {required: true,message: 'Please input last name'},
                            { pattern: '[A-Za-z]', message: 'Please enter only characters!' }
                        ],
                    })(<Input placeholder="Please input last name" />)}
                    </Form.Item>

                    <Form.Item {...formItemLayout} label="Phone Number">
                    {getFieldDecorator('contact', {
                        initialValue:this.state.contact,
                        rules: [
                            { required: true, message: 'Please input your phone number!' },
                            { pattern : '[0-9]', message: 'Please enter only digit!' },
                            { max: 10, message: 'Please enter 10 digit number' }
                    ],
                    })(<Input placeholder = "Please input your phone number!" style={{ width: '100%' }} />)}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="Address">
                    {getFieldDecorator('address', {
                        initialValue:this.state.address,
                        rules: [
                            {required: true,message: 'Please input address',},
                        ],
                    })(<Input placeholder="Please input address" />)}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="Select State">

                    {getFieldDecorator('state', {
                        initialValue:this.state.state,
                        rules: [
                            { required: true, message: 'Please select state!' }
                        ],
                    })(
                        <Select placeholder="Please select state" >
                        {/* <Option value="maharastra">Maharastra</Option>
                        <Option value="gujrat">Gujrat</Option> */}
                        {this.state.states}
                        </Select>,
                    )}
                    </Form.Item>

                    <Form.Item {...formItemLayout} label="Select City" >
                    {getFieldDecorator('city', {
                        initialValue:this.state.city,
                        rules: [
                            { required: true, message: 'Please select city!' }
                        ],
                    })(
                        <Select placeholder="Please select city">
                        {this.state.citys}
                        </Select>,
                    )}
                    </Form.Item>

                    <Form.Item {...formItemLayout} label="Select Area"  >
                    {getFieldDecorator('area', {
                        initialValue:this.state.area,
                        rules: [
                            { required: true, message: 'Please select area!' }
                        ],
                    })(
                        <Select placeholder="Please select area">
                        {this.state.areas}
                        </Select>,
                    )}
                    </Form.Item>

                    <Form.Item {...formItemLayout} label="Select Pincode">
                    {getFieldDecorator('pincode', {
                        initialValue:this.state.pincode,
                        rules: [
                            { required: true, message: 'Please select area!' }
                        ],
                    })(
                        <Select placeholder="Please select area">
                        {this.state.pincodes}
                        </Select>,
                    )}
                    </Form.Item>    

                    <Form.Item {...formTailLayout}>
                    <Button type="primary" onClick={this.check}>
                        Check
                    </Button>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item {...formItemLayout} label=" Service Areas" >
                            {getFieldDecorator('serviceAreas', {
                                initialValue:this.state.serviceAreas,
                                rules: [
                                    { required: true, message: 'Please select Distributor areas!' }
                                ],
                            })(
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Please select Distributor areas!"
                        >
                            {this.state.areas}
                        </Select>,
                                )}
                    </Form.Item>

                    <Form.Item {...formItemLayout} label=" Service Pincodes" >
                        {getFieldDecorator('servicePincodes', {
                            initialValue:this.state.servicePincodes,
                            rules: [
                                { required: true, message: 'Please select Distributor Pincodes!' }
                            ],
                        })(
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Please select Distributor Pincodes!"
                            // onChange={handleChange}
                        >
                            {this.state.pincodes}
                        </Select>,
                        )}
                    </Form.Item>        
                </Col>
            </Row>    
        </div>
        </div>
        );
    }
}

const DistributorInfoData = Form.create({ name: 'dynamic_rule' })(DistributorInfoDataForm);
export default DistributorInfoData;