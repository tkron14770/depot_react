import React, { Component } from 'react';

import CouponOverlay from './couponoverlay.js'
import UmsatzOverlay from './umsatzoverlay.js'
import Group from './Group.js'
import './App.css';
import Row from 'react-bootstrap/lib/Row';
import Grid from 'react-bootstrap/lib/Grid';
import Col from 'react-bootstrap/lib/Col';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import * as axios from 'axios';


class App extends Component {

   constructor(...args){
	  super(...args);
	  this.state ={ umsatzOverlayShow: false,
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
  
  loadData = (datum, sort) => {
	  var url = 'http://localhost:8080/depotAuszug?datum='+datum+'&sort='+sort;
	  console.log("Load data:"+datum+":"+sort);
	  axios.get(url)
		.then(response => {
			this.setState({data:response.data, datum:datum, sort:sort});
		})
		.catch(function (error) {
			console.log(error);
		});
 }
 
 
  handleDatumChange = () => {
	   const datum = this._datum.value;
	   this.loadData(datum, this.state.sort);
  };
  
 
  
  componentDidMount(){
	this.loadData(this, this.datumText, 'wkn');
  }
  
 
 
  
 
  render() {
	var groupList; 
	var gesamtWert;
	var self = this;
	
	
	
	if (this.state != null){
		groupList = this.state.data.groups.map(function(group, index){
		return <Group key={"group"+index+self.state.datum+self.state.sort} group={group} index={index} load={self.loadData} umsatzoverlay={self._umsatzoverlay} couponoverlay={self._couponoverlay} parent={self}/>;
	});
		gesamtWert=this.state.data.saldo;
	} 
                    
	return (
    	<div>
		<Nav bsStyle="tabs" activeKey="1" onSelect={this.handleSelect}>
        <NavItem eventKey="1" href="/home">Depotübersicht</NavItem>
        <NavItem eventKey="2" title="Item">Strukturübersicht</NavItem>
        <NavItem eventKey="3" disabled>NavItem 3 content</NavItem>
        <NavDropdown eventKey="4" title="Dropdown" id="nav-dropdown">
          <MenuItem eventKey="4.1">Wertpapier erfassen</MenuItem>
          <MenuItem eventKey="4.2">Depoteintrag erfassen</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey="4.4">Separated link</MenuItem>
        </NavDropdown>
      </Nav>
		<Grid>

			<Row>
				<Col md={8} sm={8}> 
					 Auszugdatum: <input type="text" maxLength="10" defaultValue={this.datumText} ref={input => this._datum = input} onBlur={this.handleDatumChange}/>
        			
  		</Col>
				<Col md={4} sm={4} className="alignRight end"><b>Gesamtwert: {gesamtWert} EUR</b></Col>
			</Row>
		</Grid>		
		{groupList}
		<UmsatzOverlay ref={UmsatzOverlay => this._umsatzoverlay = UmsatzOverlay}/>
		<CouponOverlay ref={CouponOverlay => this._couponoverlay = CouponOverlay}/>
		</div>
    );
  }
}

export default App;
