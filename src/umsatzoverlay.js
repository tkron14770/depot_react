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


export default class UmsatzOverlay extends Component {
	
	constructor(...args){
	  super(...args);
	  this.state={show:false, display:"liste", entryId:""};
	 
	}
	
	displayUmsaetze(umsatzDisplayed, entryId){
			 var url = 'http://localhost:8080/depotEntryUmsaetze?id='+entryId;
	  console.log("Load Umsaetze:"+entryId+","+umsatzDisplayed);
	  axios.get(url)
		.then(response => {
			this.setState({data:response.data, entryId:entryId, show:true, umsatzDisplayed:umsatzDisplayed, display:"liste",fehlermeldung:""});
		})
		.catch(function (error) {
			console.log(error);
		});
	}
	
	close =() => {
	  this.setState({show:false});
	}
	
	eingabe = () => {
		this.setState({display:"eingabe"});
	}
	
	erfassen =() => {
	  console.log("Erfassen:"+this.datum.value);	
	   var url = 'http://localhost:8080/addUmsatz?id='+this.state.entryId
	              +"&datum="+this.datum.value
				  +"&kursProStueck="+this.kursprostueck.value
				  +"&anzahl="+this.anzahl.value
				  +"&kosten="+this.kosten.value;
	   console.log(url);	
	   axios.get(url)
		.then(response => {
			 console.log("REST done:"+response.data);
			 if (response.data==='OK'){
				this.displayUmsaetze(this.state.couponsDisplayed, this.state.entryId);
			 } else {
				 this.setState({fehlermeldung:response.data});
			 }
		})
		.catch(error => {
			console.log(error);
			this.setState({fehlermeldung:"Technischer Fehler beim Server aufgetreten!"});
		});
	}
	
	erfassenAufschlag =() => {
	  console.log("ErfassenAufschlag:"+this.datum.value);	
	   var url = 'http://localhost:8080/addUmsatzFond?id='+this.state.entryId
	              +"&datum="+this.datum.value
				  +"&kurs="+this.kurs.value
				  +"&anzahl="+this.anzahl.value
				  +"&aufschlag="+this.state.aufschlag
				  +"&bonifikation="+this.state.bonifikation;
				  
	   console.log(url);	
	   axios.get(url)
		.then(response => {
			 console.log("REST done:"+response.data);
			 if (response.data==='OK'){
				this.displayUmsaetze(this.state.umsatzDisplayed, this.state.entryId);
			 } else {
				 this.setState({fehlermeldung:response.data});
			 }
		})
		.catch(error => {
			console.log(error);
			this.setState({fehlermeldung:"Technischer Fehler beim Server aufgetreten!"});
		});
	  
	 

	}
	
	eingabeAufschlag = () => {
		var url = 'http://localhost:8080/getFondAufschlag?id='+this.state.entryId;
	   console.log(url);	
	   axios.get(url)
		.then(response => {
			 console.log("REST done:"+response.data.bonifikation);
			 this.setState({bonifikation:response.data.bonifikation, 
                            aufschlag:response.data.aufschlag,
							display:"eingabeAufschlag"});
			 console.log("REST done step2:"+this.state.bonifikation);
		})
		.catch(error => {
			console.log(error);
			this.setState({fehlermeldung:"Technischer Fehler beim Server aufgetreten!"});
		});
		
	}
	
	handleChangeBoni = (event) =>{
		this.bonifikation = event.target.value;
		console.log ("E:"+event.target.value+";"+this.bonifikation);
		this.setState({bonifikation:event.target.value});
	}
	handleChangeAufschlag = (event) =>{
		this.setState({aufschlag:event.target.value});
	}
	
