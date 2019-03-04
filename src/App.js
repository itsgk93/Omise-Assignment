import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import fetch from 'isomorphic-fetch';

import { summaryDonations } from './helpers';
import { relative } from 'path';


const Card = styled.div`
  float: left;
  margin: 50px 150px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  width: 500px;
  height: 350px;
  border-radius: 5px;
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
`;
const Button = styled.button `
  background-color: white; 
  position: relative,
  right: 20px;
  border: none;
  padding: 5px 15px;
  height: fit-content;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 10px;
  cursor: pointer;
  color: blue; 
  border: 2px solid blue;
  margin: 10px;
  border-radius: 8px;
`;

export default connect((state) => state)(
  class App extends Component {
    constructor(props) {
      super();
      this.state = {
        charities: [],
        selectedAmount: 10,
        clickCheck: true,
      };
      this.clickHandler =this.clickHandler.bind(this)
    }

    componentDidMount() {
      const self = this;
      fetch('http://localhost:3001/charities')
        .then(function(resp) { return resp.json(); })
        .then(function(data) {
          self.setState({ charities: data }) });

      fetch('http://localhost:3001/payments')
        .then(function(resp) { return resp.json() })
        .then(function(data) {
          self.props.dispatch({
            type: 'UPDATE_TOTAL_DONATE',
            amount: summaryDonations(data.map((item) => (item.amount))),
          });
        })
    }

    clickHandler() {
      this.setState({
        clickCheck: false,
      })
    }

    render() {
      const self = this;
      const cards = this.state.charities.map(function(item, i) {
        const imgKey = require(`../public/images/${item.image}`);
        const payments = [10, 20, 50, 100, 500].map((amount, j) => (
          <label key={j}>
              <input
              type="radio"
              name="payment"
              onClick={function() {
                self.setState({ selectedAmount: amount })
              }} /> {amount}
          </label>
        ));
        const paymentStyle = {
          display: 'inline-block',
          position: 'relative',
          top: '100px',
          left:'100px'        };

        return (
          <Card key={i}>
          {self.state.clickCheck ? 
            (
              <div>
            <img src={imgKey} alt="" style={{width:"500px", height:"300px"}} />
            <div style={{display: "flex"}}>
              <p style={{width: '90%'}}>{item.name}</p> <Button onClick={self.clickHandler}> Donate </Button>
              </div>
              </div>
            )
            : ( 
             <div style={paymentStyle}> 
              {payments}
            <div><button onClick={handlePay.call(self, item.id, self.state.selectedAmount, item.currency)} 
             style={{'margin-left': '100px', 'margin-top': '30px', border: '1px solid blue',
           'border-radius': '5px'}}>Pay</button></div>
            </div>
            )}
          </Card>
        );
      });

      const style = {
        color: 'red',
        margin: '1em 0',
        fontWeight: 'bold',
        fontSize: '16px',
        textAlign: 'center',
      };
      const donate = this.props.donate;
      const message = this.props.message;

      return (
        <div>
          <div style={{textAlign:'center'}}><h1>Tamboon React</h1>
          <p>All donations: {donate}</p>
          <p style={style}>{message}</p>
          </div>
          {cards}
        </div>
      );
    }
  }
);

function handlePay(id, amount, currency) {
  const self = this;
  return function() {
    fetch('http://localhost:3001/payments', {
      method: 'POST',
      body: `{ "charitiesId": ${id}, "amount": ${amount}, "currency": "${currency}" }`,
    })
      .then(function(resp) { return resp.json(); })
      .then(function() {
        self.props.dispatch({
          type: 'UPDATE_TOTAL_DONATE',
          amount,
        });
        self.props.dispatch({
          type: 'UPDATE_MESSAGE',
          message: `Thanks for donate ${amount}!`,
        });

        setTimeout(function() {
          self.props.dispatch({
            type: 'UPDATE_MESSAGE',
            message: '',
          });
        }, 2000);
      });
  }
}
