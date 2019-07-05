import React,{Component} from 'react'
import { Steps, Button, Layout, Menu,Icon,Modal } from 'antd';
import DistributorInfo from '../components/distributorinfo'
import CreateRoutes from '../components/createroutes'
import CreateDeliveryBoys from '../components/createdeliveryboys'
import CreateCustomers from '../components/createcustomers'
import { postDistributorInfo } from '../services/distributor/distributorInfo';
import { postRoutesInfo } from '../services/route/routesInfo';
import { postWorkerDetail } from '../services/worker/workersInfo';
import { postCustomerInfo } from '../services/customer/customerInfo';
import  { Redirect } from 'react-router-dom'
const { Header, Content, Footer, Sider } = Layout;
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
          isRedirect:false,
          CreateRoute:[],
          CreateDeliveryBoys:[],
          clicked:false
        };
    }

      next=()=> {
        const current = this.state.current + 1;
        this.setState({ current });
        this.setState({flag:true})
      }
      flag=()=> {
      this.setState({flag:false})
      }
      prev=()=> {
        const current = this.state.current - 1;
        this.setState({ current });
      }

     CreateRoutes= () => {
        let CreateRoutesData = JSON.parse(sessionStorage.getItem('CreateRoutesData'));
        let distributerid = JSON.parse(sessionStorage.getItem('distributerid'))
        var CreateRoute=[];
         CreateRoutesData.map( (item2) => {
          item2.distributerid=distributerid;
          item2.routeAreas=item2.routeAreas.join(",");
          item2.routePincodes=item2.routePincodes.join(",");

          postRoutesInfo(item2).then((response2) => {
            CreateRoute.push({id:response2.data.id,name:response2.data.RouteName})
            console.log("Ok route");
            window.sessionStorage.setItem("CreateRoute", JSON.stringify(CreateRoute));
            if(CreateRoute.length===CreateRoutesData.length) {
              this.CreateDeliveryBoys();
            }
          })
        })
      }

      CreateDeliveryBoys=()=> {
        let CreateRoute = JSON.parse(sessionStorage.getItem('CreateRoute'));
        let CreateDeliveryBoysData = JSON.parse(sessionStorage.getItem('CreateDeliveryBoysData'))
          let distributerid = JSON.parse(sessionStorage.getItem('distributerid'));
          var CreateDeliveryBoys=[]
          CreateDeliveryBoysData.map((item3) => {
            item3.distributerid=distributerid;
            CreateRoute.map((value3) => {
              if(value3.name==item3.route) {
                item3.routeid=value3.id;
                item3.distributerid=distributerid;
                postWorkerDetail(item3).then((response3) => {
                  console.log("ok Boy");
                  CreateDeliveryBoys.push({id:response3.data.id,name:response3.data.WorkerName})
                   window.sessionStorage.setItem("CreateDeliveryBoys", JSON.stringify(CreateDeliveryBoys));
                   if(CreateDeliveryBoys.length === CreateDeliveryBoysData.length) {
                    this.CreateCustomers();
                  }
                  })
              }
            })
          })
      }

      CreateCustomers=()=> {
         let CreateCustomersData = JSON.parse(sessionStorage.getItem('CreateCustomersData'))
         let distributerid = JSON.parse(sessionStorage.getItem('distributerid'));
         let CreateRoute = JSON.parse(sessionStorage.getItem('CreateRoute'));
         let CreateCustomers = []
           CreateCustomersData.map((item4) => {
             item4.distributerid=distributerid;
             CreateRoute.map((value4) => {
               if(value4.name==item4.routeName) {
                 item4.routeid=value4.id;
                 postCustomerInfo(item4).then((response4) => {
                   console.log("ok customer");
                   CreateCustomers.push(response4.data.id)
                   if(CreateCustomers.length === CreateCustomersData.length) {
                     countDown();
                     this.setState({isRedirect:true})  
                  }
               })
               }
             })
           })
       }

      finish =  async()=> { 
        let DistributorInfoData = JSON.parse(sessionStorage.getItem('DistributorInfoData'))
        let serviceAreas=DistributorInfoData.serviceAreas.join(",");
        let servicePincodes=DistributorInfoData.servicePincodes.join(",");
        DistributorInfoData.serviceAreas=serviceAreas;
        DistributorInfoData.servicePincodes=servicePincodes;
        postDistributorInfo(DistributorInfoData).then(async(response1) => {
          window.sessionStorage.setItem("distributerid", JSON.stringify(response1.data.id));
          console.log("ok distributor");
         await this.CreateRoutes()
        })
      }

      
      handleChange=()=>{
        this.setState({clicked:false});
      }
      render(){
      const steps = [
        {
          title: 'Distributer',
          content: <DistributorInfo flag={this.flag} next={this.next} 
          clicked={this.state.clicked}
          handleChange={this.handleChange}/>,
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
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} style={{  background: '#f7f7f7'}}>
          <div className="logo" />
          <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" style={{  background: '#f7f7f7'}}>
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
                        
                        {current < steps.length - 1 && current !== 0 && (
                          <Button type="primary" onClick={() => this.next()} disabled={this.state.flag}>
                            Next
                          </Button>
                        )}
                        {current === 0 && (
                          <Button type="primary" onClick={() => this.setState({clicked:true})} >
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
