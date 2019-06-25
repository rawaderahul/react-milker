import React,{ Component } from 'react'
import { Carousel } from 'antd';
class HowSetUP extends Component {
    render(){
        return(
            <div>
                <h1> <span>How To Set Up Business </span> </h1>
                <div>
                    <Carousel autoplay>
                        <div>
                            <h3>1</h3>
                        </div>

                        <div>
                            <h3>2</h3>
                        </div>

                        <div>
                            <h3>3</h3>
                        </div>

                        <div>
                            <h3>4</h3>
                        </div>
                    </Carousel>
                </div>
            </div>
        )
    }
}
export default HowSetUP;