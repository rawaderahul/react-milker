import React from 'react'
import { Form, Input, Button, Select,Row, Col,message,Icon,Modal} from 'antd';
import axios from 'axios';
import EditRoutes from './editroutes';
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
}

class CreateRoutesInfoForm extends React.Component {
  constructor() {
    super();
    this.state = {
      locationData:[],
            areas:[],
            pincodes:[],
            routeData:[],
            CreateRoutesData:[],
            routeName:'',
            routeAreas:[],
            routePincodes:[],
            editableData:{},
            isEdit:false,


    }
  }
  componentDidMount() {
    let DistributorInfoData=JSON.parse(sessionStorage.getItem('DistributorInfoData'))
    let CreateRoutesData=JSON.parse(sessionStorage.getItem('CreateRoutesData'))

    if(CreateRoutesData) {
      this.setState({CreateRoutesData})
      this.props.flag()
     }
   else if(DistributorInfoData) {
      DistributorInfoData.serviceAreas.map((menu,index) => {
        return(
          this.state.areas.push(<Option value={menu} key={index}>{menu}</Option>) 
          )
        })
        DistributorInfoData.servicePincodes.map((menu,index) => {
          return(
            this.state.pincodes.push(<Option value={menu} key={index}>{menu}</Option>) 
            )
          })
        }
    }
    
    showModal = (item,index) => {
      item.id=index;
      this.setState({
        editableData:item,
        isEdit:true,

      });
    };
    handleOk = (values) => {
      this.state.CreateRoutesData.splice(values.id,1)
      delete values.id;
      this.state.CreateRoutesData.push(values)
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
        this.state.CreateRoutesData.push(values);
        this.props.flag()
        window.sessionStorage.setItem("CreateRoutesData", JSON.stringify(this.state.CreateRoutesData));
        this.props.form.resetFields();
      }
    });
  };
  
  edit = (item) => {
      this.setState({
        routeName:item.routeName,
        routeAreas:item.routeAreas,
        routePincodes:item.routePincodes
      })
   
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
              initialValue:this.state.routeName,
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
                  initialValue:this.state.routeAreas,
                    rules: [{ required: true, message: 'Please select Route  areas!' }],
                })(
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Please select Route  areas!"
                        onChange={handleChange}
                    >
                        {this.state.areas}
                    </Select>,
                )}
        </Form.Item>

        <Form.Item {...formItemLayout} label=" Select Route Pincodes" >
                {getFieldDecorator('routePincodes', {
                  initialValue:this.state.routePincodes,
                    rules: [{ required: true, message: 'Please Select Route  Pincodes' }],
                })(
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Please Select Route  Pincodes"
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
                this.state.CreateRoutesData.length > 0 ? this.state.CreateRoutesData.map((item,index) => {
                  return (
                  <span style={{ fontSize: '15px'}} key={index}>
                       Route <b>{item.routeName}</b> is created for {item.routeAreas} areas 
                        <Icon type="edit" style={{ fontSize: '30px', color: '#08c' }} onClick={() => this.showModal(item,index)}/><br></br>
                  </span>
                  )
                }) :null
              }
             {this.state.isEdit ?
               <EditRoutes handleOk={this.handleOk} handleCancel={this.handleCancel} handleCancel={this.handleCancel}
               editableData={this.state.editableData} pincodes={this.state.pincodes} areas={this.state.areas}
               /> : null}

             </Col>
        </Row>    
      </div>
      </div>
    );
  }
}


const CreateRoutes = Form.create({ name: 'dynamic_rule' })(CreateRoutesInfoForm);
export default CreateRoutes;

