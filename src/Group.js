import React, { Component } from 'react';


import './App.css';
import Row from 'react-bootstrap/lib/Row';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Col from 'react-bootstrap/lib/Col';
import Collapse from 'react-bootstrap/lib/Collapse';
import Panel from 'react-bootstrap/lib/Panel';

class Entry extends Component{
	constructor (props){
		super(props);
		this.state = {entry:props.entry,
				      index: props.index,
					  performance: props.performance,
					  open: false};
		this.openEntry.bind(this);
	};
	
	openEntry(){
		this.setState({open:!this.state.open});
	};
	
	render(){
		var performanceClass = "green alignRight";
		var performance = '';
		console.log("Entry Performance Props:"+this.props.performance);
		if (this.props.performance == 'gesamt'){performance = this.state.entry.performanceProzent+"%";}
		else if (this.props.performance == 'jahr'){performance = this.state.entry.performanceProzJahr+"%";}
		else {performance = this.state.entry.couponsProzJahr+"%";}
		if (performance.startsWith("-")){
			performanceClass = "red alignRight";
		} 
		return 	<div class="background-grey">
				<Grid>	
				<Row>
					<Col md={1} sm={1} className="link borderLeft start"><div onClick={()=>this.openEntry()}>{this.state.entry.wkn}</div></Col>
					<Col md={1} sm={1} className="alignRight">{this.state.entry.anzahl}</Col>
					<Col md={4} sm={4}>{this.state.entry.name}</Col>
					<Col md={1} sm={1} className="alignRight">{this.state.entry.laufzeit}</Col>
					<Col md={2} sm={2} className={performanceClass}>{performance}</Col>
					<Col md={1} sm={1} className="alignRight">{this.state.entry.anteil}%</Col>
					<Col md={2} sm={2} className="alignRight end">{this.state.entry.wert} EUR</Col>
				</Row>
				</Grid>	
				<Collapse in={this.state.open}>
				<Grid>	
						<Row >
						<Col md={3} sm={3} className="textMed borderTop">Segment:&nbsp;{this.state.entry.hauptSegment} {this.state.entry.segment}</Col>
						<Col md={3} sm={3} className="alignRight borderTop textMed">&nbsp;</Col>
						<Col md={4} md={4} className="textMed borderTop">Kurs: {this.state.entry.kurs} EUR ({this.state.entry.kursDatum})</Col>
					
					</Row>
					<Row>   
						<Col md={2} sm={2} className="textMed">Einstandskurs:</Col>
						<Col md={2} sm={2} className="textMed alignRight">{this.state.entry.einstandsWert} EUR</Col>
						<Col md={2} sm={2} className="alignRight textMed">&nbsp;</Col>
						<Col md={3} md={3} className="textMed">letzter Umsatz: {this.state.entry.letzterUmsatz}</Col>
						<Col md={1} sm={1}><Button bsSize="xsmall" onClick={()=> this.props.umsatzoverlay.displayUmsaetze(this.state.entry.wkn+" "+this.state.entry.name, this.state.entry.entryId)}>Umsätze</Button></Col>
					</Row>
					<Row>   
						<Col md={2} sm={2} className="textMed">durch. angelegt:</Col>
						<Col md={2} sm={2} className="alignRight textMed">{this.state.entry.durchschnittAngelegt} EUR</Col>
						<Col md={2} sm={2} className="alignRight textMed">&nbsp;</Col>
						<Col md={3} sm={3} className="textMed">Laufzeit:&nbsp; {this.state.entry.laufzeit} Jahre</Col>
						<Col md={1} sm={1}><Button bsSize="xsmall" onClick={()=> this.props.couponoverlay.displayCoupons(this.state.entry.wkn+" "+this.state.entry.name, this.state.entry.entryId)}>Coupons</Button></Col>
						
					</Row>
					<Row >
						
						<Col md={3} sm={3} className="textMed padTop"><b>Performance</b></Col>
						<Col md={3} md={3} className="textMed padTop">&nbsp;</Col>
						
					</Row>
					<Row>
						
						<Col md={1} sm={1} className="textMed">Coupons:</Col>
						<Col md={2} sm={2} className="textMed alignRight">{this.state.entry.couponsAbsolut} EUR</Col>
						<Col md={1} sm={1} className="textMed alignRight">{this.state.entry.couponsProzent}%</Col>
						<Col md={2} sm={2} className="alignRight textMed">pro Jahr: {this.state.entry.couponsProzJahr}%</Col>
						<Col md={4} sm={4} className="alignRight textMed">&nbsp;</Col>
					</Row>
					<Row>

						<Col md={1} sm={1} className="textMed">Kursgewinn:</Col>
						<Col md={2} sm={2} className="textMed alignRight">{this.state.entry.diffAbsolut} EUR</Col>
						<Col md={1} sm={1} className="textMed alignRight">{this.state.entry.diffProzent}%</Col>
						
					</Row>
					<Row>
						
						<Col md={1} sm={1} className="borderBottom padBottom textMed">Gesamt:</Col>
						<Col md={2} sm={2} className="borderBottom padBottom alignRight textMed">{this.state.entry.performanceAbsolut} EUR</Col>
						<Col md={1} sm={1} className="borderBottom padBottom alignRight textMed">{this.state.entry.performanceProzent}%</Col>
						<Col md={2} sm={2} className="borderBottom padBottom alignRight textMed">pro Jahr: {this.state.entry.performanceProzJahr}%</Col>
						<Col md={4} sm={4} className="borderBottom padBottom alignRight textMed">&nbsp;</Col>
					</Row>
				</Grid>	
			</Collapse>
			</div>;
	}
	
}

