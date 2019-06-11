import React,{Component} from 'react'
import { Steps, Button, Layout, Menu,Icon,Modal } from 'antd';
import DistributorInfo from '../components/distributorinfo'
import CreateRoutes from '../components/createroutes'
import CreateDeliveryBoys from '../components/createdeliveryboys'
import CreateCustomers from '../components/createcustomers'
import axios from 'axios';
import  { Redirect } from 'react-router-dom'
const { Header, Content, Footer, Sider } = Layout;
// const { SubMenu } = Menu;
const Step = Steps.Step;

function countDown() {
  let secondsToGo = 5;
  const modal = Modal.success({
    title: 'Congratulation',
    content: `You have successfully setup business.`,
  });
  const timer = setInterval(() => {
    secondsToGo -= 1;
    modal.update({
      content: `You have successfully setup business.`,
    });
  }, 1000);
  setTimeout(() => {
    clearInterval(timer);
    modal.destroy();
  }, secondsToGo * 1000);
}

class BusinessSetUP extends Component{
    constructor(props) {
        super(props);
        this.state = {
          current: 0,
          flag:true,
          isRedirect:false
        };
    }

      next() {
        const current = this.state.current + 1;
        this.setState({ current });
        this.setState({flag:true})
      }
      flag=()=> {
      this.setState({flag:false})
      }
      prev() {
        const current = this.state.current - 1;
        this.setState({ current });
      }
     
      finish=()=> { 
        let DistributorInfoData = JSON.parse(sessionStorage.getItem('DistributorInfoData'))
        this.setState({isRedirect:true})
        let serviceAreas=DistributorInfoData.serviceAreas.join(",");
        let servicePincodes=DistributorInfoData.servicePincodes.join(",");
        DistributorInfoData.serviceAreas=serviceAreas;
        DistributorInfoData.servicePincodes=servicePincodes;
        axios.post("http://127.0.0.1:8000/api/Distributer",DistributorInfoData).then((response) => {
          console.log(response.data);
        })
        countDown();
      }
      render(){
      const steps = [
        {
          title: 'Distributer',
          content: <DistributorInfo flag={this.flag} />,
        },
        {
          title: 'Create Routes',
          content: <CreateRoutes flag={this.flag} />,
        },
        {
          title: 'Create Delivery Boys',
          content: <CreateDeliveryBoys flag={this.flag} />,
        },
        {
          title: 'Create Customers',
          content: <CreateCustomers flag={this.flag} />,
        },
      ];
        const { current } = this.state;
        return(
          <Layout style={{ minHeight: '100vh' }} >
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} style={{  background: 'orange'}}>
          <div className="logo" />
          <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" style={{  background: 'orange'}}>
            <Menu.Item key="1">
              <Icon type="pie-chart" />
              <span>Business Setup</span>
            </Menu.Item>
            
            </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: 'orange', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
          <div>
                <h1> <span>Setting Up Your Business </span>  </h1>
                  <div>
                    <Steps current={current}>
                      {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                      ))}
                    </Steps>
                    <div className="formbox">
                      <div className="steps-content">{steps[current].content}</div>
                      <div className="steps-action">
                        {current > 0 && (
                          <Button style={{ marginRight: 8 }} onClick={() => this.prev()}>
                            Previous
                          </Button>
                        )}
                        {current < steps.length - 1 && (
                          <Button type="primary" onClick={() => this.next()} disabled={this.state.flag}>
                            Next
                          </Button>
                        )}
                        {current === steps.length - 1 && (
                          <Button type="primary" onClick={this.finish} disabled={this.state.flag}>
                            Done
                          </Button>
                        )}
                      </div>  
                    </div>
                  </div>  
                  {
                    this.state.isRedirect ? <Redirect to ='/managebusiness'  />: null
                  }              
            </div>
           </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
        )
    }
}
export default BusinessSetUP;