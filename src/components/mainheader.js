import React,{Component} from 'react'
import { Layout, Select,  Menu, Dropdown, Icon  } from 'antd';
import { Link } from 'react-router-dom'
import { Row, Col } from 'antd';
import './mainheader.css'
const { Header } = Layout;
const Option = Select.Option;

function handleChange(value) {
    console.log(`selected ${value}`);
}

const menu = (
    <Menu>
      <Menu.Item>
        <Link  to="#">
          Edit Profile
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link  to="#">
          Manage Routes
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link  to="#">
          Manage Delivery Boy
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link  to="#">
          Manage Customers
        </Link>
      </Menu.Item>
    </Menu>
  );
  

class MainHeader extends Component{
    render(){
        return(
<div className="main-header">
<div className="marquee">
  <div>
    <span>Need Help: <Icon type="phone" theme="filled" rotate={120}  /> <a href="tel:+7038375655">+91 7038375655</a></span>
    <span>Need Help: <Icon type="phone" theme="filled" rotate={120}  /> <a href="tel:+6494461709">+91 7038375655</a></span>
  </div>
</div>
<Header >
    <div className="container-fluid">
        <Row>      
            <Col >
            <Link to='/'  >  <div className="logo"> Milkers </div>  </Link>
                <Menu
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    style={{ lineHeight: '64px', float:"right" }}
                >
                    <Select defaultValue="English" style={{ width: "150px", marginRight: "30px" }} onChange={handleChange}>
                        <Option value="jack">Marathi</Option>
                        <Option value="lucy">English</Option>
                    </Select>
                    <Menu.Item key="2"><Link to='/' >  Home </Link></Menu.Item>

                    <Menu.Item key="3"><Link to='/businesssetup'>  Business Set UP </Link></Menu.Item>                    
                    <Menu.Item key="4"><Link to='/createcustomer'>  Create  Customer </Link></Menu.Item>
                    <Menu.Item key="5"><Link to='/login' >  Login </Link></Menu.Item>
                    <Menu.Item key="6"><Link to='/register'>  Register </Link></Menu.Item>
                    
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Link className="ant-dropdown-link" to="#">
                            <Icon type="more" />
                        </Link>
                    </Dropdown> 
                </Menu>
            </Col>      
        </Row>      
    </div>    
</Header>
</div>

        )
    }
}
export default MainHeader;