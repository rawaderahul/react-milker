import React,{Component} from 'react'
import { Steps, Button, message } from 'antd';
import DistributorInfo from '../components/distributorinfo'
import CreateRoutes from '../components/createroutes'
import CreateDeliveryBoys from '../components/createdeliveryboys'
import CreateCustomers from '../components/createcustomers'

const Step = Steps.Step;
const steps = [
  {
    title: 'Distributer',
    content: <DistributorInfo />,
  },
  {
    title: 'Create Routes',
    content: <CreateRoutes />,
  },
  {
    title: 'Create Delivery Boys',
    content: <CreateDeliveryBoys />,
  },
  {
    title: 'Create Customers',
    content: <CreateCustomers />,
  },
];

class BusinessSetUP extends Component{
  constructor(props) {
      super(props);
      this.state = {
        current: 0,
      };
  }
  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  render(){
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
                <Button type="primary" onClick={() => this.next()}>
                  Next
                </Button>
              )}
              {current === steps.length - 1 && (
                <Button type="primary" onClick={() => message.success('Processing complete!')}>
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