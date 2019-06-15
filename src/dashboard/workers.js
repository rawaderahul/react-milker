import React,{ Component } from 'react'
import { Table, Input, InputNumber, Popconfirm, Form, Button ,Select} from 'antd';
import * as Workers from '../services/workersInfo';
import * as RoutsInfo from '../services/routesInfo'
import WorkerModal from './modals/workers'

const { Option } = Select;
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
      routeData,
      ...restProps
    } = this.props;
   
    
    return (
      <td {...restProps}>
        {editing ? (
          <span>
            <Form.Item style={{ margin: 0 }}>
             {dataIndex=='workerName' ?  getFieldDecorator('workerName', {
                      rules: [{ required: true, message: 'Please enter worker name!' },
                              { pattern: '[A-Za-z]', message: 'Please enter only characters!' }
                    ],
                    initialValue: record['workerName']
                    })(
                      <Input  />
                    ):null} 
          </Form.Item>
          <Form.Item style={{ margin: 0 }}>
          {dataIndex=='contact' ?  getFieldDecorator('contact', {
                   rules: [{ required: true, message: 'Please enter contact number!' },
                          //  { pattern: '[0-9]', message: 'Please enter Sale Price with only digit ' }
                  ],
                    initialValue: record['contact']
                    })(
                      <Input  type="number"/>
                    ):null} 
       </Form.Item>
       <Form.Item style={{ margin: 0 }}>
       {dataIndex=='routeid' ?  getFieldDecorator('routeid', {
                      rules: [{ required: false, message: 'Please select route!' },
                    ],
                    initialValue: record['routeid']
                    })(
                     <Select
                     onSelect={(value, option) => {this.props.handleRouteName(value, option)
                     }}
                      style={{ width: '100px' }}>
                       {
                       routeData &&  routeData.map((item) => {
                         
                         return <Option key={item.rid}>{item.routeName}</Option>
                       })
                       }
                     </Select>
                    ):null} 
       </Form.Item>
          </span>
          
        ) : (
          children
        )}
      </td>
    );
  };
//   handleChange=(value,option)=>{
// console.log("value",value,"option",option);

  // }

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
        editingid: '' ,
        isAddCustomer : false,
        visible: false,
        routeData:[],
        routeName:{}

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
        title: 'Route',
        dataIndex: 'routeid',
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
    Workers.getWorkerListByDistributer().then((res)=>{
      this.setState({deliveryBoyData: res.data})
    })

    RoutsInfo.getGetRoutesByDistributerId(1).then((res)=>{
      this.setState({routeData:res.data})
    })
   console.log(this.state.routeData);

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
      row.distributerid = 1;
      const newData = [...this.state.deliveryBoyData];
      const index = newData.findIndex(item => wid === item.wid);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        console.log(newRow);
        // if(this.state.routeName) {
        //   newRow.routeid=routeName.key;
        // }
        // else {
        //   this.state.routeData.map((item) => {
        //     if(item.routeName==newRow.routeName) {
        //       newRow.routeid=item.routeid;
        //     }
        //   })
        // }
        
        Workers.putWorkerDetail(this.state.editingid,newRow)
          .then((res)=>{
            this.setState({deliveryBoyData: newData, editingid: '' })
          })
      } 
      else {
        newData.push(row);
        this.setState({ deliveryBoyData: newData, editingid: '' });
      }
    });
  }

  edit(wid) {
    this.setState({ editingid: wid });
  }

  delete(wid) {
    const data = [...this.state.deliveryBoyData];
    Workers.deleteWorkerDetails(wid)
    .then(()=>{
      this.setState({ deliveryBoyData: data.filter(item => item.wid !== wid) });
    })  
  }

  addWorker = () => {
    this.setState({visible: true})
  }
  addNewWorker = (event) => {
    Workers.postWorkerDetail(event)
    .then((response) => {
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
  handleRouteName=(value,option)=> {
   this.setState({routeName:option})

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
          routeData:this.state.routeData,
          handleRouteName:this.handleRouteName
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