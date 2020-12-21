import React, { Component } from 'react';
import { Button } from 'antd';
import ToggleButton from 'react-toggle-button';
import { ipcRenderer, remote, desktopCapturer } from 'electron';
import Timer from 'react-compound-timer';
import Clock from 'react-live-clock';
import '../assets/css/App.css';

const { CATCH_WORK_STATUS } = require('./../../utils/constants');
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
  }

  render() {
    return (
      <div>
        <h2 style={{ color: 'green' }}>Workfolio functionality!!!!</h2>

        <div style={{ padding: '0px 0px 25px 0px' }}>
          <div style={{ fontSize: 20 }}>Live Clock</div>
          <div style={{ fontSize: 25, color: 'blue' }}>
            <Clock format={'h:mm:ssa'} style={{ fontSize: '1.5em' }} ticking={true} />
          </div>
        </div>
        <div style={{ padding: '0px 0px 25px 0px' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ fontSize: 20, padding: '10px 0px' }}>Work Status</div>
            <Button className={this.state.active ? 'activeButton' : 'inActiveButton'}>
              {this.state.active ? 'Online' : 'Offline'}
            </Button>
          </div>
          <ToggleButton
            value={this.state.active}
            thumbStyle={{ borderRadius: 2 }}
            trackStyle={{ borderRadius: 2 }}
            onToggle={(value) => {
              ipcRenderer.send(CATCH_WORK_STATUS, !value ? 'online' : 'offline');
              this.setState({
                active: !value,
              });
            }}
          />
        </div>
        <div style={{ padding: '0px 0px 25px 0px' }}>
          <div style={{ fontSize: 20 }}>Live Clock</div>
          <Timer initialTime={0} startImmediately={false}>
            {({ start, resume, pause, stop, reset }) => (
              <React.Fragment>
                <div style={{ fontSize: 24, color: 'blue' }}>
                  <Timer.Days /> days &nbsp;
                  <Timer.Hours /> hours &nbsp;
                  <Timer.Minutes /> minutes &nbsp;
                  <Timer.Seconds /> seconds &nbsp;
                </div>

                <br />
                <div>
                  <Button type="primary" onClick={start}>
                    Start
                  </Button>
                  <Button onClick={pause}>Pause</Button>
                  <Button onClick={resume}>Resume</Button>
                  <Button onClick={stop}>Stop</Button>
                  <Button onClick={reset}>Reset</Button>
                </div>
              </React.Fragment>
            )}
          </Timer>
        </div>
      </div>
    );
  }
}

export default App;
