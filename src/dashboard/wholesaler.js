import React, { Component } from 'react'

import { Table, InputNumber,Input, Button, Popconfirm, Form ,Icon} from 'antd';
import axios from 'axios';

var BuffaloPrice = 0;

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
        {children}
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
            dataIndex : 'routeName',
            width: '10%',
            align: 'center'

        },
        {
            title: 'Customer Name',
            dataIndex: 'sellerName',
            width: '15%',
            align:'center'
        },
        {
            title:'buffalo',
            title: 'Buffalo',
            width:'15%',
            render: (text, record) => (
                <span>
                <Icon type="minus" onClick={() => this.decrement(record.id,'buffalo')}/>
                    <InputNumber value = {record.buffalo} 
                    style={{width:60,marginLeft:10,marginRight:10,textAlign:'center'}}
                    onChange={(e)=> this.handleChange(e,record.id,'buffalo')}/>
                <Icon type="plus" onClick={() => this.increament(record.id,'buffalo')} style={{fontWeight:'bolder'}}/>
                </span>
            ),
            align:'center',
        },
        {
            title: 'Buffalo Price',
            render: ()=>(
                this.state.TotalBuffaloPrice
            ),
            // dataIndex: this.state.TotalBuffaloPrice,
            width: '10%',
            align:'center',
        },
        {
            title:'cow',
            title: 'Cow',
            width:'20%',
            render: (text, record) => (
                <span>
                <Icon type="minus" onClick={() => this.decrement(record.id,'cow')}/>
                <InputNumber defaultValue={record.cow} value={record.cow} 
                    style={{width:60,marginLeft:10,marginRight:10,textAlign:'center'}} 
                    onChange={(e)=> this.handleChange(e,record.id,'cow')}/>
                <Icon type="plus" onClick={() => this.increament(record.id,'cow')} style={{fontWeight:'bolder'}}/>
                </span>
            ),
            dataIndex:'cow',
            editable:true,
            align:'center'

        },
        {
            title: 'Cow Price',
            dataIndex: 'cowPrice',
            width: '10%',
            align:'center'
        },
        {
            title: 'Total Price',
            dataIndex: 'totalRoute',
            width:'20%',
        },
    ];
  }

    handleBuffaloPrice(e){
        this.state.dataSource.map((item)=>{
            console.log(item);
        })
        console.log("Select Buffalo Price on Wholsaler");
    }

    componentDidMount() {
        axios.get('http://127.0.0.1:8000/api/MilkBrands').then((res)=>{
            this.setState({milkbrand: res.data})
            console.log(this.state.milkbrand);
        })
        axios.get('http://localhost:3005/WholeSaler').then((response) => {
        this.setState({ dataSource:response.data })
        })
    }

    handleChange=(event,id,text)=> {
    const { dataSource }=this.state;
    console.log(event);
    dataSource.map((item) => {
        if(item.id==id) {
        switch(text) {
            case 'buffalo': item.buffalo=event;
            break;
            case 'cow': item.cow=event;
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

    increament=(id,text)=>{
        const { dataSource }=this.state;
    dataSource.map((item) => {
        if(item.id==id) {
            switch(text) {
            case 'buffalo': item.buffalo=item.buffalo + 0.5;
            break;
            case 'cow': item.cow=item.cow + 0.5;
            break;
            }
        }
    })
    this.setState({dataSource})

        dataSource.map((datas)=>{
            this.state.milkbrand.map((milk)=>{
                if('Sane' == milk.brandName){
                    BuffaloPrice = datas.buffalo * milk.literPrice
                }
                console.log(BuffaloPrice);
            })
        })
        this.setState({TotalBuffaloPrice : BuffaloPrice});

    }
  
    decrement=(id,text)=> {
        const { dataSource }=this.state;
        dataSource.map((item) => {
        if(item.id==id) {
            switch(text) {
            case 'buffalo': item.buffalo > 0 ? item.buffalo=item.buffalo - 0.5 : item.buffalo=0  ;
            break;
            case 'cow':item.cow > 0 ? item.cow=item.cow - 0.5: item.cow=0;
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
        console.log(dataSource);
        console.log(milkbrand);
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
