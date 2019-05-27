import React,{Component} from 'react'
import { Form, Input, Button, Upload, Icon,   Select, Checkbox,  Row, Col, message } from 'antd';
import axios from 'axios';
// import Workbook from 'react-excel-workbook';
import csv from 'csv';
import ReactFileReader from 'react-file-reader';
// import CSVReader from "react-csv-reader";
// import excelToJson from 'convert-excel-to-json';
// import fs from 'fs';
// import file from './demo.xlsx'
// import XLSX  from 'xlsx'
import csvToJson from 'convert-csv-to-json';
import { CSVLink } from "react-csv";
class CreateCustomersForms extends React.Component {
    constructor() {
        super();
        this.state={
            demoDataSource:[],
            csvDataSource:[],
            sheets:[],
            blankSheets:[],
            blankDataSource:[],
            CreateCustomer:[]
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
            this.setState({demoDataSource:response.data})
          })
          axios.get('http://localhost:3005/BlankSheet').then((response) => {
            this.setState({blankDataSource:response.data})
          })
          axios.get('http://localhost:3005/CreateCustomer').then((response) => {
            this.setState({CreateCustomer:response.data})
          })
      }

      handleFiles = (files,routeName) => {
        console.log("1",files[0].name,"2",routeName);
        if(files[0].name===`${routeName}.csv`) {
           var reader = new FileReader();
        reader.onload = (e) => {
        csv.parse(reader.result, (err, data) => {
          this.setState({csvDataSource:data})
          this.addCustomer();
        });
      }
      reader.readAsText(files[0]);
        }
        else {
          message.error("Choose valid file to upload")
        }
       
    }
    addCustomer=() => {
        if(this.state.csvDataSource) {
        this.state.csvDataSource.map((item,index) => {
         if(index!==0){
           var data={
            // "distributerid":item[0],
            // "routeid":item[1],
            "customerName":item[0],
            "address":item[1],
            "pincode":item[2],
            "contact":item[3],
            "email":item[4],
            "paymentType":item[5],
           }
           data.distributerid=1;
           data.routeid=1;
           console.log(data);
           
           axios.post("http://localhost:3005/Customer",data)
           .then((response) => {
           })
         }
        })
      } 
      }
      exportCSV = (sheetName) => {
        var csvRow=[];
        var A =[['customerName','address','pincode','contact','email','paymentType']];
        var re=this.state.blankDataSource;
     
        for(var item=0; item < re.length; item++) {
          A.push([re[item].customerName,re[item].address, re[item].pincode,re[item].contact,re[item].email,re[item].paymentType]);
        }
        for(var i=0; i<A.length; ++i) {
         csvRow.push(A[i].join(",")) ;
        }
        var csvString=csvRow.join("%0A");
        var a=document.createElement("a");
        a.href='data:attachment/csv,' + csvString;
        a.target="_Blank";
        a.download=`${sheetName}.csv`
        document.body.appendChild(a);
        a.click();
        console.log(csvString);
        
       }
    render(){
        // const { getFieldDecorator } = this.props.form;
        return(
            <div className="formbox">
                <h2> Step 4:  Create Customers </h2>
                <div>
                    <Row>
                        <Col span={12} >
                                {this.state.CreateCustomer && 
                                this.state.CreateCustomer.map((item) => {
                                  return(
                                    <div>
                                      <h3> Download {item.routeName} blank template </h3>
                                      <Row>
                                      <Col span={12} >
                                              <Button type="primary"  onClick={() => this.exportCSV(item.routeName)}>
                                                  Download {item.routeName} blank Sheet
                                              </Button>
                                      </Col>
                                      <Col span={12} >
                                        <ReactFileReader handleFiles={(e) => this.handleFiles(e,item.routeName)} fileTypes={'.csv'} >
                                            <Button >
                                              <Icon type="inbox"  />Upload {item.routeName} blank Sheet
                                              </Button>
                                        </ReactFileReader>
                                      </Col>
                                      </Row>  
                                      <br/>
                                    </div>
                                    
                                  )
                                  
                                }) } 
                          
                            <br/>
                            
                        </Col>
                        <Col span={12}> 
                            <h3> Demo Sheet for understand how to write data in sheet  </h3>  
                             <CSVLink
                                data={this.state.demoDataSource}
                                filename={"demo-sheet.csv"}
                                target="_blank"
                              >
                                 <Button type="primary" >
                                    Download Demo Sheet
                                 </Button>
                              </CSVLink>
                        </Col>
                    </Row>
                   < br />
                    
                </div>
            </div>
        )
    }

 
}

const CreateCustomers = Form.create({ name: 'dynamic_rule' })(CreateCustomersForms);
export default CreateCustomers;
