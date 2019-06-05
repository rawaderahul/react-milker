import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import {BrowserRouter as Router, Route,Link } from 'react-router-dom'
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
    select:null
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };
  subMenuHandle=(e)=>{
  this.setState({select:e.item.props.children})

  }
  condition=()=>{

  }
  render() {
    return (
        <Router>
      <Layout style={{ minHeight: '100vh' }} >
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} style={{  background: 'orange'}}>
          <div className="logo" />
          <Menu theme="light" defaultSelectedKeys={['1']}
           mode="inline" style={{  background: 'orange'}}
           
           >
            <SubMenu onClick={this.subMenuHandle}
              key="sub1"
              title={
                <span>
                  <Icon type="pie-chart" />
                  <span>Manage Business</span>
                </span>
              }
              >
              <Menu.Item key="distributor" >Distributer
              <Link to="/managebusiness/distributor"/>
              </Menu.Item>
              <Menu.Item key="/manage-business/deliveryboy">Workers
              <Link to="/managebusiness/deliveryboy"/>
              </Menu.Item>
              <Menu.Item key="routeinfo">Routes
              <Link to="/managebusiness/routeinfo"/>
              </Menu.Item>
              <Menu.Item key="customer">Customer
              <Link to="/managebusiness/customer"/>
              </Menu.Item>
            </SubMenu>

            <SubMenu onClick={this.subMenuHandle}
              key="sub2"
              title={
                <span>
                  <Icon type="pie-chart" />
                  <span>Manage Daily</span>
                </span>
              }
              >
              <Menu.Item key="distributor" >Distributer Quata
              <Link to="/managedaily/distributorquota"/>
              </Menu.Item>
              <Menu.Item key="wholsaler">Wholsaler
              <Link to="/managedaily/wholesaler"/>
              </Menu.Item>
              <Menu.Item key="messages">Messages
              <Link to="/managedaily/messages"/>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: 'orange', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
              
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Manage Business</Breadcrumb.Item>
              <Breadcrumb.Item>{this.state.select}</Breadcrumb.Item>
            </Breadcrumb>
             <Route path="/managebusiness/routeinfo" component={RouteInfo} />
             <Route path="/managebusiness/deliveryboy" component={Deliveryboy} />
             <Route path="/managebusiness/customer" component={Customer} />
             <Route exact path="/managebusiness/distributor" component={Distributor} />

             <Route path="/managedaily/distributorquota" component={Distributorquota} />
             <Route path="/managedaily/wholesaler" component={Wholesaler} />
             <Route path="/managedaily/messages" component={Messages} />


          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
      </Router>
    );
  }
}

export default Dashboard;