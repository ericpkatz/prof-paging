import React, { Component } from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Route, Link } from 'react-router-dom';

const root = document.getElementById('root');

const db = (currentPage)=> {
  const _data = [
    'moe',
    'larry',
    'curly',
    'shep',
    'prof'
  ]; 
  const total = _data.length;
  const pageSize = 2;
  const items = _data.filter( (item, idx) => {
    return idx >= pageSize * (currentPage - 1) && idx < (currentPage)* pageSize
  });
  return Promise.resolve({
    numberOfPages: Math.ceil(total/pageSize),
    items
  });


};

class Users extends Component{
  constructor({ currentPage = 1 }){
    super();
    this.state = {
      items: [],
      currentPage,
      numberOfPages: 0
    };
    this.loadData(currentPage);
  }
  loadData(currentPage){
    db(currentPage)
      .then( ({ numberOfPages, items }) => {
        this.setState({
          numberOfPages,
          items,
          currentPage
        });
      });
  }
  componentWillReceiveProps(nextProps){
    this.loadData(nextProps.currentPage);
  }
  render(){
    return (
      <div>
        <Pager {...this.state } />
        <NextPrev {...this.state } />
        <Results {...this.state } />
      </div>
    ); 
  }
}

const Results = ({ items })=> {
  return (
    <ul>
      {
        items.map( (item, idx) => <li key={ idx }>{ item }</li>)
      }
    </ul>
  );
};

const Pager = ({ numberOfPages, currentPage })=> {
  const lis = [];
  for(var i = 1; i <= numberOfPages; i++){
    let li;
    if(currentPage === i){
      li = <li key={ i }>{ i }</li>
    }
    else{
      li = <li key={ i }><Link to={`/users/${i}`}>{ i }</Link></li>;
    }
    lis.push(li);
  }
  return (
    <ul>
    {
      lis    
    }
    </ul>
  );
};

const NextPrev = ({ numberOfPages, currentPage })=> {
  const showNext = numberOfPages !== currentPage;
  const showPrev = currentPage !== 1;
  return (
    <div>
    {
      showPrev ? (<Link to={`/users/${currentPage - 1}`}>Prev</Link>):( 'Prev' )
    }
    { ' | ' }
    {
      showNext ? (<Link to={`/users/${currentPage + 1}`}>Next</Link>):( 'Next' )
    }
    </div>
  );
}

const routes = (
  <Router>
    <Route component={({ match })=> <Users currentPage={ match.params.currentPage ? match.params.currentPage * 1 : 1 }/> } path='/users/:currentPage?' />
  </Router>
);

render(routes, root); 
