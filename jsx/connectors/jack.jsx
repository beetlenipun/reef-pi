import React from 'react'
import PropTypes from 'prop-types'
import { showError } from 'utils/alert'

export default class Jack extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      edit: false,
      name: props.name,
      pins: props.pins.join(','),
      driver: props.driver,
      lbl: 'edit'
    }
    this.edit = this.edit.bind(this)
    this.editUI = this.editUI.bind(this)
    this.ui = this.ui.bind(this)
    this.setDriver = this.setDriver.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handlePinChange = this.handlePinChange.bind(this)
  }

  handleNameChange (e) {
    this.setState({ name: e.target.value })
  }
  handlePinChange (e) {
    this.setState({ pins: e.target.value })
  }
  setDriver (k) {
    return () => {
      this.setState({
        driver: k
      })
    }
  }

  edit () {
    if (!this.state.edit) {
      this.setState({
        edit: true,
        lbl: 'save'
      })
      return
    }
    var pins = this.state.pins.split(',').map(p => {
      return parseInt(p)
    })
    for (var i = 0; i < pins.length; i++) {
      if (isNaN(pins[i])) {
        showError('Use only comma separated numbers')
        return
      }
    }
    var payload = {
      name: this.state.name,
      pins: pins,
      driver: this.state.driver
    }
    this.props.update(payload)
    this.setState({
      edit: false,
      lbl: 'edit',
      name: payload.name,
      pins: payload.pins.join(',')
    })
  }

  editUI () {
    return (
      <div className='row'>
        <div className='col-12 col-md-6'>
          <div className='form-group'>
            <label htmlFor={'jack-' + this.props.jack_id + '-name'}> Name </label>
            <input
              type='text'
              id={'jack-' + this.props.jack_id + '-name'}
              onChange={this.handleNameChange}
              className='jack-name form-control'
              value={this.state.name}
            />
          </div>
        </div>
        <div className='col-12 col-md-3'>
          <div className='form-group'>
            <label htmlFor={'jack-' + this.props.jack_id + '-pins'}> Pin </label>
            <input
              type='text'
              id={'jack-' + this.props.jack_id + '-pins'}
              onChange={this.handlePinChange}
              className='jack-pin form-control'
              value={this.state.pins}
            />
          </div>
        </div>
        <div className='col-12 col-md-3'>
          <div className='form-group'>
            <label>Driver</label>
            <div className='dropdown'>
              <button
                className='jack-type btn btn-secondary dropdown-toggle form-control col-12'
                type='button'
                id={this.props.jack_id + '-driver-selection'}
                data-toggle='dropdown'
              >
                {this.state.driver}
              </button>
              <div className='dropdown-menu col-12'>
                <a className='dropdown-item' href='#' onClick={this.setDriver('rpi')}>
                  rpi
                </a>
                <a className='dropdown-item' href='#' onClick={this.setDriver('pca9685')}>
                  pca9685
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  ui () {
    return (
      <div className='row'>
        <div className='col-4'>{this.state.name}</div>
        <div className='col-1'>
          <label className='small'>{this.state.pins}</label>
        </div>
        <div className='col-7'>
          <label className='small'>{this.state.driver}</label>
        </div>
      </div>
    )
  }

  render () {
    return (
      <div className='row border-bottom py-1'>
        <div className='col-8 col-md-9'>{this.state.edit ? this.editUI() : this.ui()}</div>
        <div className='col-4 col-md-3 mb-'>
          <input
            type='button'
            className='jack-remove btn btn-sm btn-outline-danger float-right d-block d-sm-inline ml-2'
            value='X'
            onClick={this.props.remove}
          />
          <input
            type='button'
            className='jack-edit btn btn-sm btn-outline-primary float-right d-block d-sm-inline ml-2'
            value={this.state.lbl}
            onClick={this.edit}
          />
        </div>
      </div>
    )
  }
}

Jack.propTypes = {
  name: PropTypes.string.isRequired,
  pins: PropTypes.array.isRequired,
  jack_id: PropTypes.string.isRequired,
  remove: PropTypes.func,
  update: PropTypes.func
}
