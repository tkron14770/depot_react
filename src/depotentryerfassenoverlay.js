import React, { Component } from 'react';

import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import UmsatzOverlay from './umsatzoverlay.js'
import './App.css';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import DepotOverview from './depotoverview.js'
    
import * as axios from 'axios';


export default class DepotEntryErfassungOverlay extends Component{
	
	constructor(...props){ 
		
	  super(...props);
	  console.log("props"+this.props.parent);
	  this.state={show:false, wpBekannt: false, wkn:'', name:'', depot:'coba', 
	              entryVorhanden:false, entryId:0, segment:0,
				  segmentList:{}};
	}
	
	close =() => {
	  this.setState({show:false});
	}
	
	show = () => {
		this.setState({show:true});
	}
	
	changeDepot = (event) => {
		console.log("Change Depot:"+event.target.value);
		this.setState({depot:event.target.value});
		this.searchDepotEntry(event.target.value, this.state.wkn);
	}
	
	changeWkn = (event) => {
	 
	  console.log("Search Wkn:"+event.target.value);
	  this.setState({wkn:event.target.value});
	  this.searchDepotEntry(this.state.depot,event.target.value);
	}
	
	changeName = (event) => {
		console.log("change Name");
		this.setState({name:event.target.value});
	}
	
	changeSegment = (event) => {
		console.log("change Segment:"+event.target.value);
		this.setState({segment:event.target.value});
	}
	
	
	searchDepotEntry = (depot, wkn) => {
		var len = wkn.length;
		if (len >= 6){
		  // search for wkn
		  console.log("search for:"+wkn+","+depot);
	  	  var url = 'http://localhost:8080/searchDepotEntry?wkn='+wkn+'&depot='+depot;
		  axios.get(url)
	    	.then(response => {
				console.log(response.data.wpBekannt+"entry"+response.data.entryVorhanden+"entryId:"+response.data.entryId);

				if (!response.data.wpBekannt){
					this.setState({wpBekannt:response.data.wpBekannt, 
				               entryVorhanden:response.data.entryVorhanden, entryId:response.data.entryId});
					console.log("load segmente");
					url = 'http://localhost:8080/retrieveSegmente';
					axios.get(url)
						.then(response => {
							this.setState({segmentlist:response.data});
						})
				} else {
					this.setState({name:response.data.name, wpBekannt:response.data.wpBekannt, 
				               entryVorhanden:response.data.entryVorhanden, entryId:response.data.entryId});
				} 
						   
			})
			.catch(function (error) {
				console.log(error);
			});
		} else {
				console.log("not called")
		}
	}
	
	wknAnlegen = () => {
		console.log("Wkn neu anlegen");
		var url = 'http://localhost:8080//addWertpapier?wkn='+this.state.wkn+'&name='+this.state.name+
		           '&segmentId='+this.state.segment;
		 
		 axios.get(url)
	    	.then(response => {
				console.log("WKN Anlegt:"+response.data);
				this.entryAnlegen();
			})
			.catch(function (error) {
				console.log(error);
			});
	}
	
	
	entryAnlegen = () => {
		console.log("DepotEntry neu anlegen");
		 var url = 'http://localhost:8080/addDepotEntry?wkn='+this.state.wkn+'&depot='+this.state.depot;
		 
		 axios.get(url)
	    	.then(response => {
				console.log("Anlegen:"+response.data);
				this.setState({entryId:response.data});
				this.umsatzErfassen(response.data);
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	umsatzErfassen = (entryId) => {

		entryId = this.state.entryId;
		console.log("umsatzErfassen:"+entryId);
		this.props.parent._umsatzOverlay.displayUmsaetze(this.state.wkn+" - "+this.state.name, entryId);
		this.setState({show:false, wpBekannt: false, wkn:'', name:'', depot:'coba', 
	                entryVorhanden:false, entryId:0, segment:0,
					segmentList:{}});
		
	}
	
	render() {
		var wknInfo = "";
		if (this.state.wpBekannt == true){
			wknInfo = <div>Name:&nbsp;{this.state.name}</div>;
		} else if (this.state.wkn.length==6){
			if (this.state.segmentlist){
				var segmentList = this.state.segmentlist.map(function(segment, index){
					return <option key={'segment'+index} value={segment.id}>{segment.displayText}</option>;
				});
			}	
		
			wknInfo=<div>
			        <label>Name:</label>
			        <input type="text" onChange={this.changeName} value={this.state.name}/>
					<br/>
					<label>Segment:</label>
					<select value={this.state.segment} onChange={this.changeSegment}>
						<option value="0">Bitte auswählen</option>
						{segmentList}
					</select>	
					<br/>
					<Button onClick={this.wknAnlegen}>Wertpapier und Depoteintrag anlegen</Button>
					</div>
					
		}
		
		
		var buttonLeiste = "";
		if (this.state.wpBekannt && !this.state.entryVorhanden){
			buttonLeiste = <Button onClick={this.entryAnlegen}>Depoteintrag neu anlegen</Button>;
		} else if (this.state.wpBekannt) {
			buttonLeiste = <Button onClick={this.umsatzErfassen}>Umsatz erfassen</Button>;
		}
		return (
			<Modal show={this.state.show} onHide={this.close} bsSize="large" aria-labelledby="contained-modal-title-lg">
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-lg">Erfassung Depoteintrag</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form>
					<label>Depot:&nbsp;</label>
					<select value={this.state.depot} onChange={this.changeDepot} default='coba'>
						<option value="coba">Commerzbank</option>
						<option value="cobavv">Commerzbank Vermögensverwaltung</option>
						<option value="comdirect">Comdirect</option>
					</select>
						<br/>
					<label>Wkn:&nbsp;</label>
					<input type="text" onChange={this.changeWkn} value={this.state.wkn}/>
					{wknInfo}
				</form>
				{buttonLeiste}
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={this.close}>Schließen</Button>
			</Modal.Footer>
		</Modal>
		);
	}
}