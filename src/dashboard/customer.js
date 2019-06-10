import React,{ Component } from 'react'
import axios from 'axios'
import { Table, Input, InputNumber, Popconfirm, Form, Button } from 'antd';
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
        editingKey: '' ,
        iAddCustomer : false
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
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    href="javascript:;"
                    onClick={() => this.save(form, record.Cid)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.Cid)}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <a disabled={editingKey !== ''} onClick={() => this.edit(record.Cid)}>
              Edit
            </a>
          );
        },
      },
    ];
  }

  componentDidMount() {
      axios.get('http://127.0.0.1:8000/api/CustomerListByRouteId/1').then((res)=>{
          this.setState({customerData: res.data})
          console.log(this.state.customerData);
      })
      
  }
  
  isEditing = record => record.Cid === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, Cid) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newRow = row;
      // row.rid = 1;
      const newData = [...this.state.customerData];
      const index = newData.findIndex(item => Cid === item.Cid);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        axios.put(`http://127.0.0.1:8000/api/CustomerListByRouteId/${this.state.editingKey}`,newRow)
          .then((res)=>{
            this.setState({customerData: newData, editingKey: '' })
          })
      } 
      else {
        newData.push(row);
        this.setState({ customerData: newData, editingKey: '' });
      }
    });
  }

  edit(Cid) {
    this.setState({ editingKey: Cid });
  }

  addCustomer = () => {
    this.setState({iAddCustomer: true});
    console.log("You select customer add button");
  }

  condition(){
    return <CustomerModal 
    flag={this.state.iAddCustomer}
    />
  }

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
          rowKey="Cid" 
          components={components}
          bordered
          dataSource={this.state.customerData}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            onChange: this.cancel,
          }}
        />
        {this.condition()}
      </EditableContext.Provider>
      </div>
    );
  }
}

const Customer = Form.create()(EditableTable);

export default Customer;