export default class Group extends Component{

	constructor (props){
		console.log("Group constructor:"+props.performance);
		super(props);
		
		this.state = {group:props.group,
				      groupIndex: props.index,
					  open: false,
					  performanceSort:props.performance};
		this.openGroup.bind(this);
		this.app = props.app;
		console.log(this.app);
		
		 
	}
	
	openGroup(){
		this.setState({open:!this.state.open});
	}
	
	sort(column, performanceSort) {
		console.log("sort called with column="+column+":"+performanceSort);
		this.props.load(this.props.parent.state.datum, column, performanceSort);
	}
	
	render(){
		console.log("Render group performance Props:"+this.state.performanceSort+"level:"+this.props.level);
		var groupIndex = this.state.groupIndex;
		var self = this;
		var nextlevel = this.props.level+1;
		performance = "gesamt Perf.%";
		if (this.state.performanceSort == "coupons"){
			performance = "Coupon/Jahr %"
		} else if (this.state.performanceSort == "jahr"){
			performance = "Perf/Jahr %";
		}
		
		
		console.log("overlay->"+self.props.umsatzoverlay);
		var entryList = this.state.group.entries.map(function(entry, index){
				return <Entry key={groupIndex+index} entry={entry} index={index} umsatzoverlay={self.props.umsatzoverlay} 
				              couponoverlay={self.props.couponoverlay} performance={self.state.performanceSort}/>;
			});
		
		var groupList = this.state.group.childGroups.map(function(group, index){
				console.log("Gruppe"+group.groupName+"->"+nextlevel);
				return <Group key={"group"+groupIndex+index+self.state.datum+self.state.sort+self.state.performance} group={group} index={index} 
				              load={self.props.parent.loadData} level={nextlevel}
		              umsatzoverlay={self.props.parent._umsatzoverlay} couponoverlay={self.props.parent._couponoverlay} 
					  parent={self.props.parent} performance={self.props.parent.state.performance}/>;
			});
		var background="";
		if (this.props.level==1) background="background-darkgrey";		
		if (this.props.level==2) background="background-grey";		
		return <div>
					<Grid >
						{(this.props.level==1) &&		
						<Row>
							<Col md={12} sm={12}>&nbsp;</Col>
						</Row>
						}
						<Row className={background}>
						
							<Col md={6} sm={6} className="link headline start"><div  onClick={()=>this.openGroup()} >
								{(this.props.level==1) && <span className="header1"><b>{this.state.group.groupName}</b></span>}
								{(this.props.level==2) && <b><span>&gt;&nbsp;</span>{this.state.group.groupName}</b>}
								{(this.props.level==3) && <span>&nbsp;&nbsp;{this.state.group.groupName}</span> }
								</div></Col>
							<Col md={2} sm={2} className="alignRight headline">&nbsp;</Col>
							<Col md={2} sm={2} className="alignRight headline">{this.state.group.anteil}%</Col>
							<Col md={2} sm={2} className="alignRight headline end">{this.state.group.groupSaldo} EUR</Col>
						</Row>
						
						{(this.state.group.strukturSaldo) &&
							<Row className={background}>
								<Col md={6} sm={6}></Col>
								<Col md={2} sm={2} className="alignRight normal">aus strukt Produkte</Col>
								<Col md={2} sm={2} className="alignRight normal">{this.state.group.strukturAnteil}%</Col>
								<Col md={2} sm={2} className="alignRight normal end">{this.state.group.strukturSaldo} EUR</Col>
							</Row>
						}
					</Grid>	
					
		            {(this.state.group.entries.length>0) &&			
						<Panel collapsible expanded={this.state.open} bsClass="">
						
						  <Grid>
							<Row >
							<Col md={1} sm={1}  className="textSmall borderBottom borderLeft start"><div className="link" onClick={this.sort.bind(this,'wkn',self.state.performanceSort)}>WKN</div></Col>
							<Col md={1} sm={1} className="textSmall alignRight borderBottom">Anzahl</Col>
							<Col md={4} sm={4}  className="textSmall borderBottom">Name</Col>
							<Col md={1} sm={1}  className="textSmall borderBottom">Laufzeit</Col>
							<Col md={2} sm={2} className="textSmall borderBottom alignRight"><div className="link" onClick={this.sort.bind(this,'performance',this.state.performanceSort)}>{performance}</div></Col>
							<Col md={1} sm={1} className="textSmall borderBottom alignRight"><div className="link" onClick={this.sort.bind(this,'anteil',self.state.performanceSort)}>Anteil</div></Col>
							<Col md={2} sm={2} className="textSmall borderBottom alignRight end">Wert</Col>
							</Row>
						</Grid>
						{entryList}
						</Panel>
					}				
					 {(this.state.group.childGroups.length>0) &&			
						<Panel collapsible expanded={this.state.open} bsClass="">
							{groupList}
						</Panel>
					 }	
								 
				</div>;

		
    }
}
