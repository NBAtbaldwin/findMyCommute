import React from 'react';
import * as MapUtil from './util/map_util';
import * as LatLngUtil from './latLngHelper';
import * as TransitUtil from './transit_util';
import CommuteMapContainer from './commute_map_container.js';
import {GoogleApiWrapper} from 'google-maps-react';
import CommuteTable from './commute_table';
import BoroughFormContainer from './forms/borough_form_container';

export class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }


  render() {
    return(
      <div id="master-container">
        <main>
          <div id="map-container">
            <CommuteMapContainer />
          </div>
          <BoroughFormContainer />
        </main>
        <aside>
          <CommuteTable transitData={this.state.data} />
        </aside>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: (process.env.GAPI_KEY)
})(Home)
