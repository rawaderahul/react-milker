import React,{ Component } from 'react'
import axios from 'axios'
import { Table, Input, InputNumber, Popconfirm, Form, Button,Select } from 'antd';
import * as WholesalerInfo from '../../services/wholesaler/wholesaler';
import CustomerModal from '../modals/customer'

const EditableContext = React.createContext();
const { Option } = Select;

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
      routeData,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <span>
            <Form.Item style={{ margin: 0 }}>
              {dataIndex=='customerName' ?  getFieldDecorator('customerName', {
                rules: [
                  { required: true,message: 'Please input your customer name'},
                  { pattern: '[A-Za-z]', message: 'Please enter only characters!' }
                ],
                initialValue: record['customerName']
                })(<Input placeholder="Please input customer name" />
                ):null
              } 
            </Form.Item>

            <Form.Item style={{ margin: 0 }}>
              {dataIndex=='buffaloQuantity' ?  getFieldDecorator('buffaloQuantity', {
                rules: [
                    { required: true, message: 'Please input buffalo Quantity!' },
                ],
                initialValue: record['buffaloQuantity']
                })(<InputNumber placeholder = "Please input your buffalo Quantity!" style={{ width: '100%' }} />)
                :null
              } 
            </Form.Item>

            <Form.Item style={{ margin: 0 }}>
              {dataIndex=='cowQuantity' ?  getFieldDecorator('cowQuantity', {
                rules: [
                    { required: true, message: 'Please input your cow Quantity!' },
                ],
                initialValue: record['cowQuantity']
                })(<InputNumber placeholder = "Please input your cow Quantity!" style={{ width: '100%' }} />)
                :null
              } 
            </Form.Item>

            <Form.Item style={{ margin: 0 }}>
              {dataIndex=='address' ?  getFieldDecorator('address', {
                rules: [
                  {required: true,message: 'Please input address',},
                ],
                initialValue: record['address']
              })(<Input placeholder="Please input address" />):null
              } 
            </Form.Item>

            <Form.Item style={{ margin: 0 }}>
              {dataIndex=='contact' ?  getFieldDecorator('contact', {
                rules: [
                    { required: true, message: 'Please input your phone number!' },
                    { pattern : '[0-9]', message: 'Please enter only digit!' },
                    { max: 10, message: 'Please enter 10 digit number' }
                ],
                initialValue: record['contact']
                })(<Input placeholder = "Please input your phone number!" style={{ width: '100%' }} />)
                :null
              } 
            </Form.Item>

            <Form.Item style={{ margin: 0 }}>
              {dataIndex=='pincode' ?  getFieldDecorator('pincode', {
                rules: [
                    { required: true, message: 'Please input your pincode!' },
                    { pattern : '[0-9]', message: 'Please enter only digit!' },
                    { max: 6, message: 'Please enter 6 digit number' }
                ],
                initialValue: record['pincode']
                })(<Input placeholder = "Please input your pincode!" style={{ width: '100%' }} />)
                :null
              } 
            </Form.Item>

            <Form.Item style={{ margin: 0 }}>
              {dataIndex=='email' ?  getFieldDecorator('email', {
                rules: [
                    { required: true, message: 'Please input your email!' },
                ],
                initialValue: record['email']
                })(<Input type="email" placeholder = "Please input your email!" style={{ width: '100%' }} />)
                :null
              } 
            </Form.Item>

            <Form.Item style={{ margin: 0 }}>
                {dataIndex=='paymentType' ?  getFieldDecorator('paymentType', {
                  rules: [
                    { required: true,message: 'Please input paymentType'},
                    { pattern: '[A-Za-z]', message: 'Please enter only characters!' }
                  ],
                  initialValue: record['paymentType']
                  })(<Input placeholder="Please input patyment type" />)
                  :null
                } 
            </Form.Item>

            <Form.Item style={{ margin: 0 }}>
              {dataIndex=='routeid' ?  getFieldDecorator('routeid', {
                rules: [
                  { required: true,message: 'Please input route name'},
                ],
                  initialValue: record['routeid']
              })( 
                <Select
                  style={{ width: '100%' }}
                  placeholder="Please Select Route  name"
                >
                  { routeData && routeData.map((item) => {
                    return <Option value={item.rid}>{item.routeName}</Option>;
                  })}
                </Select>)
                :null
              } 
            </Form.Item>
          </span>
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
      wholesalerData: null,
      editingid: '' ,
      visible:false,
      routeData:[]
    };

    this.columns = [
        {
            title: 'Index',
            dataIndex: 'customerName',
            width: '10%',
            editable: true,
        },
        {
            title : 'Route Number',
            width: '10%',
            render : (record,text) => {
                let name = '';
                {
                    this.state.routeData.map((item,index) =>{
                    if(text.routeid == item.rid){
                        name = item.routeName;
                    }
                })
                    return name; 
                }
            },
            align: 'center'

        },
        {
          title: 'Organization Name',
          dataIndex: 'wholesalerOrgnaizationName',
          width: '10%',
          editable: true,
        },
      {
        title: 'Wholesaler Name',
        dataIndex: 'name',
        width: '10%',
        editable: true,
      },
      {
        title: 'Contact',
        dataIndex: 'contact',
        width: '10%',
        editable: true,
      },
      {
        title: 'Address',
        dataIndex: 'address',
        width: '20%',
        editable: true,
      },
      {
        title: 'Pin Code',
        dataIndex: 'pincode',
        width: '10%',
        editable: true,
      },
      {
        title: 'Buffalo',
        dataIndex: 'dailyBuffaloQuota',
        width: '10%',
        editable: true,
      },
      {
        title: 'Buffalo Price',
        width: '10%',
        dataIndex:'buffaloPrice',
        editable: true,
      },
      {
        title: 'Cow',
        dataIndex: 'dailyCowQuota',
        width: '10%',
        editable: true,
      },
      {
        title: 'Cow Price',
        dataIndex: 'cowPrice',
        width: '10%',
        editable: true,
      },
      {
        title: 'Total Price',
        // dataIndex: 'dailyCowQuota',
        width: '10%',
        editable: true,
      },
      
      {
        title: 'Delivery Charge',
        dataIndex: 'deliveryCharge',
        width: '10%',
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
                    onClick={() => this.save(form, record.wid)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </a>
                )}
              </EditableContext.Consumer>

              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.wid)}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <span>
              <a disabled={editingid !== ''} onClick={() => this.edit(record.wid)}>
                  Edit
              </a>&nbsp;&nbsp;&nbsp;
              {  
              <a disabled={deletable !== ''} onClick={() => this.delete(record.wid)}>Delete</a> && 
                <Popconfirm title="Sure to delete?" onConfirm={() => this.delete(record.wid)}>
                  <a to="javascript:;">Delete</a>
                </Popconfirm>
              }
            </span>
          );
        },
      },
    ];
  }

  isDeleting = record => record.wid === this.state.editingid;

  delete = (wid) => {
    axios.delete("http://127.0.0.1:8000/api/Customer/"+wid).then((response)=>{
    })
  }

  componentDidMount() {
    WholesalerInfo.getWholesalerInfo()
      .then((res)=>{
        this.setState({wholesalerData: res.data})
        console.log(this.state.wholesalerData);
    })

      axios.get("http://127.0.0.1:8000/api/GetRoutesByDistributerId/1").then((response) => {
        this.setState({routeData:response.data})
      })
  }
  
  isEditing = record => record.wid === this.state.editingid;

  cancel = () => {
    this.setState({ editingid: '' });
  };

  save(form, wid) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newRow = row;
      // row.rid = 1;
      const newData = [...this.state.wholesalerData];
      const index = newData.findIndex(item => wid === item.wid);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        
        WholesalerInfo.putWholesaler(this.state.editingid,newRow)
          .then((res)=>{
            this.setState({wholesalerData: newData, editingid: '' })
          })
        } 
      else {
        newData.push(row);
        this.setState({ wholesalerData: newData, editingid: '' });
      }
    });
  }

  edit(wid) {
    this.setState({ editingid: wid });
  }

  addCustomer = () => {
    this.setState({visible:true});
  }

  addNewCustomer = (event) => {
    console.log(event);
    WholesalerInfo.postWholesaler(event)
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
          routeData:this.state.routeData
        }),
      };
    });

    return (
      <div>
        <EditableContext.Provider value = { this.props.form}>
          <Button onClick = { this.addCustomer } type="primary" style={{ marginBottom: 16 }}>
            Add Worker
          </Button>
    
          <Table
            rowKey="wid" 
            components={components}
            bordered
            dataSource={this.state.wholesalerData}
            columns={columns}
            rowClassName="editable-row"
            pagination={{
              onChange: this.cancel,
            }}
          />
          {
            this.state.visible ? <CustomerModal 
            addNewCustomer={this.addNewCustomer}
            hideModal={this.hideModal}
            routeData={this.state.routeData}
          /> : null
          } 
        </EditableContext.Provider>
      </div>
    );
  }
}

const Customer = Form.create()(EditableTable);

export default Customer;