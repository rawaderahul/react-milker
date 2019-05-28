import React,{Component} from 'react'
import { Steps, Button, message } from 'antd';
import DistributorInfo from '../components/distributorinfo'
import CreateRoutes from '../components/createroutes'
import CreateDeliveryBoys from '../components/createdeliveryboys'
import CreateCustomers from '../components/createcustomers'

const Step = Steps.Step;


class BusinessSetUP extends Component{
    constructor(props) {
        super(props);
        this.state = {
          current: 0,
          flag:true
        };
    }

      next() {
        const current = this.state.current + 1;
        this.setState({ current });
        this.setState({flag:true})
      }
    
      prev() {
        const current = this.state.current - 1;
        this.setState({ current });
      }
     
      nextFlag=(e)=> {
        this.setState({flag:false})
      }

    render(){
      const steps = [
        {
          title: 'Distributer',
          content: <DistributorInfo nextFlag={(e) => this.nextFlag(e)}/>,
        },
        {
          title: 'Create Routes',
          content: <CreateRoutes nextFlag={(e) => this.nextFlag(e)}/>,
        },
        {
          title: 'Create Delivery Boys',
          content: <CreateDeliveryBoys nextFlag={(e) => this.nextFlag(e)}/>,
        },
        {
          title: 'Create Customers',
          content: <CreateCustomers nextFlag={(e) => this.nextFlag(e)}/>,
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
                          <Button type="primary" onClick={() => message.success('Processing complete!')} disabled={this.state.flag}>
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