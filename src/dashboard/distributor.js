import React from 'react'
import axios from 'axios';
import { Table, Input,Form, } from 'antd'
import * as DistributorsInfo from '../services/distributorInfo';
const FormItem = Form.Item;
const EditableContext = React.createContext();


const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

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
    DistributorsInfo.getPerticluarDistributorInfo(1)
      .then((response) =>{
      this.setState({distributorData:response.data[0]})
      dataSource= [
        {
          name:<b>OrganizationName:</b>,
          value:this.state.distributorData['organizationName'],
          id:'organizationName'
        },
        {
          name:<b>Name</b>,
          value:this.state.distributorData['name'],
          id:'name'
        },
        {
          name:<b>Email:</b>,
          value:this.state.distributorData['email'],
          id:'email'
        },
        {
          name:<b>Contact:</b>,
          value:this.state.distributorData['contact'],
          id:'contact'
        },
        {
          name:<b>Address:</b>,
          value:this.state.distributorData['address'],
          id:'address'
        },
        {
          name:<b>Email:</b>,
          value:this.state.distributorData['email'],
          id:'email'
        },
        {
          name:<b>Pincode:</b>,
          value:this.state.distributorData['pincode'],
          id:'pincode'
        },
        {
          name:<b>City:</b>,
          value:this.state.distributorData['city'],
          id:'city'
        },
        {
          name:<b>State:</b>,
          value:this.state.distributorData['state'],
          id:'state'
        },
        {
          name:<b>Area:</b>,
          value:this.state.distributorData['area'],
          id:'area'
        },
      
        {
          name:<b>ServiceAreas:</b>,
          value:this.state.distributorData['serviceAreas'],
          id:'serviceAreas'
        },
        {
          name:<b>ServicePincodes:</b>,
          value:this.state.distributorData['servicePincodes'],
          id:'servicePincodes'
        },
        {
          name:<b>DeliveryCharge:</b>,
          value:this.state.distributorData['deliveryCharge'],
          id:'deliveryCharge'
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
    const { distributorData }=this.state;
    distributorData[row.id]=row.value;
    this.setState({distributorData})
    DistributorsInfo.putDistributorInfo(this.state.distributorData.did, this.state.distributorData)
    .then()
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
         rowKey="did"
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