import React from 'react';

function Thesis(props) {
  return (
    <div className="thesis">
      <h1>{props.title}</h1>
      <p>{props.description}</p>
    </div>
  );
}

export default Thesis;
