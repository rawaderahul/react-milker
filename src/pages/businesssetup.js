import React,{Component} from 'react'
import { Steps, Button, message } from 'antd';
import DistributorInfo from '../components/distributorinfo'
import CreateRoutes from '../components/createroutes'
import CreateDeliveryBoys from '../components/createdeliveryboys'
import CreateCustomers from '../components/createcustomers'
import axios from 'axios';

const Step = Steps.Step;

class BusinessSetUP extends Component{
    constructor(props) {
        super(props);
        this.state = {
          current: 0,
          flag:true,
          DistributorInfoData:{},
          CreateRoutesData:[],
          CreateDeliveryBoysData:[],
          CreateCustomersData:[]
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
     
     
      DistributorInfo=(e)=> {
       this.setState({
        DistributorInfoData:e,
        flag:false
       })
     }
     CreateRoutes=(e)=> {
        this.setState({CreateRoutesData:e,flag:false})
      }
      CreateDeliveryBoys =(e)=> {
        this.setState({CreateDeliveryBoysData:e,flag:false})
        
      }
      CreateCustomers =(e)=> {
      this.setState({CreateCustomersData:e,flag:false})
      console.log(this.state.CreateCustomersData);
      
      }
      finish=()=> { 
        let  DistributorInfoData=this.state.DistributorInfoData;
        let serviceAreas=DistributorInfoData.serviceAreas.join(",");
        let servicePincodes=DistributorInfoData.servicePincodes.join(",");
        DistributorInfoData.serviceAreas=serviceAreas;
        DistributorInfoData.servicePincodes=servicePincodes;
        axios.post("http://127.0.0.1:8000/api/Distributer",DistributorInfoData).then((response) => {
          console.log(response.data);
        })
      }
      render(){
      const steps = [
        {
          title: 'Distributer',
          content: <DistributorInfo DistributorInfo={this.DistributorInfo} DistributorInfoData={this.state.DistributorInfoData}/>,
        },
        {
          title: 'Create Routes',
          content: <CreateRoutes flag={this.flag}
           CreateRoutes={this.CreateRoutes} 
           CreateRoutesData={this.state.CreateRoutesData}
           DistributorInfoData={this.state.DistributorInfoData}/>,
        },
        {
          title: 'Create Delivery Boys',
          content: <CreateDeliveryBoys flag={this.flag}
          CreateDeliveryBoysData={this.state.CreateDeliveryBoysData}
          CreateDeliveryBoys={this.CreateDeliveryBoys}
          CreateRoutesData={this.state.CreateRoutesData}
          />,
        },
        {
          title: 'Create Customers',
          content: <CreateCustomers flag={this.flag}
          CreateCustomersData={this.state.CreateCustomersData}
          CreateRoutesData={this.state.CreateRoutesData}
          CreateCustomers={this.CreateCustomers}
          />,
        },
      ];
        const { current } = this.state;
        return(
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
            </div>
        )
    }
}
export default BusinessSetUP;