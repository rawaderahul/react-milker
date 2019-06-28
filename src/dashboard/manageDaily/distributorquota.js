import React,{ Component } from 'react'
import { Table, Input, InputNumber, Popconfirm, Form, Button,DatePicker  } from 'antd';
import moment from 'moment';
import * as DistributorQuota from '../../services/distributor/distributorQuota';
import * as DistributorInfo from '../../services/distributor/distributorInfo';
import * as CustomersInfoer from '../../services/customer/customerInfo';
import CustomerModal from '../modals/customer';
import Quotabuffalo from './quotabuffalo';
import Quotacow from './quotacow';
import '../stylesheets/distributorquota.css';

var dataTo=null;
var datas = 120;
const EditableContext = React.createContext();

const { RangePicker } = DatePicker;

class EditableCell extends React.Component {
  getInput = () => {
      return <InputNumber />;
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
                  message: 'Please Input `${title}`',
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
        dataTo: null,
        distributorInfo: null,
        cowQuota:null,
        buffaloQuota: null,
    };
  }

  isDeleting=record => record.id === this.state.editingid;

  // delete = (id) => {
  // axios.delete("http://127.0.0.1:8000/api/Customer/"+id).then((response)=>{
  // })
  // }

  componentDidMount() {
    var distributerid = JSON.parse(sessionStorage.getItem('distributerid'))
    if(!distributerid) {
      window.sessionStorage.setItem("distributerid",1);
      var distributerid = JSON.parse(sessionStorage.getItem('distributerid'))
    }
    console.log(distributerid); 
    
    var totalbuffalo = 0;
    var totalcow = 0;
    var totalData = {};
    var totalManageBuffalo = 0;
    var totalManageCow = 0;
    const {DistributorQuotaData} = this.state;

    let addColumn1 = {
      RouteName:<b>Should Sell / Manage </b>,
      id: 400,
      Buffalo: 2,
      Cow: 0,
      manageBuffalo: 0,
      manageCow: 0
    }

    let addColumn2 = {
      id: 401,
      RouteName:<b>More Purchase </b>,
      Buffalo: 0,
      Cow: 5,
      manageBuffalo: 0,
      manageCow: 0
    }
    
    DistributorQuota.getDistributorQuota(distributerid)
      .then((res)=>{
        console.log(res.data);
        res.data.map((item)=>{
          totalbuffalo = totalbuffalo + item.buffalo;
          totalcow = totalcow + item.cow;
          totalManageBuffalo = totalManageBuffalo + item.manageBuffalo;
          totalManageCow = totalManageCow + item.manageCow;
           totalData = {
            id: 402,
            RouteName:<b>Total </b>,
            Buffalo: totalbuffalo,
            Cow: totalcow,
            manageBuffalo: totalManageBuffalo,
            manageCow: totalManageCow
          }
        })
        res.data.push(totalData);
        res.data.push(addColumn1);
        res.data.push(addColumn2);
       this.setState({DistributorQuotaData : res.data });
      })

      DistributorInfo.getPerticluarDistributorInfo(distributerid).then((response)=>{
        this.setState({distributorInfo: response.data})
        console.log("Distributer info",this.state.distributorInfo);
        this.state.distributorInfo.map((item)=>{
          this.setState({ cowQuota : item.dailyCowQuota })
          this.setState({ buffaloQuota : item.dailyBuffaloQuota})
        })
        console.log(this.state.cowQuota);
      })
      
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
      const newData = [...this.state.DistributorQuotaData];
      const index = newData.findIndex(item => id === item.id);
      if (index > -1) {
        const item = newData[index];
        row.buffalo = item.buffalo;
        row.cow = item.cow;
        row.routeName = item.routeName;
        row.remainsBuffalo = item.remainsBuffalo;
        row.remainsCow = item.remainsCow;
        row. totalRoutes = item.totalRoutes; 
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        DistributorQuota.putDistributorQuota(this.state.editingid,newRow)
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

  render() {
    console.log(this.state.DistributorQuotaData);
    
   let columns = [
      {
        title: 'Daily',
        children:[
          {
            title:'Route Name',
            align:'center',
            dataIndex: 'RouteName',
            width: '20%',
            editable: true,
          }
        ],
      },
      {
        title: <span> Quota - { this.state.buffaloQuota } </span>,
        children:[
          {
            title:'Buffalo',
            align:'center',
            dataIndex: 'Buffalow',
            width: '15%',
            editable: true,
          }
        ]
      },
      {
        title: <span> Quota - { this.state.cowQuota } </span>,
        children:[
          {
            title:'Cow',
            align:'center',
            dataIndex: 'COW',
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
          const deletable = this.isDeleting(record);
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
            // <a disabled={deletable !== ''} onClick={() => this.delete(record.id)}>Delete</a> && 
            //    <Popconfirm title="Sure to delete?" onConfirm={() => this.delete(record.id)}>
            //        <a to="javascript:;">Delete</a>
            //     </Popconfirm>
            }
            </span>
          );
        },
      },
    ];

    var date = new Date();
     dataTo = {defaultValue:moment(date)} 
    const { size,DistributorQuotaData } = this.state;
    const components = {
      body: {
        cell: EditableCell,
      },
    };

     columns = columns.map(col => {
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
      <br/>
      <br/>
      <br/>
      
      {/* <p><b>Edit :- could not less but can increase till ( Sell / Manage )</b> </p> */}
      <Quotabuffalo buffaloQuota = { this.state.buffaloQuota } />
      <Quotacow cowQuota = { this.state.cowQuota } />

      </div>
    );
  }
}

const Distributorquota = Form.create()(EditableTable);

export default Distributorquota;