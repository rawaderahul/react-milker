import React,{ Component } from 'react'
import axios from 'axios'
import { Table, Input, InputNumber, Popconfirm, Form, Button } from 'antd';
import CustomerModal from './modals/customer';
import { Link } from 'react-router-dom'

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
          const deletable=this.isDeleting(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                { form => (
                  <Link
                    to="javascript;"
                    onClick={() => this.save(form, record.cid)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </Link>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.cid)}>
                <Link>Cancel</Link>
              </Popconfirm>
            </span>
          ) : (
            <span>
               <Link disabled={editingid !== ''} onClick={() => this.edit(record.cid)}>
              Edit
            </Link>&nbsp;&nbsp;&nbsp;
            {  
            <Link disabled={deletable !== ''} onClick={() => this.delete(record.cid)}>Delete</Link> && 
               <Popconfirm title="Sure to delete?" onConfirm={() => this.delete(record.cid)}>
                   <Link to="javascript;">Delete</Link>
                </Popconfirm>
            }
            </span>
           
          );
          
        },
      },
    ];
  }

  isDeleting=record => record.cid === this.state.editingid;

  delete=(cid) => {
  axios.delete("http://127.0.0.1:8000/api/Customer/"+cid).then((response)=>{
    
  })
  }
  componentDidMount() {
      axios.get('http://127.0.0.1:8000/api/CustomerListByRouteId/1').then((res)=>{
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
        axios.put(`http://127.0.0.1:8000/api/Customer/${this.state.editingid}`,newRow)
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
    axios.post('http://127.0.0.1:8000/api/Customer',event).then((response) => {
    console.log(response);

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