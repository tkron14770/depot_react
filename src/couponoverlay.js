import React, { Component } from 'react';
import './App.css';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import Table from 'react-bootstrap/lib/Table';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import * as axios from 'axios';


export default class CouponOverlay extends Component {
	
	constructor(...args){
	  super(...args);
	  this.state={show:false, display:"liste", entryId:"", fehlermeldung:""};
	 
	}
	
	displayCoupons(couponsDisplayed, entryId){
		 var url = 'http://localhost:8080/depotEntryCoupons?id='+entryId;
	  console.log("Load coupons:"+entryId);
	  axios.get(url)
		.then(response => {
			this.setState({entryId:entryId, data:response.data, show:true, couponsDisplayed:couponsDisplayed, display:"liste"});
		})
		.catch(function (error) {
			console.log(error);
		});
		
		
	}
	
	close =() => {
	  this.setState({show:false});
	}
	
	eingabe =() => {
	  this.setState({display:"eingabe"});
	}
	
	erfassen =() => {
	  console.log("Erfassen:"+this.datum.value+","+this.betrag.value);	
	   var url = 'http://localhost:8080/addCoupon?id='+this.state.entryId+"&datum="+this.datum.value+"&wert="+this.betrag.value;
	   console.log(url);	
	   axios.get(url)
		.then(response => {
			 console.log("REST done:"+response.data);
			 if (response.data==='OK'){
				this.displayCoupons(this.state.couponsDisplayed, this.state.entryId);
			 } else {
				 this.setState({fehlermeldung:response.data});
			 }
		})
		.catch(function (error) {
			console.log(error);
		});
	  
	 

	}
	
	render(){
		var list;
		var body;
		var header;
		
		if ((this.state.data != null) && (this.state.display === "liste")){
			console.log("render");
			header = "Coupons für "+this.state.couponsDisplayed;
			list = this.state.data.map(function(coupon, index){
				return (<tr key={"coupons"+index}>
							<td className="textMed">{coupon.datum}</td>
							<td className="textMed alignRight">{coupon.gesamtBetrag} EUR</td>
							<td className="textMed alignRight">{coupon.dividendeProStueck} EUR</td>
							<td className="textMed alignRight">{coupon.rendite}%</td>
							<td>&nbsp;</td>
						</tr>);
			});
			body = (<Table responsive>
					<thead>
						<tr>
							<th className="textMed" >Datum</th>
							<th className="textMed alignRight">Betrag</th>
							<th className="textMed alignRight">pro Stück</th>
							<th className="textMed alignRight">Rendite</th>
							<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
						</tr>	
					</thead>
					<tbody>	
						{list}
					</tbody>	
				</Table>);
		
		} else if (this.state.display==="eingabe"){
			console.log("render eingabe");
			header = "Coupon-Eingabe für "+this.state.couponsDisplayed;
			body = (<div>
					{this.state.fehlermeldung} 
					<Form horizontal>
						<FormGroup controlId="formHorizontalDatum">
							<Col componentClass={ControlLabel} sm={2}>Datum</Col>
							<Col sm={3}>
								<FormControl type="text" placeholder="Datum" inputRef={ref => { this.datum = ref; }}/>
							</Col>
						</FormGroup>

						<FormGroup controlId="formHorizontalBetrag">
							<Col componentClass={ControlLabel} sm={2}>Betrag</Col>
							<Col sm={3}>
								<FormControl type="text" placeholder="Betrag" inputRef={ref => { this.betrag = ref; }}/>
							</Col>
						</FormGroup>
						
						<FormGroup>
							<Col smOffset={2} sm={3}>
								<Button onClick={this.erfassen}>Erfassen</Button>
							</Col>
						</FormGroup>
					</Form>
					</div>);
		} 
		
		return(
		
			<Modal show={this.state.show} onHide={this.close} bsSize="large" aria-labelledby="contained-modal-title-lg">
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-lg">{header}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			{body}
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={this.eingabe}>Eingabe</Button><Button onClick={this.close}>Schließen</Button>
			</Modal.Footer>
		</Modal>)
	}
	
	
}