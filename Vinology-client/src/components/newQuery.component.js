import React, {Component} from 'react';
import {connect} from 'react-redux';
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import {currentQuery} from '../actions/car.action'
import {apiFetch} from '../api'


class NewQuery extends Component{
  constructor(){
    super()
    this.state = {
     name:'',
     test:[],
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
      this.props.history.push('/newcar')
    },5000)
}

  handleOnSubmit=(e)=>{
  e.preventDefault()

    const newObj ={
      method: 'POST',
      body: JSON.stringify({
        query: {
            name: this.state.name
        }
      })
    }

    apiFetch('/queries', newObj)
    .then(resp=>resp.json().then(data => ({ ok: resp.ok, data })))
    .then(({ ok, data })=>{
      if (!ok) {
        const message = Array.isArray(data.error) ? data.error.join(', ') : (data.error || 'Failed to create query')
        this.setState({ error: message })
        return
      }
      localStorage.setItem('qtoken', data.id)
      this.handleLoading()
      this.props.currentQuery(data.id)
    })
    .catch(() => {
      this.setState({ error: 'Unable to create query. Please try again.' })
    })
}

  render(){
   
      return (
      <div className="wrapper">
        
        {!this.state.loading?
          <div className="inner">
          {this.state.error ? <p style={{color:'white'}}>{this.state.error}</p> : null}
          <form onSubmit={this.handleOnSubmit}>
          <label className="form-text"></label>
            <div className='form-group'>
                
                <input type='text' className='form-control' placeholder='name your query' onChange={e=> this.setState({name: e.target.value})}/>
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
      user: state.userData
  }
}

const mapDispathToProps ={

  currentQuery
}

export default connect (mapStateToProps, mapDispathToProps)(NewQuery)
