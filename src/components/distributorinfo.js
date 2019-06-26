import React from 'react'
import { Form, Input, Button, Select, Row, Col} from 'antd';
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
            name:null,
            email:null,
            contact:null,
            address:null,
            state:[],
            city:[],
            area:[],
            pincode:[],
            serviceAreas:[],
            servicePincodes:[],
            DistributorInfoData:{},
            dailyCowQuota: null,
            dailyBuffaloQuota:null,
            selectedItems: [],
        }
    }
   componentWillReceiveProps(nextProps) {
       if(nextProps.clicked) {
        this.check();
       }
   }
 
    componentDidMount() {
        console.log("did",this.props.form);
      
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
                name : DistributorInfoData.name ,
                email: DistributorInfoData.email,
                contact: DistributorInfoData.contact,
                address: DistributorInfoData.address ,
                state: DistributorInfoData.state ,
                city: DistributorInfoData.city, 
                area: DistributorInfoData.area ,
                pincode:DistributorInfoData.pincode ,
                serviceAreas:DistributorInfoData.serviceAreas,
                servicePincodes:DistributorInfoData.servicePincodes,
                dailyBuffaloQuota:DistributorInfoData.dailyBuffaloQuota,
                dailyCowQuota:DistributorInfoData.dailyCowQuota,
                deliveryCharge:DistributorInfoData.deliveryCharge
            }) 
        }
    }
    
    check = () => {
        this.props.form.validateFields((err,values) => {
            if (!err) {
                this.setState({
                    DistributorInfoData:values,
                })
                this.props.next();
            this.props.form.resetFields();
            
        window.sessionStorage.setItem("DistributorInfoData", JSON.stringify(values));
        }
        });
        this.props.handleChange()
    };

    handleChange = selectedItems => {
        this.setState({ selectedItems });
    };
    
    render() {
        let areasfilteredOptions=[];
        let pincodesfilteredOptions=[]
        const { getFieldDecorator } = this.props.form;
        const { selectedItems,locationData } = this.state;
        
        if(locationData.length > 0) {
            areasfilteredOptions =  locationData[0].area.filter(o => !selectedItems.includes(o)) ;
            pincodesfilteredOptions =  locationData[0].pincode.filter(o => !selectedItems.includes(o)) ;
        }
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
                                {required: true,message: 'Please enter your company name'},
                                { pattern: '[A-Za-z]', message: 'Please enter only characters!' }
                                ],
                            })(<Input placeholder="Please input company name" />)}
                            </Form.Item>

                            <Form.Item {...formItemLayout} label="Name">
                            {getFieldDecorator('name', {
                                initialValue:this.state.name,
                                rules: [
                                    {required: true,message: 'Please enter your name'},
                                    { pattern: '[A-Za-z]', message: 'Please enter only characters!' }
                                ],
                            })(<Input placeholder="Please input your name" />)}
                            </Form.Item>

                            <Form.Item {...formItemLayout} label="Email">
                            {getFieldDecorator('email', {
                                initialValue:this.state.email,
                                rules: [
                                    {type :'email', message: 'The input is not valid e-mail' },
                                    {required: true,message: 'Please enter your e-mail'},
                                ],
                            })(<Input placeholder = "Please input your e-mail" />)}
                            </Form.Item>

                            <Form.Item {...formItemLayout} label="Phone Number">
                            {getFieldDecorator('contact', {
                                initialValue:this.state.contact,
                                rules: [
                                    { required: true, message: 'Please enter your phone number!' },
                                    { pattern : '[0-9]', message: 'Please enter only digit!' },
                                    { max: 10, message: 'Please enter 10 digit number' }
                            ],
                            })(<Input placeholder = "Please input your phone number!" style={{ width: '100%' }} />)}
                            </Form.Item>

                            <Form.Item {...formItemLayout} label="Address">
                            {getFieldDecorator('address', {
                                initialValue:this.state.address,
                                rules: [
                                    {required: true,message: 'Please enter your address',},
                                ],
                            })(<Input placeholder="Please input address" />)}
                            </Form.Item>

                            <Form.Item {...formItemLayout} label="State">

                            {getFieldDecorator('state', {
                                initialValue:this.state.state,
                                rules: [
                                    { required: true, message: 'Please select your state!' }
                                ],
                            })(
                                <Select placeholder="Please select state" 
                                showSearch>
                                
                                {this.state.states}
                                </Select>,
                            )}
                            </Form.Item>

                            <Form.Item {...formItemLayout} label="City" >
                            {getFieldDecorator('city', {
                                initialValue:this.state.city,
                                rules: [
                                    { required: true, message: 'Please select your city!' }
                                ],
                            })(
                                <Select placeholder="Please select city"
                                showSearch>
                                {this.state.citys}
                                </Select>,
                            )}
                            </Form.Item>

                            <Form.Item {...formItemLayout} label="Area"  >
                            {getFieldDecorator('area', {
                                initialValue:this.state.area,
                                rules: [
                                    { required: true, message: 'Please select your area!' }
                                ],
                            })(
                                <Select placeholder="Please select area"
                                showSearch>
                                {this.state.areas}
                                </Select>,
                            )}
                            </Form.Item>

                            <Form.Item {...formItemLayout} label="Pincode">
                            {getFieldDecorator('pincode', {
                                initialValue:this.state.pincode,
                                rules: [
                                    { required: true, message: 'Please select your pincode!' }
                                ],
                            })(
                                <Select placeholder="Please select pincode"
                                showSearch>
                                {this.state.pincodes}
                                </Select>,
                            )}
                            </Form.Item>    

                            <Form.Item {...formTailLayout}>
                            </Form.Item>
                        </Col>
                        
                        <Col span={12}>
                            <Form.Item {...formItemLayout} label="Daily Buffalo Quota">
                                {getFieldDecorator('dailyBuffaloQuota', {
                                    initialValue:this.state.dailyBuffaloQuota,
                                    rules: [
                                        { required: true, message: 'Please enter only number' },
                                        { pattern : '[0-9]', message: 'Please enter only digit!' },
                                ],
                                })(<Input placeholder = "Please input Buffalo quota!" style={{ width: '100%' }} />)}
                            </Form.Item>

                            <Form.Item {...formItemLayout} label="Daily Cow Quota">
                                {getFieldDecorator('dailyCowQuota', {
                                    initialValue:this.state.dailyCowQuota,
                                    rules: [
                                        { required: true, message: 'Please enter only number' },
                                        { pattern : '[0-9]', message: 'Please enter only digit!' },
                                ],
                                })(<Input placeholder = "Please input Cow quota!" style={{ width: '100%' }} />)}
                            </Form.Item>

                            <Form.Item {...formItemLayout} label="Delivery Charge">
                                {getFieldDecorator('deliveryCharge', {
                                    initialValue:this.state.deliveryCharge,
                                    rules: [
                                        { required: true, message: 'Please enter only number' },
                                        { pattern : '[0-9]', message: 'Please enter only digit!' },
                                ],
                                })(<Input placeholder = "Please input delivery charge!" style={{ width: '100%' }} />)}
                            </Form.Item>

                            <Form.Item {...formItemLayout} label=" Service Areas" >
                                    {getFieldDecorator('serviceAreas', {
                                        initialValue:this.state.serviceAreas,
                                        rules: [
                                            { required: true, message: 'Please select your service areas!' }
                                        ],
                                    })(
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    onChange={this.handleChange}
                                    placeholder="Please select service areas!"
                                >
                                    {areasfilteredOptions.map(item => (
                                <Select.Option key={item} value={item}>
                                        {item}
                                </Select.Option>
                                        ))}
                                </Select>,
                                        )}
                            </Form.Item>

                            <Form.Item {...formItemLayout} label=" Service Pincodes" >
                                {getFieldDecorator('servicePincodes', {
                                    initialValue:this.state.servicePincodes,
                                    rules: [
                                        { required: true, message: 'Please select your service pincodes!' }
                                    ],
                                })(
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="Please select service pincodes!"
                                    onChange={this.handleChange}
                                >
                                    {pincodesfilteredOptions.map(item => (
                                <Select.Option key={item} value={item}>
                                        {item}
                                </Select.Option>
                                        ))}
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