	render(){
		var list;
		var headerText;
		var body;
		
		if (this.state.display==="liste") {
			if (this.state.data != null){
				console.log("render");
				list = this.state.data.map(function(umsatz, index){
					return (<tr key={"umsatz"+index}>
							<td className="textMed">{umsatz.datum}</td>
							<td className="textMed">{umsatz.art}</td>
							<td className="textMed alignRight">{umsatz.anzahl}</td>
							<td className="textMed alignRight">{umsatz.betrag} EUR</td>
							<td className="textMed alignRight">{umsatz.kosten} EUR</td>
							<td className="textMed alignRight">{umsatz.bestand}</td>
							<td>&nbsp;</td>
						</tr>);
				});
			}	
			headerText = "Umsätze für "+this.state.umsatzDisplayed;
			body = (<Table responsive>
					<thead>
						<tr>
							<th className="textMed" >Datum</th>
							<th className="textMed" >Art</th>
							<th className="textMed alignRight">Anzahl</th>
							<th className="textMed alignRight">Betrag (Kurs)</th>
							<th className="textMed alignRight">Kosten</th>
							<th className="textMed alignRight">Bestand (neu)</th>
							<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
						</tr>	
					</thead>
					<tbody>	
						{list}
					</tbody>	
				</Table>);
		} else if (this.state.display==="eingabe"){
			headerText = "Umsatzeingabe (Kauf Börse) für "+this.state.umsatzDisplayed;
			body = (<div>
			        {this.state.fehlermeldung} 
					<Form horizontal>
						<FormGroup controlId="formHorizontalDatum">
							<Col componentClass={ControlLabel} sm={2}>Datum</Col>
							<Col sm={3}>
								<FormControl type="text" placeholder="Datum" inputRef={ref => { this.datum = ref; }}/>
							</Col>
						</FormGroup>

						<FormGroup controlId="formHorizontalAnzahl">
							<Col componentClass={ControlLabel} sm={2}>Anzahl</Col>
							<Col sm={3}>
								<FormControl type="text" placeholder="Anzahl" inputRef={ref => { this.anzahl = ref; }}/>
							</Col>
						</FormGroup>
						
						<FormGroup controlId="formHorizontalKurs">
							<Col componentClass={ControlLabel} sm={2}>Kurs pro Stück</Col>
							<Col sm={3}>
								<FormControl type="text" placeholder="Kurs in EUR" inputRef={ref => { this.kursprostueck = ref; }}/>
							</Col>
						</FormGroup>
						<FormGroup controlId="formHorizontalKosten">
							<Col componentClass={ControlLabel} sm={2}>Kosten</Col>
							<Col sm={3}>
								<FormControl type="text" placeholder="Kosten" inputRef={ref => { this.kosten = ref; }}/>
							</Col>
						</FormGroup>
						
						<FormGroup>
							<Col smOffset={2} sm={3}>
								<Button onClick={this.erfassen}>Erfassen</Button>
							</Col>
						</FormGroup>
					</Form>
					</div>);
		} else if (this.state.display==="eingabeAufschlag"){
			headerText = "Umsatzeingabe (Kauf mit Ausgbeaufschlag) für "+this.state.umsatzDisplayed;
			console.log("Beim Rendern:"+this.state.bonifikation);
			body = (<div>
			        {this.state.fehlermeldung} 
					<Form horizontal>
						<FormGroup controlId="formHorizontalDatum">
							<Col componentClass={ControlLabel} sm={2}>Datum</Col>
							<Col sm={3}>
								<FormControl type="text" placeholder="Datum" inputRef={ref => { this.datum = ref; }}/>
							</Col>
						</FormGroup>

						<FormGroup controlId="formHorizontalAnzahl">
							<Col componentClass={ControlLabel} sm={2}>Anzahl</Col>
							<Col sm={3}>
								<FormControl type="text" placeholder="Anzahl" inputRef={ref => { this.anzahl = ref; }}/>
							</Col>
						</FormGroup>
						
						<FormGroup controlId="formHorizontalKurs">
							<Col componentClass={ControlLabel} sm={2}>Kurs mit Aufschlag</Col>
							<Col sm={3}>
								<FormControl type="text" placeholder="Kurs pro Stück " inputRef={ref => { this.kurs = ref; }}/>
							</Col>
						</FormGroup>
						<FormGroup controlId="formHorizontalAufschlag">
							<Col componentClass={ControlLabel} sm={2}>Ausgabeaufschlag in %</Col>
							<Col sm={3}>
								<FormControl type="text" value={this.state.aufschlag} onChange={this.handleChangeAufschlag}/>
							</Col>
						</FormGroup>
						<FormGroup controlId="formHorizontalBoni">
							<Col componentClass={ControlLabel} sm={2}>Bonifikation in %</Col>
							<Col sm={3}>
								<FormControl type="text"  value={this.state.bonifikation} onChange={this.handleChangeBoni} />
							</Col>
						</FormGroup>
						<FormGroup>
							<Col smOffset={2} sm={3}>
								<Button onClick={this.erfassenAufschlag}>Erfassen</Button>
							</Col>
						</FormGroup>
					</Form>
					</div>);
		}
		return(
		
			<Modal show={this.state.show} onHide={this.close} bsSize="large" aria-labelledby="contained-modal-title-lg">
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-lg">{headerText}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			{body}
					</Modal.Body>
			<Modal.Footer>
				<Button onClick={this.eingabe}>Eingabe</Button><Button onClick={this.eingabeAufschlag}>Eingabe (Aufschlag)</Button><Button onClick={this.close}>Schließen</Button>
			</Modal.Footer>
		</Modal>);
	}
	
	
}