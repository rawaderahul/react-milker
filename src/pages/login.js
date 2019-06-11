import React,{Component} from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { Link } from 'react-router-dom'

class Login1 extends Component{

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
    };

    render(){
        const { getFieldDecorator } = this.props.form;

        return(
          <div>
            <h1> <span>LogIn</span> </h1>
            <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox>Remember me</Checkbox>)}
              <Link className="login-form-forgot" to="">
                Forgot password
              </Link>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
              Or  <Link to="/register" > register now! </Link> 
            </Form.Item>
          </Form>
          </div>
        )
    }
}


const Login = Form.create({ name: 'normal_login' })(Login1);
export default Login;