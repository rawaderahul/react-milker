import React,{Component} from 'react'
import { Form, Input, Button, Upload, Icon,   Select, Checkbox,  Row, Col } from 'antd';
import axios from 'axios';
import Workbook from 'react-excel-workbook';
import ReactFileReader from 'react-file-reader';

class CreateCustomersForms extends React.Component {
    constructor() {
        super();
        this.state={
            dataSource:[],
            sheets:[],
            blankSheets:[],
            blankDataSource:[]
        }
    }

    normFile = e => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        }
        return e && e.fileList;
      };
    
      componentDidMount() {
        axios.get('http://localhost:3005/DemoSheet').then((response) => {
            this.setState({dataSource:response.data})
            this.state.dataSource.map((item,index)=>{
                for(let entry in item) {
                    this.state.sheets.push(
                    <Workbook.Sheet data={item[entry]} name={entry} key = {index}>
                       <Workbook.Column label="id" value={row => row.id}/>
                       <Workbook.Column label="name" value={row => row.name}/>
                       <Workbook.Column label="buff" value={row => row.buff}/>
                       <Workbook.Column label="cow" value={row => row.cow}/>
                       <Workbook.Column label="date" value={row => row.date}/>
                   </Workbook.Sheet>
                  )
                }
            })
          })
          
          axios.get('http://localhost:3005/BlankSheet').then((response) => {
            this.setState({blankDataSource:response.data})
            this.state.blankDataSource.map((item,index)=>{
                for(let entry in item) {
                    this.state.blankSheets.push(
                    <Workbook.Sheet data={item[entry]} name={entry} key = {index}>
                       <Workbook.Column label="name" value={row => row.id}/>
                       <Workbook.Column label="buff" value={row => row.id}/>
                       <Workbook.Column label="cow" value={row => row.id}/>
                       <Workbook.Column label="date" value={row => row.id}/>
                   </Workbook.Sheet>
                  )
                }
            })
          })
      }
      
    render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <div className="formbox">
                <h2> Step 4:  Create Customers </h2>
                <div>
                    <Row>
                        <Col span={12} >
                            <h3> Download Blank Sheet for Customer List </h3>  
                            <Workbook filename="example.csv" element={
                            <Button type="primary" >
                                Download Blank Sheet
                            </Button>}>
                               {this.state.blankSheets}
                             </Workbook>  
                                               
                        </Col>
                        <Col span={12}> 
                            <h3> Demo Sheet for understand how to write data in sheet  </h3>  
                            <Workbook filename="example.csv" element={
                            <Button type="primary" >
                                Download Demo Sheet
                            </Button>}>
                               {this.state.sheets}
                             </Workbook>    
                            
                        </Col>
                    </Row>
                   < br />
                    <Row>
                        <Col span={24} >
                            <h3> Upload Customer Data Sheet</h3>    
                            <Form.Item label="Upload" >
                                {getFieldDecorator('upload', {
                                    valuePropName: 'fileList',
                                    getValueFromEvent: this.normFile,
                                })(
                                    <Upload name="logo" action="/upload.do" listType="picture">
                                    <Button>
                                        <Icon type="upload" /> Click to upload
                                    </Button>
                                    </Upload>
                                    // <ReactFileReader handleFiles={this.handleFiles} fileTypes={'.csv'} >
                                            
                                    //         <div style={{height:"700" , width:"400", backgroundColor:'orange'}}>

                                    //         <center><Icon type="inbox"  />UPLOAD</center> 
                                    //         </div>
                                    // </ReactFileReader>




                                )}
                            </Form.Item>                            
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }

 
}

const CreateCustomers = Form.create({ name: 'dynamic_rule' })(CreateCustomersForms);
export default CreateCustomers;
