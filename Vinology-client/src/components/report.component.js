// import '../styleClass.css';
import '../css/report.css';
import '../css/report2.scss';
import {connect} from 'react-redux'
import jsPDF from 'jspdf'
import React from 'react'
import {myQueries} from '../actions/query.action'
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import {apiFetch} from '../api'



class Report extends React.Component{
    constructor(){
        
        super()
        this.state = {
         loading: false,
         mechanicalInfo: false
        }
      }



      handleLoading=()=>{
        this.setState({loading:true})
         setTimeout(()=>{
           this.setState({loading:false})
         },5000)
    
        }


    jsPDFGenerator=()=>{


       
        
        var doc = new jsPDF('p','pt');

        doc.text(20,30,'General Specifications')
        doc.text(20,60, `Model: ${this.props.location.specifications.specification.model}`)
        doc.text(20,90,`Year: ${this.props.location.specifications.specification.year}`)
        doc.text(20,120,`Make: ${this.props.location.specifications.specification.make}`)
        doc.text(20,150,`Trim: ${this.props.location.specifications.specification.trim_level}`)
        doc.text(20,180,`Standard Seating: ${this.props.location.specifications.specification.standard_seating}`)
        doc.text(20,210,`Fuel Specifications`)
        doc.text(20,240,`Highway Mileage: ${this.props.location.specifications.specification.highway_mileage}`)
        doc.text(20,270,`city_mileage:  ${this.props.location.specifications.specification.city_mileage}`)
        doc.text(20,300,`Tank size: ${this.props.location.specifications.specification.tank_size}`)
        doc.text(20,330,'Mechanical ')
        doc.text(20,360,`Anti Brake System: ${this.props.location.specifications.specification.anti_brake_system}`)
        doc.text(20,390,`Transmission: ${this.props.location.specifications.specification.transmission}`)
        doc.text(20,420,`Type: ${this.props.location.specifications.specification.drive_type}`)
        doc.text(20,450,`Engine: ${this.props.location.specifications.specification.engine}`)
 
        doc.setFont('courier');
 
     //    doc.setFontType('normal');
 
        
 
        doc.save(`${this.props.location.specifications.specification.make} ${this.props.location.specifications.specification.model} report.pdf`)
 
 
 
     }
  
    loadMyQueries=()=>{
        apiFetch('/queries')
          .then(resp=>resp.json())
          .then(data=>{
            if (Array.isArray(data)) {
              this.props.myQueries(data)
            }
          })
          .catch(() => {})
        }

        goBack=()=>{
            this.props.history.push('/newcar')
        }

