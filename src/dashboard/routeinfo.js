import React,{ Component } from 'react'
import axios from 'axios'
import { Table, Input, InputNumber, Popconfirm, Form ,Button} from 'antd';
import RouteModal from './modals/routeinfo'
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
        rootInfo: null,
        editingid: '' ,
        areas:[],
        pincodes:[]
    };
    this.columns = [
      {
        title: 'Name',
        dataIndex: 'routeName',
        width: '20%',
        editable: true,
      },
      {
        title: 'Route Areas',
        dataIndex: 'routeAreas',
        width: '15%',
        editable: true,
      },
      {
        title: 'Route Pin Code',
        dataIndex: 'routePincodes',
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
                    onClick={() => this.save(form, record.rid)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.rid)}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <a disabled={editingid !== ''} onClick={() => this.edit(record.rid)}>
              Edit
            </a>
          );
        },
      },
    ];
  }

  componentDidMount() {
      axios.get('http://127.0.0.1:8000/api/GetRoutesByDistributerId/1').then((res)=>{
          this.setState({rootInfo: res.data})
      })
      axios.get('http://127.0.0.1:8000/api/Distributer/1').then((res)=>{
        this.setState({areas: res.data[0].serviceAreas, pincodes:res.data[0].servicePincodes})
    })
      
  }

  isEditing = record => record.rid === this.state.editingid;

  cancel = () => {
    this.setState({ editingid: '' });
  };

  save(form, rid) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newRow = row;
      row.distributerid = 1;
      const newData = [...this.state.rootInfo];
      const index = newData.findIndex(item => rid === item.rid);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        axios.put(`http://127.0.0.1:8000/api/Route/${this.state.editingid}`,newRow)
          .then(()=>{
            this.setState({rootInfo: newData, editingid: '' })
          })
      } else {
        newData.push(row);
        this.setState({ rootInfo: newData, editingid: '' });
      }
    });
  }

  edit(rid) {
    this.setState({ editingid: rid });
  }
  addRoute=()=> {
    this.setState({visible:true})
  }
  addNewRoute=(event) => {
    axios.post('http://127.0.0.1:8000/api/Route',event).then((response) => {
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
      <EditableContext.Provider value={this.props.form}>
         <Button onClick={this.addRoute} type="primary" style={{ marginBottom: 16 }}>
          Add Route
        </Button>
        <Table
          rowKey="rid" 
          components={components}
          bordered
          dataSource={this.state.rootInfo}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            onChange: this.cancel,
          }}
        />
        {
         this.state.visible ? <RouteModal 
         addNewRoute={this.addNewRoute}
         hideModal={this.hideModal}
         areas={this.state.areas}
         pincodes={this.state.pincodes}
      /> : null
       } 
      </EditableContext.Provider>
    );
  }
}

const RouteInfo = Form.create()(EditableTable);

export default RouteInfo;