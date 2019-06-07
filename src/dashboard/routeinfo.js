import React,{ Component } from 'react'
import axios from 'axios'
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';

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
        editingKey: '' ,
    };
    this.columns = [
      {
        title: 'Name',
        dataIndex: 'RouteName',
        width: '20%',
        editable: true,
      },
      {
        title: 'Route Areas',
        dataIndex: 'RouteAreas',
        width: '15%',
        editable: true,
      },
      {
        title: 'Route Pin Code',
        dataIndex: 'RoutePincodes',
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
                    onClick={() => this.save(form, record.Rid)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.Rid)}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <a disabled={editingKey !== ''} onClick={() => this.edit(record.Rid)}>
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
      
  }

  isEditing = record => record.Rid === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, Rid) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newRow = row;
      row.distributerid = 2;
      const newData = [...this.state.rootInfo];
      const index = newData.findIndex(item => Rid === item.Rid);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        console.log(newRow);
        axios.put(`http://127.0.0.1:8000/api/Route/${this.state.editingKey}`,newRow)
          .then((res)=>{
            this.setState({rootInfo: newData, editingKey: '' })

          })
      } else {
        newData.push(row);
        this.setState({ rootInfo: newData, editingKey: '' });
      }
    });
  }

  edit(Rid) {
    this.setState({ editingKey: Rid });
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
      <EditableContext.Provider value={this.props.form}>
        <Table
          rowKey="Rid" 
          components={components}
          bordered
          dataSource={this.state.rootInfo}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            onChange: this.cancel,
          }}
        />
      </EditableContext.Provider>
    );
  }
}

const RouteInfo = Form.create()(EditableTable);

export default RouteInfo;