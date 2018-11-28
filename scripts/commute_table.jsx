import React from 'react';
import ReactDOM from 'react-dom';
import ReactTable from 'react-table';
// import '~react-table/react-table.css';

const CommuteTable = ({transitData}) => {

  const columns = [{
     Header: 'Subway Stop',
     accessor: 'subwayStop' // String-based value accessors!
   }, {
     Header: 'Commute Time',
     accessor: 'commuteTime',
   }, {
      Header: 'Lines',
      accessor: 'trains' // String-based value accessors!
    }]

  if (transitData) {
    return(
      <ReactTable
        data={transitData}
        columns={columns}
        />
      )
  } else {
    return(
      <div>d</div>
    )
  }



}

export default CommuteTable;
