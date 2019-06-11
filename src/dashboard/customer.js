import React,{ Component } from 'react'
import axios from 'axios'
import { Table, Input, InputNumber, Popconfirm, Form, Button } from 'antd';
import * as CustomersInfo from '../services/customer';
import CustomerModal from './modals/customer'
const EditableContext = React.createContext();

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
        customerData: null,
        editingid: '' ,
        visible:false
    };
    this.columns = [
      {
        title: 'Name',
        dataIndex: 'customerName',
        width: '20%',
        editable: true,
      },
      {
        title: 'Contact',
        dataIndex: 'contact',
        width: '15%',
        editable: true,
      },
      {
        title: 'address',
        dataIndex: 'address',
        width: '15%',
        editable: true,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        width: '15%',
        editable: true,
      },
      {
        title: 'Payment Type',
        dataIndex: 'paymentType',
        width: '15%',
        editable: true,
      },
      {
        title: 'Pin Code',
        dataIndex: 'pincode',
        width: '15%',
        editable: true,
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingid } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    href="javascript:;"
                    onClick={() => this.save(form, record.cid)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.cid)}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <a disabled={editingid !== ''} onClick={() => this.edit(record.cid)}>
              Edit
            </a>
          );
        },
      },
    ];
  }

  componentDidMount() {
    CustomersInfo.getCustomerListByDistributerId()
      .then((res)=>{
        this.setState({customerData: res.data})
      })
      
  }
  
  isEditing = record => record.cid === this.state.editingid;

  cancel = () => {
    this.setState({ editingid: '' });
  };

  save(form, cid) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newRow = row;
      // row.rid = 1;
      const newData = [...this.state.customerData];
      const index = newData.findIndex(item => cid === item.cid);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        CustomersInfo.putCustomerInfo(this.state.editingid,newRow)
          .then((res)=>{
            this.setState({customerData: newData, editingid: '' })
          })
        } 
      else {
        newData.push(row);
        this.setState({ customerData: newData, editingid: '' });
      }
    });
  }

  edit(cid) {
    this.setState({ editingid: cid });
  }

  addCustomer = () => {
    this.setState({visible:true});
  }

  addNewCustomer = (event) => {
    CustomersInfo.postCustomerInfo(event)
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
        }),
      };
    });

    return (
      <div>
      <EditableContext.Provider value={this.props.form}>
        <Button onClick={this.addCustomer} type="primary" style={{ marginBottom: 16 }}>
          Add Customer
        </Button>
  
        <Table
          rowKey="cid" 
          components={components}
          bordered
          dataSource={this.state.customerData}
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
      /> : null
       } 
      </EditableContext.Provider>
      </div>
    );
  }
}

const Customer = Form.create()(EditableTable);

export default Customer;