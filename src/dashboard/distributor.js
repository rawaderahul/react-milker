import React from 'react'
import { Table, Input, Button, Popconfirm, Form, } from 'antd'
import axios from 'axios';
const FormItem = Form.Item;
const EditableContext = React.createContext();


const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const { TextArea } = Input;

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  }

  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  }

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message:`${title} is required.`,
                      }],
                      initialValue: record[dataIndex],
                    })(
                      <Input
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                        onBlur={this.save}
                      />
                    )}
                  </FormItem>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}
class ShopDetails extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      dataIndex: 'name',
      width:'30%'
    }, 
    {
      dataIndex: 'value',
      width:'30%',
      editable: true,
    }];

    this.state = {
      dataSource:[],
      distributorData:{}
    };
   
  }
  componentDidMount = () => {
    let dataSource;
    axios.get('http://127.0.0.1:8000/api/Distributer/1').then((response) =>{
      this.setState({distributorData:response.data[0]})
      dataSource= [{
        id:1,
        name:<b>OrganizationName:</b>,
        value:this.state.distributorData['organizationName'],
        key:'organizationName'

      },
      {
        id:2,
        name:<b>FirstName</b>,
        value:this.state.distributorData['firstName'],
        key:'firstName'
      },
      {
        id:3,
        name:<b>LastName:</b>,
        value:this.state.distributorData['lastName'],
        key:'lastName'
      },
      {
        id:4,
        name:<b>Contact:</b>,
        value:this.state.distributorData['contact'],
        key:'contact'
      },
      {
        id:5,
        name:<b>Address:</b>,
        value:this.state.distributorData['address'],
        key:'address'
      },
      {
        id:6,
        name:<b>Email:</b>,
        value:this.state.distributorData['email'],
        key:'email'
      },
      {
        id:7,
        name:<b>Pincode:</b>,
        value:this.state.distributorData['pincode'],
        key:'pincode'
      },
      {
        id:8,
        name:<b>City:</b>,
        value:this.state.distributorData['city'],
        key:'city'
      },
      {
        id:9,
        name:<b>State:</b>,
        value:this.state.distributorData['state'],
        key:'state'
      },
      {
        id:10,
        name:<b>Area:</b>,
        value:this.state.distributorData['area'],
        key:'area'
      },
     
      {
        id:11,
        name:<b>ServiceAreas:</b>,
        value:this.state.distributorData['serviceAreas'],
        key:'serviceAreas'
      },
      {
        id:12,
        name:<b>ServicePincodes:</b>,
        value:this.state.distributorData['servicePincodes'],
        key:'servicePincodes'
      },
      {
        id:13,
        name:<b>DeliveryCharge:</b>,
        value:this.state.distributorData['deliveryCharge'],
        key:'deliveryCharge'
      }
      ]
      this.setState({dataSource})
    })
  }

  handleDelete = (id) => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.id !== id) });
  }

  handleSave = (row) => {
    this.state.distributorData[row.key]=row.value;
    axios.put('http://127.0.0.1:8000/api/Distributer/'+this.state.distributorData.Did,this.state.distributorData).then()
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  }

  render() {
    console.log(this.state.distributorData);
    
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
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
        <Table className='header distributor-details'
         rowKey="id"
         pagination={false}
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}

export default ShopDetails;