    handleSave=()=>{
        const query_id = this.props.queryId
       

        const newObj ={
            method: 'POST',
            body: JSON.stringify({
              car: {query_id: query_id,
                vin_number:this.props.location.specifications.specification.vin,
                anti_brake_system:this.props.location.specifications.specification.anti_brake_system, 
                city_mileage:this.props.location.specifications.specification.city_mileage, 
                drive_type:this.props.location.specifications.specification.drive_type,
                engine:this.props.location.specifications.specification.engine,
                highway_mileage:this.props.location.specifications.specification.highway_mileage,
                make:this.props.location.specifications.specification.make,
                model:this.props.location.specifications.specification.model,
                standard_seating:this.props.location.specifications.specification.standard_seating,
                tank_size:this.props.location.specifications.specification.tank_size,
                transmission:this.props.location.specifications.specification.transmission,
                trim_level:this.props.location.specifications.specification.trim_level,
                year:this.props.location.specifications.specification.year
                
                
              }
            })
          }
      
          apiFetch('/cars', newObj )
          .then(resp => resp.json())
          .then(()=> {
            this.handleLoading()
            this.loadMyQueries()
          })
          .catch(() => {})

    }
    render(){


        return (

                    

    <div className="wrapper-q">
       
                <div className="inner-r">
                <div className="top-buttons">
                {!this.state.loading?

                <div class="btn-group" role="group" aria-label="Basic example">
                <button type="button" onClick={this.handleSave} className="btn btn-secondary">Save</button>
                <button type="button" onClick={this.jsPDFGenerator} className="btn btn-secondary">Download</button>
                <button type="button" onClick={this.goBack} className="btn btn-secondary">Create another search</button>
                </div> 
                : " " }</div>
        
        {!this.state.loading? 
        
        <div >
       
            {this.props.location.specifications?
            
       <div className="firstTernary">
       
        <body>
        
            <div class="container">
            
                <div class="card">
                
                    <div class="face face1">
                        <div class="content">
                        
                            <h3>General specifications</h3>
                        </div>
                    </div>
                    <div class="face face2">
                        <div class="content">
                        <p>Model: {this.props.location.specifications.specification.model}</p> 
                        <p>Year: {this.props.location.specifications.specification.year}</p>
                        <p>Make: {this.props.location.specifications.specification.make}</p>
                        <p>Trim: {this.props.location.specifications.specification.trim_level}</p>
                        <p>Standard Seating: {this.props.location.specifications.specification.standard_seating}</p>
                                {/* <a href="#">Read More</a> */}
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="face face1">
                        <div class="content">
                            
                            <h3>Fuel efficiency</h3>
                        </div>
                    </div>
                    <div class="face face2">
                        <div class="content">
                    <p>Highway Mileage: {this.props.location.specifications.specification.highway_mileage}</p>
                    <p>City Mileage: {this.props.location.specifications.specification.city_mileage}</p>
                    <p>Tank size: {this.props.location.specifications.specification.tank_size}</p>
                                {/* <a href="#">Read More</a> */}
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="face face1">
                        <div class="content">
                            {/* <img src="https://github.com/Jhonierpc/WebDevelopment/blob/master/CSS%20Card%20Hover%20Effects/img/launch_128.png?raw=true"></img> */}
                            <h3>Mechanical info</h3>
                        </div>
                    </div>
                    <div class="face face2">
                        <div class="content">
                        <p>Brake System: {this.props.location.specifications.specification.anti_brake_system}</p> 
                        <p>Transmission: {this.props.location.specifications.specification.transmission}</p>
                        <p>Type: {this.props.location.specifications.specification.drive_type}</p>
                        <p>Engine: {this.props.location.specifications.specification.engine}</p>
                                {/* <a onClick={e=> this.setState({mechanicalInfo: true})}>Read More</a> */}
                        </div>
                    </div>
                </div>
            </div>
        </body>

        {this.props.location.carHistory.length !==0 ?
        
        <body>
            <div class="container">
                <div class="card">
                    <div class="face face1">
                        <div class="content">
                        
                            <h3>Last Title info</h3>
                        </div>
                    </div>
                    <div class="face face2">
                        <div class="content">
                        <p>Date: {this.props.location.carHistory.historyInformation[0].TitleIssueDate.Date}</p>
                        <p>Last state registered: {this.props.location.carHistory.historyInformation[0].TitleIssuingAuthorityName}</p> 
                        <p>Mileage: {this.props.location.carHistory.historyInformation[0].VehicleOdometerReadingMeasure}</p>
                        <p>Number of titles issued: {this.props.location.carHistory.historyInformation.length}</p>
                                {/* <a href="#">Read More</a> */}
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="face face1">
                        <div class="content">
                            
                            <h3>Ownership Record</h3>
                        </div>
                    </div>
                    <div class="face face2">
                        <div class="content">
                        <p>Brands record number: {this.props.location.carHistory.brandsRecordCount}</p>
                    <p>Mileage discrepancy: {this.props.location.carHistory.brandsRecordCount === 0? "No" : "Yes"}</p>
                    <p>Previous taxi?: {this.props.location.carHistory.brandsRecordCount === "17"? "Yes" : "No"}</p>
                    <p>Vehicle unsafe to drive record: {this.props.location.carHistory.brandsRecordCount === "41"? "Yes" : "No"}</p>
                    <p>Recovered or theft: {this.props.location.carHistory.brandsRecordCount === "36"? "Yes" : "No"}</p>
                    <p>Former rental car?: {this.props.location.carHistory.brandsRecordCount === "48"? "Yes" : "No"}</p>           
                                {/* <a href="#">Read More</a> */}
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="face face1">
                        <div class="content">
                            {/* <img src="https://github.com/Jhonierpc/WebDevelopment/blob/master/CSS%20Card%20Hover%20Effects/img/launch_128.png?raw=true"></img> */}
                            <h3>Accident Record</h3>
                        </div>
                    </div>
                    <div class="face face2">
                        <div class="content">
                        <p>Flood Damage?: {this.props.location.carHistory.brandsRecordCount === "01" ? "Yes" : "No"}</p>
                        <p>Fire Damage?: {this.props.location.carHistory.brandsRecordCount === "02"? "Yes" : "No"}</p>
                        <p>Hail Damage?: {this.props.location.carHistory.brandsRecordCount === "03"? "Yes" : "No"}</p>
                        <p>Big damage for collision: {this.props.location.carHistory.brandsRecordCount === "14"? "Yes" : "No"}</p>
                                {/* <a onClick={e=> this.setState({mechanicalInfo: true})}>Read More</a> */}
                        </div>
                    </div>
                </div>
            </div>
        </body>

        : " "
        
        }

        {this.props.location.marketValue.length !==0?
        
        <body>
        
            <div class="container">
                <div class="card">
                    <div class="face face1">
                        <div class="content">
                        
                            <h3>Market Price</h3>
                        </div>
                    </div>
                    <div class="face face2">
                        <div class="content">
                        <p>Suggested Price: ${this.props.location.marketValue.adjustedCleanRetail}</p> 
                        <p>Avg Retail Purchase: ${this.props.location.marketValue.adjustedAverageTrade}</p>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="face face1">
                        <div class="content">
                            
                            <h3>Market Condition</h3>
                        </div>
                    </div>
                    <div class="face face2">
                        <div class="content">
                    <p>Average Mileage: {this.props.location.marketValue.averageMileage}</p>
                    <p>Max Mileage Adj: {this.props.location.marketValue.maxMileageAdj}</p>
                               
                                {/* <a href="#">Read More</a> */}
                        </div>
                    </div>
                </div>
            </div>
        </body>

        : " "
        
        }

</div>


            :

    this.props.history.push('/newquery') }
    
        </div>
        
          :  
         
         <ClimbingBoxLoader loading={true} size={30} />
     }</div>
    
    </div>

   
        )
    }
    
}

const mapStateToProps = (state)=>{
    return {
        user: state.userData,
        queryId: state.carData
    }
  }
  
  const mapDispatchToProps = {
    myQueries
  }
  
  export default connect (mapStateToProps, mapDispatchToProps)(Report)



