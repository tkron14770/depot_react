import React, { Component } from 'react';

import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import UmsatzOverlay from './umsatzoverlay.js'
import DepotEntryErfassungOverlay from './depotentryerfassenoverlay.js'
import './App.css';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import DepotOverview from './depotoverview.js'
import DepotStructure from './depotstructure.js'
    
import * as axios from 'axios';


class App extends Component {

   constructor(...args){
	  super(...args);
	  this.state ={ nav:"1",
					umsatzOverlayShow: false,
					umsatzDisplayed: '',
					couponOverlayShow: false,
					sort: 'wkn',
					datum:'',
	                data:{groups:[],
						 saldo:''}
	  };

	  
    var datum = new Date();
	var options = {year: 'numeric', month: 'numeric', day: 'numeric' };
	this.datumText=datum.toLocaleString('de-DE',options);
	  };
  
  
 
 
 
  
  componentDidMount(){
	  this._depotoverview.show();
  }
  
 
   handleSelectDepotEntryErfassung = () => {
	  this._depotentryerfassungoverlay.show(); 
   }
  
  handleKursUpload = () => {
	  this._kursuploadoverlay.show();
  }
  
  handleSelect(eventKey) {
		event.preventDefault();
		if (eventKey == "1"){
			this.setState({nav:"1"});
			this._depotoverview.show();
			this._depotstructure.hide();
			
		} 
		else if (eventKey == "2"){
			this.setState({nav:"2"});
			this._depotoverview.hide();
			this._depotstructure.show();
		}
		if (eventKey=="4.1") {this.handleSelectDepotEntryErfassung();}
		if (eventKey=="4.4") {this.handleKursUpload();}
		
	}
 
  render() {
	
    console.log("overlay="+this._umsatzOverlay);                
	return (
    	<div>
		<p>&nbsp;</p>
		<Nav bsStyle="tabs" activeKey={this.state.nav} onSelect={k => this.handleSelect(k)}>
        <NavItem eventKey="1" href="/home">Depotbestand</NavItem>
        <NavItem eventKey="2" title="Item">Struktur Bestand</NavItem>
        <NavItem eventKey="3" disabled>NavItem 3 content</NavItem>
        <NavDropdown eventKey="4" title="Datenerfassung" id="nav-dropdown">
            <MenuItem eventKey="4.1" o>Depoteintrag erfassen</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey="4.4" >Kurs Upload</MenuItem>
        </NavDropdown>
      </Nav>
		<DepotOverview ref={DepotOverview => this._depotoverview = DepotOverview}/>
		<DepotStructure ref={DepotStructure => this._depotstructure = DepotStructure}/>
        <UmsatzOverlay ref={UmsatzOverlay => this._umsatzOverlay = UmsatzOverlay}/>
		<DepotEntryErfassungOverlay ref={DepotEntryErfassungOverlay => this._depotentryerfassungoverlay = DepotEntryErfassungOverlay}
                                    parent ={this}/>
	<KursUploadOverlay ref={KursUploadOverlay => this._kursuploadoverlay = KursUploadOverlay} />
	  </div>	
    );
  }
}




class KursUploadOverlay extends Component{
	
	constructor(...props){ 
		
	  super(...props);
	  console.log("props"+this.props.parent);
	  this.state={show:false};
	}
	
	close =() => {
	  this.setState({show:false});
	}
	
	show = () => {
		this.setState({show:true});
	}
	
		render() {
				
		return (
			<Modal show={this.state.show} onHide={this.close} bsSize="large" aria-labelledby="contained-modal-title-lg">
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-lg">Kurs Upload</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form action="http://localhost:8080/uploadKurse" method="POST" enctype="multipart/form-data">
				File: <input type="file" name="file"/><br/>
				Datum: <input name="datum"/><br/>
				<input type="submit" value="Upload"/> 
  
			</form>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={this.close}>Schließen</Button>
			</Modal.Footer>
		</Modal>
		);
	}
}
export default App;
