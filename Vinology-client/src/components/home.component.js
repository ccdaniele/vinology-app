import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {connect} from 'react-redux'
import '../css/login.scss'
import '../css/home.css'




 class Home extends Component {
    constructor(){
        super()
        this.state = {
            loginSuccess: []
        }
      }

      componentDidMount(){
          if(!this.props.user){
              this.props.history.push('/login')
          }
      }



    render(){
       
        const size ={
            height: 150,
            width: 850,
            
        }

        return(
          
          
           <div className='wrapper'>
           <div className='inner-r'>
                <div className='m-auto' id='logo' style={size}></div>
                    <div>
                        <div>
                        <ul id='homeButton'>
                            <p><Link to={'/newquery'} className="button" id="red" >Create a new Query</Link></p>
                            <p><Link to={'/queries'} className="buttonB" >Check my queries</Link></p>
                        </ul>   
                        </div>
                    </div>
                </div>
            </div>
              
          

        );
        
    }
}

const mapStateToProps = (state)=>{
    
    return {
        user: state.userData
    }
}

export default connect (mapStateToProps)(Home)




