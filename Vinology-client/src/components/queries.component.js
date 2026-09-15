import React, {Component} from 'react';
import {connect} from 'react-redux';
import {currentUser} from '../actions/user.action'
import {myQueries} from '../actions/query.action'
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import '../css/queries.css';
import {currentQuery} from '../actions/car.action'
import {apiFetch} from '../api'

class queries extends Component{
  constructor(){
    super()
    this.state = {
     queries:[],
     car:[],
     loading: false
    }
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

  handleLoading=()=>{
    this.setState({loading:true})
     setTimeout(()=>{
       this.setState({loading:false})
     },3000)
  }

  handleDelete=(e)=>{
    const query_id = e.target.value
    this.handleLoading()

    apiFetch(`/queries/${query_id}`, { method: 'DELETE' })
      .then(() => this.loadMyQueries())
      .catch(() => this.loadMyQueries())
  }

  handleAdd=(e)=>{
    this.props.currentQuery(e.target.value)
    this.props.history.push('/newcar')
  }

  handleEdit=(e)=>{
    const query_edit = e.target.value
    this.props.history.push({
      pathname: '/edit', 
      state: query_edit
    })
  }

  handleOnClick=(e)=>{
    const car_id = e.target.value
    this.props.history.push({
      pathname: '/showcar', 
      state: car_id
    })
  }

  render(){
    const queriesList = Array.isArray(this.props.queries) ? this.props.queries : []

      return (
      <div className="wrapper-q" >
      <div className='inner-r'>
       {!this.state.loading?
      <div className='inner-r'>
        {queriesList.length > 0 ?
        <div className='inner'>
              {queriesList.map(query=>
       <div className="firstTernary" key={query.id}>
        <body>
            <div class="container">
                <div class="card">
                    <div class="face face1">
                        <div class="content">
                        
                            <h3>{query.name}</h3>
                        </div>
                    </div>
                    <div class="face face2">
                        <div class="content">
                        <div>
                        {(query.cars || []).map(car=>

                           <button className="btn btn-link" key={car.id} value={car.id} onClick={this.handleOnClick} > {car.model}</button>
                          
                           )}
                          </div>
                          <button className="btn btn-outline-info" value={query.id}onClick={this.handleAdd}>Add</button>
                          <button className="btn btn-outline-info" value={query.id}onClick={this.handleEdit}>Edit </button>
                          <button className="btn btn-outline-secondary" value={query.id}onClick={this.handleDelete}>Delete</button>
                        </div>
                       </div>
                      </div>
                  </div>
               </body>
              </div>
            )} 
        </div>
        : <ClimbingBoxLoader  loading={true} size={30}  /> }
        </div>
      : <ClimbingBoxLoader  loading={true} size={30}  /> }</div>
       </div>

    
    );
  } 
}

const mapStateToProps = (state)=>{
  
  return {
      user: state.userData,
      queries: state.queryData
  }
  
}

const mapDispathToProps ={

  currentUser, myQueries, currentQuery
}

export default connect (mapStateToProps, mapDispathToProps)(queries)
