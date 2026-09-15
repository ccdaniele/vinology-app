import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {connect} from 'react-redux'
import {loginOut, loginSuccess} from '../actions/user.action'
import '../style.css';

class Nav extends Component {
  constructor(){
    super()
    this.state = {login: []}
  }

        


  handleLogOut=()=>{
    
    localStorage.clear()
    this.props.loginOut()
    window.location.reload(false);
    

    

  }

    render(){
      const size ={
        height: 37,
        width: 150,
        
    }
        return(

      <nav className="navbar navbar-expand navbar-light fixed-top">
            {this.props.user?
        <div className="container">
          <Link className="navbar-brand" id='logoNav' style={size} to={'/'}>home</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={'/newquery'} id="form-text" className="nav-link" >New query</Link>
              </li>
              <li className="nav-item">
                <Link to={'/queries'} id="form-text" className="nav-link" >My queries</Link>
              </li>
              <li className="nav-item">
                <button onClick={this.handleLogOut} className="btn btn-secondary btn-block" >Log out</button>
              </li>
            </ul>
          </div>
        </div> 
        
        : 

        <div className="container">
        <Link className="navbar-brand" id='logoNav' style={size} to={'/login'}>home</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={'/login'} id="form-text" className="nav-link" >Login</Link>
              </li>
              <li className="nav-item">
              <Link to={'/register'} id="form-text" className="nav-link">Sign up</Link>
              </li>
            </ul>
          </div>
        </div>
            }
      </nav>


        )
    }


    
}
const mapStateToProps = (state)=>{
  return {
      user: state.userData
  }
}

const mapDispatchToProps = {
  loginOut, loginSuccess 
}

export default connect (mapStateToProps, mapDispatchToProps)(Nav)