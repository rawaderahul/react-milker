import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import MainHeader from './components/mainheader'
import { Layout } from 'antd';
import { Row, Col } from 'antd';
import CreateCustomer from './pages/createcustomer';
import BusinessSetUP from './pages/businesssetup';
import Dashboard from './pages/dashboardsetup';
import Home from './pages/home'
const { Content } = Layout;
function App() {
  return (
    <BrowserRouter >
      <Layout>
        <MainHeader ></MainHeader>
        
        <Content>
          <div style={{margin:10}}>
          <Row>
            <Col>  
              <Route exact path="/login" component={ Login } /> 
              <Route exact path="/register" component={ Register } /> 
              <Route exact path="/createcustomer" component={ CreateCustomer } /> 
              <Route exact path="/businesssetup" component={ BusinessSetUP } /> 
              <Route exact path="/managebusiness" component={ Dashboard } /> 

              <Route exact path="/" component={ Home } />   
            </Col>  
          </Row>
          </div>
        </Content>     
      </Layout>      
    </BrowserRouter>
  );
}

export default App;
