function query(state = [], action){
    switch(action.type){
        case 'MY_QUERIES':
          return Array.isArray(action.queries) ? action.queries : []

        case 'LOGIN_OUT':
          return []

        default:
          return state
    }
}

export default query
