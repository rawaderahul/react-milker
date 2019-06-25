import React, { Component } from 'react'

import { Table, InputNumber,Input, Button, Popconfirm, Form ,Icon} from 'antd';
import * as WholesalerInfo from '../../services/wholesaler/wholesaler';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
    };
    
  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        { children }
        
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class AnyRoutes extends Component {
  constructor(props) {
    super(props);
    const { getFieldDecorator } = this.props.form;
    this.state={
      count:0,
      dataSource:[],
      milkbrand: [],
      TotalBuffaloPrice: null
    }
    this.columns = [
        {
            title : 'Index',
            dataIndex : 'id',
            width: '5%',
            align: 'center'

        },
        {
            title : 'Route Name',
            dataIndex : 'routeid',
            width: '10%',
            render : (record) =>(
                console.log(record)
            ),
            align: 'center'

        },
        {
            title: 'Wholesaler Name',
            dataIndex: 'name',
            width: '15%',
            align:'center'
        },
        {
        
            title: 'Buffalo',
            width:'15%',
            render: (text, record) => (
                <span>
                    <Icon type="minus" onClick={() => this.decrement(record.id,'dailyBuffaloQuota')}/>
                        <InputNumber value = {record.dailyBuffaloQuota} 
                        style={{width:60,marginLeft:10,marginRight:10,textAlign:'center'}}
                        onChange={(e)=> this.handleChange(e,record.id,'dailyBuffaloQuota')}/>
                    <Icon type="plus" onClick={() => this.increament(record.id,'dailyBuffaloQuota')} style={{fontWeight:'bolder'}}/>
                </span>
            ),
            align:'center',
        },
        {
            title: 'Buffalo Price',
            render: (record)=>(
             record.dailyBuffaloQuota * record.buffaloPrice 
            ),
            width: '10%',
            align:'center',
        },
        {
            title:'Cow',
            width:'15%',
            dataIndex: 'cow',
            render: (text, record) => (
                <span>
                    <Icon type="minus" onClick={() => this.decrement(record.id,'dailyCowQuota')}/>
                        <InputNumber value = {record.dailyCowQuota} 
                        style={{width:60,marginLeft:10,marginRight:10,textAlign:'center'}}
                        onChange={(e)=> this.handleChange(e,record.id,'dailyCowQuota')}/>
                    <Icon type="plus" onClick={() => this.increament(record.id,'dailyCowQuota')} style={{fontWeight:'bolder'}}/>
                </span>
            ),
            align:'center',
        },
        {
            title: 'Cow Price',
            render:(record)=>(
                record.dailyCowQuota * record.cowPrice
            ),
            width: '10%',
            align:'center'
        },
        {
            title: 'Total Price',
            render:(record)=>(
               ( record.dailyCowQuota * record.cowPrice ) + ( record.dailyBuffaloQuota * record.buffaloPrice )
            ),
            // dataIndex: 'cowPrice',
            width:'20%',
        },
    ];
  }

    componentDidMount() {
        WholesalerInfo.getWholesalerInfo().then((res)=>{
            this.setState({dataSource: res.data})
            console.log(this.state.dataSource);
            
        })
        // axios.get('http://localhost:3005/WholeSaler').then((response) => {
        // this.setState({ dataSource:response.data })
        // })
    }

    handleChange=(event,id,text)=> {
    const { dataSource }=this.state;
    dataSource.map((item) => {
        if(item.id==id) {
        switch(text) {
            case 'dailyBuffaloQuota': item.dailyBuffaloQuota = event;
            break;
            case 'dailyCowQuota': item.dailyCowQuota = event;
            break;
        }
        }
    })
    this.setState({dataSource})

    }
    handleMessage = id => {
         const dataSource = [...this.state.dataSource];
        // this.setState({ dataSource: dataSource.filter(item => item.id !== id) });
    };

    increament = (id,text) =>{
        const { dataSource } = this.state;
        dataSource.map((item) => {
            if(item.id==id) {
                switch(text) {
                case 'dailyBuffaloQuota': item.dailyBuffaloQuota = item.dailyBuffaloQuota + 0.5;
                break;
                case 'dailyCowQuota': item.dailyCowQuota = item.dailyCowQuota + 0.5;
                break;
                }
            }
        })
        this.setState({dataSource})

    }
  
    decrement = (id,text) => {
        const { dataSource } = this.state;
        dataSource.map((item) => {
        if(item.id==id) {
            switch(text) {
            case 'buffalo': item.buffalo > 0 ? item.buffalo=item.buffalo - 0.5 : item.buffalo=0  ;
            break;
            case 'dailyCowQuota':item.dailyCowQuota > 0 ? item.dailyCowQuota = item.dailyCowQuota - 0.5: item.dailyCowQuota=0;
            break;
            }
        }
        })
    this.setState({dataSource})
    }
  
    handleSave = row => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, {
        ...item,
        ...row,
        });
        this.setState({ dataSource: newData });
    };

    render() {
        const { milkbrand } = this.state;
        const { dataSource } = this.state;
        const components = {
        body: {
            row: EditableFormRow,
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
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: this.handleSave,
            }),
        };
        });
        return (
        <div>
            <Table
            rowKey="id"
            components={components}
            // rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={columns}
            />
        </div>
        );
    }
}

const AnyRoute = Form.create()(AnyRoutes);
export default AnyRoute;
