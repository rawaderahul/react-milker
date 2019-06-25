import React from 'react'
import { Form, Button, Icon,  Row, Col, message } from 'antd';
import csv from 'csv';
import ReactFileReader from 'react-file-reader';
import { CSVLink } from "react-csv";
import * as CsvSheet from '../services/customer/csvSheet';

class CreateCustomersForms extends React.Component {
  constructor() {
    super();
    this.state = {
      demoDataSource:[],
      csvDataSource:[],
      sheets:[],
      blankSheets:[],
      blankDataSource:[],
      CreateCustomersData:[],
      CreateRoutesData:[]
    }
  }
    
  componentDidMount() {
    let CreateCustomersData = JSON.parse(sessionStorage.getItem('CreateCustomersData'))
    let CreateRoutesData = JSON.parse(sessionStorage.getItem('CreateRoutesData'))
    
      if(CreateRoutesData) {
        this.setState({CreateRoutesData})
      }
      if(CreateCustomersData) {
        this.props.flag();
        this.setState({CreateCustomersData})
      }

    CsvSheet.getDemoSheet().then((response) => {
      this.setState({demoDataSource:response.data})
    })
    
    CsvSheet.getBlankSheet().then((response) => {
      this.setState({blankDataSource:response.data})
    })
  }

  handleFiles = (files,routeName) => {
    if(files[0].name === `${routeName}.csv`) {
      var reader = new FileReader();
    reader.onload = (e) => {
    csv.parse(reader.result, (err, data) => {
      this.setState({csvDataSource:data})
      this.addCustomer(routeName);
    });
    }
  
    reader.readAsText(files[0]);
    }
    else {
      message.error("Choose valid file to upload")
    }
  }

  addCustomer=(routeName) => {
    const {csvDataSource,CreateCustomersData}= this.state;
      if(csvDataSource) { 
      csvDataSource.map((item,index) => {
        if(index!==0){
          CreateCustomersData.push({
          "routeName":routeName,
          "customerName":item[0],
          "address":item[1],
          "pincode":Number(item[2]),
          "contact":Number(item[3]),
          "email":item[4],
          "paymentType":item[5],
          "buffaloQuantity":Number(item[6]),
          "cowQuantity":Number(item[7])
          })
        }
        return 0;
      })
      this.setState({CreateCustomersData})
      console.log(this.state.CreateCustomersData);
      this.props.flag()

      window.sessionStorage.setItem("CreateCustomersData", JSON.stringify(CreateCustomersData));
    } 
  }

  exportCSV = (sheetName) => {
    var csvRow = [];
    var head = [['customerName','address','pincode','contact','email','paymentType','buffaloQuantity','cowQuantity']];
    var record = this.state.blankDataSource;
  
    for(var item = 0; item < record.length; item++) {
      head.push([record[item].customerName,record[item].address, record[item].pincode,record[item].contact,record[item].email,record[item].paymentType,record[item].buffaloQuantity,record[item].cowQuantity]);
    }
    for(var i = 0; i<head.length; ++i) {
      csvRow.push(head[i].join(",")) ;
    }
    var csvString = csvRow.join("%0A");
    var headAppend = document.createElement("a");
    headAppend.href = 'data:attachment/csv,' + csvString;
    headAppend.target = "_Blank";
    headAppend.download = `${sheetName}.csv`
    document.body.appendChild(headAppend);
    headAppend.click();
    console.log(csvString);
  }

  render(){
    return(
      <div className="formbox">
        <h2> Step 4:  Create Customers </h2>
        <div>
          <Row>
            <Col span={12} >
              {this.state.CreateRoutesData && 
              this.state.CreateRoutesData.map((item,index) => {
              return(
                <div key = {index}>
                  <h3> Download {item.routeName} blank template </h3>
                  <Row>
                  <Col span={12} >
                    <Button type="primary"  onClick = {() => this.exportCSV(item.routeName)}>
                        Download {item.routeName} blank Sheet
                    </Button>
                  </Col>
                  <Col span={12} >
                    <ReactFileReader handleFiles = {(e) => this.handleFiles(e,item.routeName)} fileTypes={'.csv'} >
                      <Button >
                        <Icon type="inbox" /> Upload {item.routeName} blank Sheet
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
                data = {this.state.demoDataSource}
                filename = {"demo-sheet.csv"}
                target = "_blank"
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
