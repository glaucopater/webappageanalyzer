import React, { Component } from 'react';
import './InputForm.css';
import axios from '../../axios';
import Information from '../../components/Information/Information';

class InputForm extends Component {
	
	constructor() {
    super();
      
    this.state = {
        value: '',
		isValid: false,
        error: null,
		info: [],
        internalLinks: [],
        externalLinks: [],
        aliveInternalLinks: null,
        aliveExternalLinks: null
    };    
		
    this.handleChange = this.handleChange.bind(this);         
    this.handleKeyPress = this.handleKeyPress.bind(this);   
  }
	 
  
	fetchData = (url) => {					 
			console.log("fetchData");			
			axios.get('/api/crawle/?link='+ url)
            .then( response => { 	
                const info = response.data.info;  
				const error = response.data.error;
                
				if (info.length > 0) {
					this.setState({info: info, 
                                   internalLinks:response.data.internalLinks,
                                   externalLinks:response.data.externalLinks,
                                  });                
				}
				else {
					this.setState({error: error});                
				}		
                
            }).then(()=>{ 
                
                if(this.state.internalLinks.length>0){
                     let links = this.state.internalLinks;
                     links = links.slice(0,10);
                     axios.get('/api/checkLinks', {params:
                                                  {links:links}})
                      .then(res => {  
                         this.setState({aliveInternalLinks: res.data.aliveLinks});   
                      })
                }
                
                if(this.state.externalLinks.length>0){
                     let links = this.state.externalLinks;
                     links = links.slice(0,10);
                     axios.get('/api/checkLinks', {params:
                                                  {links:links}})
                      .then(res => {  
                        this.setState({aliveExternalLinks: res.data.aliveLinks});   
                      })
                }
               
            })
            .catch(error => {
                console.log(error);
                this.setState({error: true});
            });
		
	  }  
 
 
	//handle submit action
	handleSubmit = (event) => { 
	   this.reset();
	   const isValid = true;
       if(isValid)
       {
        this.setState({isValid: true})
		this.fetchData(this.state.value);
       }       
    }	
	
	//handle enter from keyboard		
	handleKeyPress = (event) => { 	   
		 if (event.key === 'Enter') {
			   const isValid = true;
			   if(isValid)
			   {
				this.setState({isValid: true})
				this.fetchData(this.state.value);
			   }            
		}		
	      
    }	
	
	//handle input type changes and update state
	handleChange = (event) => { 		    
       if(event.target.value!=='')
       {
        this.setState({value: event.target.value})
       }       
    }  

     reset(){        
        this.setState({ error: null,
		info: [],
        internalLinks: [],
        externalLinks: []});
    }
    render () { 		
		let info = this.state.info; 
		let informationResults = null;
        let internalLinksResults = null; 
        let externalLinksResults = null; 
 
		let error = this.state.error;
        
        let aliveInternalLinks = this.state.aliveInternalLinks;
        let aliveExternalLinks = this.state.aliveExternalLinks;
         
		
        if (typeof(error)==="string" && error!=="" ){
            informationResults = <div className="Error">
						<p>{this.state.error}</p>
					 </div>
        }
        else
		if (info.length > 0){
			info = this.state.info.map(info => {
                return <Information 
                    key={info.id} 
                    name={info.propertyName} 
                    value={info.propertyValue} />;
            });	
        
        if(aliveInternalLinks) {
                externalLinksResults = <Information 
                    name="Internal Links"  
                    value={aliveInternalLinks} />           
            }
            
        if(aliveExternalLinks) {
                externalLinksResults = <Information  
                    name="External Links"  
                    value={aliveExternalLinks} />           
            } 
			
			informationResults = <div>
						<table>                
							<tbody>                
								{info}
                                {internalLinksResults}
                                {externalLinksResults}
							</tbody>                
						</table>
					 </div>
            
		}
      
			
        return (
			 <div className="InputForm">				
				<input className="Input" type="text" placeholder="Input an url"
					onChange={this.handleChange}
					onKeyPress={this.handleKeyPress}/>
				<button className="Button" onClick={this.handleSubmit} >Analyze</button>
				{informationResults}
               
			 </div> 			
        );
    }
}


export default InputForm;