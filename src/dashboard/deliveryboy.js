import React,{ Component } from 'react'
import axios from 'axios'
import { Table, Input, InputNumber, Popconfirm, Form, Button } from 'antd';

import WorkerModal from './modals/deliveryboy'

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
        deliveryBoyData: null,
        editingKey: '' ,
        isAddCustomer : false,
        visible: false

    };
    this.columns = [
      {
        title: 'Name',
        dataIndex: 'workerName',
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
              <a disabled={editingKey !== ''} onClick={() => this.edit(record.wid)}>
                Edit
              </a>
               {
                 <a onClick={() => this.delete(record.wid)}>Delete</a> && 
               <Popconfirm title="Sure to delete?" onConfirm={() => this.delete(record.wid)}>
                   <a href="javascript:;">Delete</a>
                </Popconfirm>
                }
            </span>
          );
        },
      },
    ];
  }

  componentDidMount() {
    axios.get('http://127.0.0.1:8000/api/workerListByDistributer/1').then((res)=>{
      this.setState({deliveryBoyData: res.data})
      console.log(this.state.deliveryBoyData);
    })
  }
  
  isEditing = record => record.wid === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, wid) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newRow = row;
      row.distributerid = 1;
      row.routeid = 1;
      const newData = [...this.state.deliveryBoyData];
      const index = newData.findIndex(item => wid === item.wid);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        axios.put(`http://127.0.0.1:8000/api/WorkerDetail/${this.state.editingKey}`,newRow)
          .then((res)=>{
            this.setState({deliveryBoyData: newData, editingKey: '' })
          })
      } 
      else {
        newData.push(row);
        this.setState({ deliveryBoyData: newData, editingKey: '' });
      }
    });
  }

  edit(wid) {
    this.setState({ editingKey: wid });
  }

  delete(id) {
    const data = [...this.state.deliveryBoyData];
   axios.delete('http://127.0.0.1:8000/api/WorkerDetail',id)
    .then(()=>{
      this.setState({ deliveryBoyData: data.filter(item => item.id !== id) });
    })
}

  addWorker = () => {
    this.setState({visible: true})
  }
  addNewWorker = (event) => {
    axios.post('http://127.0.0.1:8000/api/WorkerDetail' ,event)
    .then((response) => {
    console.log(response.data)
    })
    this.setState({visible: false})
  }

  showModal = () => {
    this.setState({
      visible: false,
    });
  };

  handleOk = e => {
    console.log(e);
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
        <Button onClick={this.addWorker} type="primary" style={{ marginBottom: 16 }}>
          Add Worker
        </Button>
  
        <Table
          rowKey="wid" 
          components={components}
          bordered
          dataSource={this.state.deliveryBoyData}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            onChange: this.cancel,
          }}
        />

        {this.state.visible ? < WorkerModal 
         addNewWorker = { this.addNewWorker }
         handleOk = { this.handleOk }
         /> :null}
      </EditableContext.Provider>
      </div>
    );
  }
}

const Customer = Form.create()(EditableTable);

export default Customer;