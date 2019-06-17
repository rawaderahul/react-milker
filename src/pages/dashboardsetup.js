import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import Distributor from '../dashboard/distributor';
import Customer from '../dashboard/customer';
import Deliveryboy from '../dashboard/workers';
import RouteInfo from '../dashboard/routeinfo';
import Distributorquota from '../dashboard/distributorquota';
import Wholesaler from '../dashboard/wholesaler';
import Messages from '../dashboard/messages';
import axios from 'axios';
import AnyRoute from '../dashboard/anyroute'

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

class Dashboard extends React.Component {
  constructor(){
    super();

    this.state = {
      collapsed: false,
      select:'Distributer Quata',
      selectWithMenu:['Distributer Quata','Manage Daily'],
      routeData:[],
      rid:null
      
    };
  }

  componentDidMount() {
    axios.get('http://127.0.0.1:8000/api/GetRoutesByDistributerId/1').then((response)=> {
    this.setState({routeData:response.data})
    })
  }
  

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };
  subMenuHandle=(e)=>{
  this.setState({select:e.key ,rid:e.item.props.id, selectWithMenu:e.keyPath})
  }
  
  condition=(select)=>{
    const { routeData }=this.state;
  let menu=  routeData.map((item) => {
  
    })

   switch(select) {
     case "Distributor" : return <Distributor/> ;
     case "Workers" :return  <Deliveryboy/>;
     case "Routes" :return  <RouteInfo/>;
     case "Customer" :return  <Customer/>;
     case "Distributer Quata" : return <Distributorquota/>;
     case "Wholesaler" :return  <Wholesaler/>;
     case "Messages" :return  <Messages/>;
     default:return  <AnyRoute rid={this.state.rid}/>;
   }

  }
  render() {
    const menu= this.state.routeData && this.state.routeData.map((item) => {
      return(
        <Menu.Item key={item.routeName} id={item.rid}>{item.routeName}</Menu.Item>
      );
    })
    return (
      <Layout style={{ minHeight: '100vh' }} className="dashboard">
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} style={{  background: '#FEFEFF'}} className="sidebar">
          <div className="logo" />
          <Menu theme="light" defaultSelectedKeys={['1']}
           mode="inline" style={{  background: '#FEFEFF'}}
           >
            <SubMenu className="submenu" onClick={this.subMenuHandle}
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
            <SubMenu className="submenu" onClick={this.subMenuHandle}
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
              {menu}
              
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