import React,{ Component } from 'react'
import { Table, Input, InputNumber, Popconfirm, Form, Button } from 'antd';
import * as CowQuota from '../services/distributor/distributorQuota';

var routeTotal = 0;
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
        cowQuota: null,
        editingid: '' ,
        isAddCustomer : false,
        visible: false

    };
    this.columns = [
      {
        title: 'Route Name',
        dataIndex: 'RouteName',
        width: '11%',
        editable: true,
      },
      {
        title: 'Cow',
        dataIndex: 'COW',
        width: '11%',
        editable: true,
      },
      {
        title: 'Remains',
        dataIndex: 'remainsCow',
        width: '11%',
        editable: true,
      },
      {
        title: 'Total Routes',
        render: (record,text) =>(
           record.remainsCow + record.cow 
        ),
        width: '11%',
        editable: true,
      },
    ];
  }

  componentDidMount() {
      var totalCow = 0;
      var remains = 0;
      var totalData = {};
      var totalRoutesAll = 0;

    CowQuota.getDistributorQuota().then((res)=>{
        res.data.map((item) =>{
            totalCow = totalCow + item.cow;
            remains = remains + item.remainsCow;
            totalRoutesAll = totalRoutesAll + item.totalRoutes;
        })

        totalData = {
            id: 402,
            routeName:<b>Total All </b>,
            cow:  totalCow,
            remainsCow: remains,
            totalRoutes: totalRoutesAll
          }
        res.data.push(totalData);
      this.setState({cowQuota: res.data})
    })
  }
  
  totalRoutes = () =>{
    let routeTotal = 0;
    this.state.cowQuota.map((item)=>{
    routeTotal = Number (routeTotal) + Number ( item.buffalo + item.remainsBuffalo);
    })
    return routeTotal;
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
        }),
      };
    });

    return (
      <div>
        <h1> Quota Cow : { this.props.cowQuota } Ltr </h1>
      <EditableContext.Provider value={this.props.form}>
        <Table
          rowKey="id" 
          components={components}
          bordered
          dataSource={this.state.cowQuota}
          columns={columns}
          rowClassName="editable-row"
         pagination={false}
        />
      </EditableContext.Provider>
      <br/>
      <br/>
      <br/>
      </div>
    );
  }
}

const QuotaCow = Form.create()(EditableTable);

export default QuotaCow;