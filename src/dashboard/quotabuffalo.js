import React,{ Component } from 'react'
import { Table, Input, InputNumber, Popconfirm, Form, Button } from 'antd';
import * as BuffaloQuota from '../services/distributor/distributorQuota';
import * as DistributorInfo from '../services/distributor/distributorInfo'
import { func } from 'prop-types';


const EditableContext = React.createContext();

var routeTotal = 0;
var remains = 0;

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
        buffaloQuota: null,
        editingid: '' ,
        isAddCustomer : false,
        visible: false,
        buffaloQuota: null,
        distributorInfo:null

    };
    this.columns = [
      {
        title: 'Route Name',
        dataIndex: 'routeName',
        width: '11%',
        editable: true,
      },
      {
        title: 'Buffalo',
        dataIndex: 'buffalo',
        width: '11%',
        editable: true,
      },
      {
        title: 'Remains',
        dataIndex: 'remainsBuffalo',
        width: '11%',
        editable: true,
      },
      {
        title: 'Total Routes',
        render: (record,text) =>(
         Number( record.buffalo ) + Number(record.remainsBuffalo )
        ),
        width: '11%',
        editable: true,
      },
    ];
  }

  componentDidMount() {
    var totalData = {};
    var totalbuffalo = 0;
    BuffaloQuota.getDistributorQuota().then((res)=>{
        res.data.map(( item,index )=>{
            remains = remains + item.remainsBuffalo;
            totalbuffalo = totalbuffalo + item.buffalo;
            item.index = index;
        })

        totalData = {
            id: 402,
            routeName:<b>Total All </b>,
            buffalo:  totalbuffalo,
            remainsBuffalo: remains,
            totalRoutes: routeTotal
          }
        res.data.push(totalData);
        this.setState({buffaloQuota: res.data})
    })

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
          <h1> Quota Buffalo : {this.props.buffaloQuota} </h1>
      <EditableContext.Provider value={this.props.form}>
        <Table
          rowKey="id" 
          components={components}
          bordered
          dataSource={this.state.buffaloQuota}
          columns={columns}
          rowClassName="editable-row"
          pagination={false}
        />
      </EditableContext.Provider>
      <br/>
      <br/>
      <br/>
      <br/>
      </div>
    );
  }
}

const QuotaBuffalo = Form.create()(EditableTable);

export default QuotaBuffalo;