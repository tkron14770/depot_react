import React, { Component } from 'react';

import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import Grid from 'react-bootstrap/lib/Grid';
import Col from 'react-bootstrap/lib/Col';
import Collapse from 'react-bootstrap/lib/Collapse';
import Well from 'react-bootstrap/lib/Well';
import PageHeader from 'react-bootstrap/lib/PageHeader';
class App extends Component {

  constructor(...args){
	  super(...args);
	  this.state = {};
  }	
	
  render() {
    return (
    	<div>
		<Grid>
			<Row className="show-grid">
			<Col md={10}>&nbsp;</Col>
			</Row>
			<Row className="show-grid">
				<Col md={8}>Wertpapiere</Col>
				<Col md={2}>12.000,00</Col>
			</Row>
		</Grid>
		
		<Grid>	
			<Row className="show-grid" bsClass="bordertop">
				<Col md={1}><div onClick={ ()=> this.setState({ open: !this.state.open })} >974564</div></Col>
				<Col md={5}>Lupus alpha Fds Small German</Col>
				<Col md={1}>10</Col>
				<Col md={1}>9,36%</Col>
				<Col md={2}>3.584,00</Col>
			</Row>
		</Grid>	
		<Collapse in={this.state.open}>
		<Grid>	
			<Row className="show-grid">
				<Col md={1}>Lalala</Col>
				<Col md={5}>Lalala</Col>
				<Col md={1}>Lalal</Col>
				<Col md={1}>9,36%</Col>
				<Col md={2}>3.584,00</Col>
			</Row>
			<Row className="show-grid">
				<Col md={1}>Lalala</Col>
				<Col md={5}>Lalala</Col>
				<Col md={1}>Lalal</Col>
				<Col md={1}>9,36%</Col>
				<Col md={2}>3.584,00</Col>
			</Row>
		</Grid>	
        </Collapse>
		<Grid>
			<Row className="show-grid">
				<Col md={1}>A0Q41X</Col>
				<Col md={5}>IShares Barclays Capital Global Inflation-Linked Bond</Col>
				<Col md={1}>9</Col>
				<Col md={1}>25,47%</Col>
				<Col md={2}>1.258,47</Col>
			</Row>
		</Grid>
		
		
		</div>
    );
  }
}

export default App;
