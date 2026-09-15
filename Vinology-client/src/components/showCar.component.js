import React from 'react';
import {connect} from 'react-redux';
import {myQueries} from '../actions/query.action'
import { Card, ListGroupItem, ListGroup } from 'react-bootstrap'; 
import jsPDF from 'jspdf'
import {apiFetch} from '../api'

class Show extends React.Component{
    constructor(){
        super()
        this.state={
            car: {}
        }
        
    }

    jsPDFGenerator=()=>{
        const car = this.state.car
        var doc = new jsPDF('p','pt');

        doc.text(20,30,'General Specifications')
        doc.text(20,60, `Model: ${car.model || ''}`)
        doc.text(20,90,`Year: ${car.year || ''}`)
        doc.text(20,120,`Make: ${car.make || ''}`)
        doc.text(20,150,`Trim: ${car.trim_level || ''}`)
        doc.text(20,180,`Standard Seating: ${car.standard_seating || ''}`)
        doc.text(20,210,`Fuel Specifications`)
        doc.text(20,240,`Highway Mileage: ${car.highway_mileage || ''}`)
        doc.text(20,270,`city_mileage:  ${car.city_mileage || ''}`)
        doc.text(20,300,`Tank size: ${car.tank_size || ''}`)
        doc.text(20,330,'Mechanical ')
        doc.text(20,360,`Anti Brake System: ${car.anti_brake_system || ''}`)
        doc.text(20,390,`Transmission: ${car.transmission || ''}`)
        doc.text(20,420,`Type: ${car.drive_type || ''}`)
        doc.text(20,450,`Engine: ${car.engine || ''}`)
 
        doc.setFont('courier');
        doc.save('document.pdf')
     }

    handleDelete=()=>{
        const car_id = this.props.location.state
    
          apiFetch(`/cars/${car_id}`,{method: 'DELETE'})
          .finally(() => {
            this.props.history.push('/queries')
          })
}
    
    componentDidMount(){
    const car_id =  this.props.location.state
        
    apiFetch(`/cars/${car_id}`)
      .then(resp=>resp.json())
      .then(data=>{
          if (data && data.id) {
            this.setState({car:data})
          }
      })
      .catch(() => {})

    }

    render(){

    
    return (
        <div className='wrapper'>
         <div className='inner'>
            <div className='m-auto'></div>
                <Card style={{ width: '21rem', backgroundColor: 'white' }}>
                <Card.Body>
                    <Card.Title>{this.state.car.model}</Card.Title>
                    <Card.Text>
                    Here you will find all the information about your car
                    </Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    <ListGroupItem>Model: {this.state.car.year}</ListGroupItem>
                    <ListGroupItem>Make: {this.state.car.make}</ListGroupItem>
                    <ListGroupItem>Highway mileage: {this.state.car.highway_mileage}</ListGroupItem>
                    <ListGroupItem>City mileage: {this.state.car.city_mileage}</ListGroupItem>
                    <ListGroupItem>Engine: {this.state.car.engine}</ListGroupItem>
                    
                    <button className="btn btn-secondary" onClick={this.handleDelete}>Delete</button>
                    <button className="btn btn-secondary" onClick={this.jsPDFGenerator}>Download</button>
                </ListGroup>
                <Card.Body>
                </Card.Body>
                </Card>
            </div>
        </div>
        )
    }
}

const mapStateToProps = (state)=>{
  
    return {
        user: state.userData,
        queries: state.queryData
    }
    
  }

  const mapDispathToProps ={

    myQueries
  }
  
  export default connect (mapStateToProps, mapDispathToProps)(Show)
