import React,{ Component } from 'react'
import axios from 'axios'
import { Table, Input, InputNumber, Popconfirm, Form ,Button,Select} from 'antd';
import * as RoutesInfo from '../../services/route/routesInfo';
import RouteModal from '../modals/routeinfo'

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
      areas,
      pincodes,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <span>
            <Form.Item style={{ margin: 0 }}>
              {dataIndex=='routeName' ?  getFieldDecorator('routeName', {
                rules: [{ required: true, message: 'Please enter route name!' },
                        { pattern: '[A-Za-z]', message: 'Please enter only characters!' }
              ],
              initialValue: record['routeName']
              })(
                <Input  />
              ):null} 
            </Form.Item>

            <Form.Item style={{ margin: 0}}>
              {dataIndex=='routeAreas' ?  getFieldDecorator('routeAreas', {
                rules: [{ required: true, message: 'Please enter contact number!' },
                      //  { pattern: '[0-9]', message: 'Please enter Sale Price with only digit ' }
              ],
                initialValue:Array.isArray(record.routeAreas) ? record.routeAreas  : record.routeAreas.split(",")
                })(
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                >
                  {
                  areas &&  areas.map((item) => {
                    return <Option key={item} >{item}</Option>
                  })
                  }
                </Select>
                ):null} 
            </Form.Item>

            <Form.Item style={{ margin: 0 }}>
              {dataIndex=='routePincodes' ?  getFieldDecorator('routePincodes', {
                rules: [{ required: true, message: 'Please select route pincodes!' },
              ],
              initialValue:Array.isArray(record.routePincodes) ? record.routePincodes : record.routePincodes.split(",")
              })(
              <Select
                mode="multiple"
                style={{ width: '100%' }}
              >
                {
                pincodes &&  pincodes.map((item) => {
                  return <Option key={item}>{item}</Option>
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
        width: '20%',
        editable: true,
      },
      {
        title: 'Route Pin Code',
        dataIndex: 'routePincodes',
        width: '20%',
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
            <span>
              <a disabled={editingid !== ''} onClick={() => this.edit(record.rid)}>
                Edit
              </a>&nbsp;&nbsp;&nbsp;
              {
                <a disabled={editingid !== ''} onClick={() => this.delete(record.rid)}>Delete</a> && 
              <Popconfirm title="Sure to delete?" onConfirm={() => this.delete(record.rid)}>
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
      RoutesInfo.getGetRoutesByDistributerId().then((res)=>{
        this.setState({rootInfo: res.data})
      })

      axios.get('http://127.0.0.1:8000/api/Distributer/1').then((res)=>{
        this.setState({areas: res.data[0].serviceAreas.split(","), pincodes:res.data[0].servicePincodes.split(",")})
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
        newRow.routeAreas=newRow.routeAreas.join(",");
        newRow.routePincodes=newRow.routePincodes.join(",");
          newData.splice(index, 1, {
            ...item,
            ...newRow,
          });
        
        RoutesInfo.putRoutesInfo(this.state.editingid,newRow)
          .then((response)=>{
            console.log(response);
            
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

  delete(rid) {
    const data = [...this.state.rootInfo];
    RoutesInfo.deleteRoutesInfo(rid)
    .then(()=>{
      this.setState({ rootInfo : data.filter(item => item.rid !== rid) });
    })  
  }

  addRoute = () => {
    this.setState({visible:true})
  }

  addNewRoute = (event) => {
    RoutesInfo.postRoutesInfo(event)
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
          areas:this.state.areas,
          pincodes:this.state.pincodes
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