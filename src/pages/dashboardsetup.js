import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import Distributor from '../dashboard/distributor';
import Customer from '../dashboard/customer';
import Deliveryboy from '../dashboard/deliveryboy';
import RouteInfo from '../dashboard/routeinfo';
import Distributorquota from '../dashboard/distributorquota';
import Wholesaler from '../dashboard/wholesaler';
import Messages from '../dashboard/messages';


const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class Dashboard extends React.Component {
  state = {
    collapsed: false,
    select:'Distributer Quata',
    selectWithMenu:['Distributer Quata','Manage Daily']
    
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };
  subMenuHandle=(e)=>{
  this.setState({select:e.key , selectWithMenu:e.keyPath})
  console.log(e);
  }
  
  condition=(select)=>{
   switch(select) {
    case "Distributer Quata" : return <Distributorquota/>;
    break;
     case "Distributor" : return <Distributor/> ;
     break;
     case "Workers" :return  <Deliveryboy/>;
     break;
     case "Routes" :return  <RouteInfo/>;
     break;
     case "Customer" :return  <Customer/>;
     break;
     case "Wholesaler" :return  <Wholesaler/>;
     break;
     case "Messages" :return  <Messages/>;
     break;
   }
  }
  render() {
    console.log(this.state.select);
    
    return (
      <Layout style={{ minHeight: '100vh' }} >
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} style={{  background: '#FEFEFF'}}>
          <div className="logo" />
          <Menu theme="light" defaultSelectedKeys={['1']}
           mode="inline" style={{  background: '#FEFEFF'}}
           >
            <SubMenu onClick={this.subMenuHandle}
              key="Manage Business"
              title={
                <span>
                  <Icon type="pie-chart" />
                  <span>Manage Business</span>
                </span>
              }
              >

              <Menu.Item key="Distributor" >Distributor</Menu.Item>
              <Menu.Item key="Workers">Workers</Menu.Item>
              <Menu.Item key="Routes">Routes</Menu.Item>
              <Menu.Item key="Customer">Customer</Menu.Item>
              
            </SubMenu>
            <SubMenu onClick={this.subMenuHandle}
              key="Manage Daily"
              title={
                <span>
                  <Icon type="line-chart" />
                  <span>Manage Daily</span>
                </span>
              }
              >
              <Menu.Item key="Distributer Quata" >Distributer Quata</Menu.Item>
              <Menu.Item key="Wholesaler">Wholesaler</Menu.Item>
              <Menu.Item key="Messages">Messages</Menu.Item>
              
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: 'orange', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
              
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>{this.state.selectWithMenu[1]}</Breadcrumb.Item>
              <Breadcrumb.Item>{this.state.selectWithMenu[0]}</Breadcrumb.Item>
            </Breadcrumb>
            {
              this.condition(this.state.select)
            }
           
          </Content>
        </Layout>
      </Layout>
    );
  }
}


export default Dashboard;