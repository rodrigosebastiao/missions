import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createMap, updateMap, initiateZoomTransition, clearPins, addTerminalPinSources} from '../lib/map';
import './Map.css';

class Map extends Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.onVehicleClick = this.onVehicleClick.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const terminals = {
      pickup: nextProps.orderPickupCoords,
      dropoff: nextProps.orderDropoffCoords
    };

    updateMap(this.map, nextProps.vehicles, terminals);

    if(this.props.orderStage === 'draft' && nextProps.orderStage === 'searching') {
      initiateZoomTransition(this.map, nextProps.orderPickupCoords, nextProps.orderDropoffCoords);
      addTerminalPinSources(this.map);
    }

    if(['searching', 'choosing', 'signing'].includes(this.props.orderStage) && nextProps.orderStage === 'draft') {
      clearPins(this.map);
    }

    if (this.props.orderStage === 'signing' && nextProps.orderStage === 'in_mission') {
      this.props.history.push('/mission');
    }

    return false;
  }

  onVehicleClick(id) {
    if (this.props.orderStage == 'in_mission'){
      this.props.history.push('mission/vehicle/'+id);
    } else {
      this.props.history.push('/vehicle/'+id);
    }
  }

  componentDidMount() {
    this.map = createMap({
      'containerId': 'map',
      'coords': this.props.coords,
      'onVehicleClick': this.onVehicleClick,
      'onMoveEnd': this.props.onMoveEnd
    });
    const terminals = {
      pickup: this.props.orderPickupCoords,
      dropoff: this.props.orderDropoffCoords
    };
    updateMap(this.map, this.props.vehicles, terminals);
  }

  render() {
    return (
      <div>
        <div id="map" />
        <div id="map-overlay" />
      </div>
    );
  }
}

Map.defaultProps = {
  coords: {lat: 32.068717, long: 34.775805}
};

Map.propTypes = {
  vehicles: PropTypes.array.isRequired,
  chosenVehicle: PropTypes.object,
  coords: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  onMoveEnd: PropTypes.func.isRequired,
  orderStage: PropTypes.string.isRequired,
  orderPickupCoords: PropTypes.object,
  orderDropoffCoords: PropTypes.object
};

export default Map;
