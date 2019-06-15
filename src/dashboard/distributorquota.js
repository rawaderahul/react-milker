import React,{ Component } from 'react'
import axios from 'axios'
import { Table, Input, InputNumber, Popconfirm, Form, Button,DatePicker  } from 'antd';
import moment from 'moment';
import * as DistributorQuota from '../services/distributorInfo';
import * as CustomersInfoer from '../services/customerInfo'
import CustomerModal from './modals/customer'
import Quotabuffalo from './quotabuffalo';
import Quotacow from './quotacow'
import './stylesheets/distributorquota.css'

var dataTo=null;

const EditableContext = React.createContext();

const { RangePicker } = DatePicker;

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        data:null ,
        DistributorQuotaData: [],
        editingid: '' ,
        visible:false,
        todaysDate: null,
        dataTo: null
    };
    this.columns = [
      {
        title: 'Daily',
        children:[
          {
            title:'Route Name',
            align:'center',
            dataIndex: 'routeName',
            width: '20%',
            editable: true,
          }
        ],
      },
      {
        title: 'Quota - 100',
        children:[
          {
            title:'Buffalo',
            align:'center',
            dataIndex: 'buffalo',
            width: '15%',
            editable: true,
          }
        ]
      },
      {
        title: 'Quota - 80',
        children:[
          {
            title:'Cow',
            align:'center',
            dataIndex: 'cow',
            width: '15%',
            editable: true,
          }
        ]
      },
      {
        title: 'Manage Buffalo',
        dataIndex: 'manageBuffalo',
        width: '15%',
        editable: true,
      },
      {
        title: 'Manage Cow',
        dataIndex: 'manageCow',
        width: '15%',
        editable: true,
       
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingid } = this.state;
          const editable = this.isEditing(record);
          const deletable=this.isDeleting(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                { form => (
                  <a
                    href="javascript:;"
                    onClick={() => this.save(form, record.id)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.id)}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <span>
              <a visible="hidden" disabled={editingid !== ''} onClick={() => this.edit(record.id)}>
                Edit
              </a>{" "}{" "} 
            {  
            <a disabled={deletable !== ''} onClick={() => this.delete(record.id)}>Delete</a> && 
               <Popconfirm title="Sure to delete?" onConfirm={() => this.delete(record.id)}>
                   <a to="javascript:;">Delete</a>
                </Popconfirm>
            }
            </span>
          );
        },
      },
    ];
  }

  isDeleting=record => record.id === this.state.editingid;

  delete = (id) => {
  axios.delete("http://127.0.0.1:8000/api/Customer/"+id).then((response)=>{
  })
  }
  componentDidMount() {
    var totalbuffalo = 0;
    var totalcow = 0;
    var totalData = {};
    const {DistributorQuotaData} = this.state;

    let addColumn1 = {
      id: 400,
      routeName:<b>Should Sell / Manage </b>,
      buffalo: 2,
      cow: 0,
      manageBuffalo: 3,
      manageCow: 0
    }
    let addColumn2 = {
      id: 401,
      routeName:<b>More Purchase </b>,
      buffalo: 0,
      cow: 5,
      manageBuffalo: 0,
      manageCow: 0
    }
    
    DistributorQuota.getDistributorQuota()
      .then((res)=>{
        res.data.map((item)=>{
          totalbuffalo = totalbuffalo + item.buffalo;
          totalcow = totalcow + item.cow;
           totalData = {
            id: 402,
            routeName:<b>Total </b>,
            buffalo: totalbuffalo,
            cow: totalcow,
            manageBuffalo: 0,
            manageCow: 0
          }
        })
        res.data.push(totalData);
        res.data.push(addColumn1);
        res.data.push(addColumn2);
       this.setState({DistributorQuotaData : res.data });
      })
      // this.state.DistributorQuotaData.push();
      // this.setState({DistributorQuotaData})
  }
  
  totalBuffalo = () =>{
    var value = 0;
    const { DistributorQuotaData } = this.state;
    this.state.DistributorQuotaData.map((item)=>{
      value = value + item.buffalo;
    })
    return value;
  }

  isEditing = record => record.id === this.state.editingid;

  cancel = () => {
    this.setState({ editingid: '' });
  };

  save(form, id) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newRow = row;
      // row.rid = 1;
      const newData = [...this.state.DistributorQuotaData];
      const index = newData.findIndex(item => id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        CustomersInfoer.putCustomerInfo(this.state.editingid,newRow)
          .then((res)=>{
            this.setState({DistributorQuotaData: newData, editingid: '' })
          })
        } 
      else {
        newData.push(row);
        this.setState({ DistributorQuotaData: newData, editingid: '' });
      }
    });
  }

  edit(id) {
    this.setState({ editingid: id });
  }

  addCustomer = () => {
    this.setState({visible:true});
  }

  addNewCustomer = (event) => {
    CustomersInfoer.postCustomerInfo(event)
     .then((response) => {
    })
    this.setState({
    visible: false,
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
    });
  };


  render() {

    
    var date = new Date();
     dataTo = {defaultValue:moment(date)} 
    const { size,DistributorQuotaData } = this.state;
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),

        }),
      };
    });
    
    return (
      <div>
      <EditableContext.Provider value={this.props.form}>
        {/* <Button onClick={this.addCustomer} shape="round" size="large"  type="primary" style={{ marginBottom: 16 }}>
          Add Customer
        </Button> */}
          <div style={{ display: "flex" , justifyContent: "space-between"}}>
            <DatePicker onChange={(e,value)=>{this.setState({todaysDate : value})}} defaultValue={moment(date)} size={size} style={{ marginBottom: 16 }} shape="round" />
            <h3>Today {this.state.todaysDate}  </h3>
            <Button> Next Day </Button>
          </div>
         
        {/*onChange={(e,value)=>{this.setState({todaysDate : value})}}}*/}
        <Table
          rowKey="id" 
          components={components}
          bordered
          dataSource={DistributorQuotaData}
          columns={columns}
          rowClassName="editable-row"
          colSpan={2}
          pagination={false}
         
        />
       {
         this.state.visible ? <CustomerModal 
         addNewCustomer={this.addNewCustomer}
         hideModal={this.hideModal}
      /> : null
       } 
      </EditableContext.Provider>
      <p><b>Edit :- could not less but can increase till ( Sell / Manage )</b> </p>
      <Quotabuffalo />
      <Quotacow />
      </div>
    );
  }
}

const Distributorquota = Form.create()(EditableTable);

export default Distributorquota;