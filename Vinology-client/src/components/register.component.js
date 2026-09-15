import React, {Component} from 'react';
import {apiFetch} from '../api'

export default class Register extends Component {
    constructor(){
        super()
        this.state={
            name:'',
            username:'',
            email:'',
            password:'',
            passwordConfirm:'',
            error: ''
        }
    }

    handleSubmit = (e) =>{
        e.preventDefault()

        if (this.state.password !== this.state.passwordConfirm) {
          this.setState({ error: 'Passwords do not match' })
          return
        }

        const newObj ={
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({
              user: {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
              }
            })
          }
       
        apiFetch('/users', newObj)
            .then(r => r.json().then(data => ({ ok: r.ok, data })))
            .then(({ ok, data }) => {
              if (!ok) {
                const message = Array.isArray(data.error) ? data.error.join(', ') : (data.error || 'Failed to create user')
                this.setState({ error: message })
                return
              }
              this.props.history.push('/login')
            })
            .catch(() => {
              this.setState({ error: 'Unable to register. Please try again.' })
            })
        }

    render(){

        const size ={
            height: 30,
            width: 150,
            
        }

        return(
            <div className='body-login2'>
            <div className="wrapper">
            <div className="inner-sign-up">
            {this.state.error ? <h4 style={{color:'white'}}>{this.state.error}</h4> : null}
            <form onSubmit={this.handleSubmit}>
               <p id='logoNav' style={size}></p> 
               <div className='form-group'>
                   
               </div>
               <div className='form-group'>
                   <input type='text' className='form-control' placeholder='Username'onChange={e=> this.setState({username: e.target.value})}/>
                   
               </div>
               <div className='form-group'>

                   <input type='email' className='form-control' placeholder='Email' onChange={e=> this.setState({email: e.target.value})}/>
                   
               </div>
               <div className='form-group'>
                   <input type='password' className='form-control' placeholder='Password' onChange={e=> this.setState({password: e.target.value})}/>
                   
               </div>
               <div className='form-group'>
                   <input type='password' className='form-control' placeholder='Confirm Password' onChange={e=> this.setState({passwordConfirm: e.target.value})}/>
               </div>
               <button className='btn btn-secondary btn-block'>Sign Up</button>
            </form>
            </div>
            </div>
            </div>
        )
    }
}
