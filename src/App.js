import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom'

import Login from './pages/login'
import Register from './pages/register'
import MainHeader from './components/mainheader'


import { Layout } from 'antd';
import { Row, Col } from 'antd';
import CreateCustomer from './pages/createcustomer';
import BusinessSetUP from './pages/businesssetup';
import Home from './pages/home'
const { Header, Content, Footer } = Layout;




function App() {
  return (
    <BrowserRouter >
      <Layout>
        <MainHeader ></MainHeader>
        
        <Content>
          <div className="container py-3">
          <Row>
            <Col>  
              <Route exact path="/login" component={ Login } /> 
              <Route exact path="/register" component={ Register } /> 
              <Route exact path="/createcustomer" component={ CreateCustomer } /> 
              <Route exact path="/businesssetup" component={ BusinessSetUP } /> 
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
