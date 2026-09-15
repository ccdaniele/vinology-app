import React, {Component} from 'react';
import {connect} from 'react-redux';
import '../style.css';
import {currentUser} from '../actions/user.action'
import {myQueries} from '../actions/query.action'
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import {apiFetch} from '../api'

class Edit extends Component{
  constructor(){
    super()
    this.state = {
     name:"",
     loading: false,
     error: ''
    }
  }

  handleLoading=()=>{
    this.setState({loading:true})
     setTimeout(()=>{
       this.setState({loading:false})
     },5000)
     setTimeout(()=>{
       this.props.history.push('/queries')
     },5000)
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

  handleEdit=(e)=>{
    e.preventDefault()
    const queryId = this.props.location.state

        const newObj ={
          method: 'PATCH',
          body: JSON.stringify({
            query: {
                name: this.state.name
            }
          })
        }
    
        apiFetch(`/queries/${queryId}`, newObj)
        .then(resp=>resp.json().then(data => ({ ok: resp.ok, data })))
        .then(({ ok, data })=>{
          if (!ok) {
            const message = Array.isArray(data.error) ? data.error.join(', ') : (data.error || 'Failed to update query')
            this.setState({ error: message })
            return
          }
          this.handleLoading()
          this.loadMyQueries()
        })
        .catch(() => {
          this.setState({ error: 'Unable to update query. Please try again.' })
        })
  }

  render(){
      return (

<div className="wrapper">
        
        {!this.state.loading?
          <div className="inner">
          {this.state.error ? <p style={{color:'white'}}>{this.state.error}</p> : null}
          <form onSubmit={this.handleEdit}>
          <label className="form-text"></label>
            <div className='form-group'>
                
                <input type='text' className='form-control' placeholder='re-name your query' onChange={e=> this.setState({name: e.target.value})}/>
            </div>
            <input type="submit" name="submit" value="Create your query" className='btn btn-secondary btn-block'/>
          </form>
          </div>
         : 
         <div>
         
            <ClimbingBoxLoader loading={true} size={30} />
            
          
        </div>
         }

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

  currentUser, myQueries
}

export default connect (mapStateToProps, mapDispathToProps)(Edit)
