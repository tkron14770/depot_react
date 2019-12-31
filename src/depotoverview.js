import React, { Component } from 'react';

import CouponOverlay from './couponoverlay.js'
import UmsatzOverlay from './umsatzoverlay.js'
import Group from './Group.js'
import Row from 'react-bootstrap/lib/Row';
import Grid from 'react-bootstrap/lib/Grid';
import Col from 'react-bootstrap/lib/Col';


import * as axios from 'axios';


export default class DepotOverview extends Component {

   constructor(...args){
	  super(...args);
	  this.state ={ show: false,
					umsatzOverlayShow: false,
					umsatzDisplayed: '',
					couponOverlayShow: false,
					performance: 'gesamt',
					sort: 'wkn',
					datum:'',
	                data:{groups:[],
						 saldo:''}
	  };
	  
	  
    var datum = new Date();
	var options = {year: 'numeric', month: 'numeric', day: 'numeric' };
	this.datumText=datum.toLocaleString('de-DE',options);
	  };
  
  loadData = (datum, sort,performance) => {
	  var url = 'http://localhost:8080/depotAuszug?datum='+datum+'&sort='+sort+"&performance="+performance;
	  console.log("Load data:"+datum+":"+sort+":"+performance);
	  axios.get(url)
		.then(response => {
			this.setState({data:response.data, datum:datum, sort:sort, performance:performance});
		})
		.catch(function (error) {
			console.log(error);
		});
 }
 
 
  handleDatumChange = () => {
	   const datum = this._datum.value;
	   this.loadData(datum, this.state.sort, this.state.performance);
  };
  
  show = () => {
	  this.loadData(this.datumText, 'wkn','gesamt');
	  this.setState({show:true});
  }
  
  hide = () => {
	  this.setState({show:false});
  }
  
  componentDidMount(){
	this.loadData(this.datumText, 'wkn','gesamt');
  }
  
 changePerformance = (event) => {
		console.log("change Performance:"+event.target.value);
		this.loadData(this.state.datum, this.state.sort, event.target.value);
	
	}
 
  
 
  render() {
	
	if (!this.state.show){
		return null;
	}
	
	var groupList; 
	var gesamtWert;
	var self = this;
	
	console.log("Render overview with performance:"+self.state.performance);
	
	
	if (this.state != null){
		groupList = this.state.data.groups.map(function(group, index){
			var level=1;
		return <Group key={"group"+index+self.state.datum+self.state.sort+self.state.performance} group={group} index={index} load={self.loadData} 
		              umsatzoverlay={self._umsatzoverlay} couponoverlay={self._couponoverlay} parent={self} performance={self.state.performance} level={level}/>;
	});
		gesamtWert=this.state.data.saldo;
	} 
                            
	return (
    	<div>
		<Grid>
			<Row>
			<Col md={8} sm={8}>&nbsp;</Col>
			</Row>
			<Row>
				<Col md={4} sm={4}> 
					 Auszugdatum: <input type="text" maxLength="10" defaultValue={this.datumText} ref={input => this._datum = input} onBlur={this.handleDatumChange}/>
        		</Col>
				<Col md={4} sm={4}> 
					 Performance: <select value={this.state.segment} onChange={this.changePerformance}>
									<option value="gesamt">Gesamt</option>
									<option value="jahr">pro Jahr</option>
									<option value="coupon">Coupon</option>
								   </select>
        		</Col>
				<Col md={4} sm={4} className="alignRight end"><b>Gesamtwert: {gesamtWert} EUR</b></Col>
			</Row>
		</Grid>		
		{groupList}
		<p>&nbsp;</p>
		<UmsatzOverlay ref={UmsatzOverlay => this._umsatzoverlay = UmsatzOverlay}/>
		<CouponOverlay ref={CouponOverlay => this._couponoverlay = CouponOverlay}/>
		</div>
    );
  }
}


