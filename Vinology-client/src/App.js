import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/home.component';
import Nav from './components/nav.component'
import Register from './components/register.component'
import New from './components/newCar.component'
import Show from './components/showCar.component'
import Queries from './components/queries.component'
import Login from './components/login.component'
import NewQuery from './components/newQuery.component'
import Edit from './components/editQuery.component'
import {Route, Switch, withRouter} from 'react-router-dom'
import Report from './components/report.component';
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {currentUser} from './actions/user.action'
import {myQueries} from './actions/query.action'
import {apiFetch} from './api'
import './index.css';

class App extends Component{
  constructor(){
    super()
    this.state={
      currentUser: ''
    }
  }

  loadMyQueries=()=>{
    apiFetch('/queries')
      .then(resp => resp.json())
      .then(data => {
        if (Array.isArray(data)) {
          this.props.myQueries(data)
        }
      })
      .catch(() => {})
  }

  componentDidMount(){
    const token = localStorage.getItem('token')

    if(!token) {
      this.props.history.push('/login')
      return
    }

    apiFetch('/current_user')
      .then(resp => resp.json())
      .then(data=>{
        if (data.message || data.error || !data.id){
          localStorage.removeItem('token')
          this.props.history.push('/login')
        }else{
          this.props.currentUser(data)
          this.loadMyQueries()
        }
      })
      .catch(() => {
        this.props.history.push('/login')
      })
  }

render(){
  
  return (
    <div>
          <Nav/>
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route exact path="/login" component={Login}/>
              <Route exact path="/register" component={Register}/>
              <Route exact path="/newcar" component={New}/>
              <Route exact path="/showcar" component={Show}/>
              <Route exact path="/queries" component={Queries}/>
              <Route exact path="/report" component={Report}/>
              <Route exact path="/newquery" component={NewQuery}/>
              <Route exact path="/edit" component={Edit}/>
            </Switch>
    </div>
  );
}
}

const mapDispathToProps ={
  currentUser, myQueries
}

const mapStateToProps = (state)=>{
  return {
      user: state.userData
  }
}


export default connect (mapStateToProps, mapDispathToProps) (withRouter(App));
