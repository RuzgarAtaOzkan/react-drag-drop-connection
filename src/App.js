import React from 'react';

// COMPONENTS
import Chart from './components/Chart';

// STYLES
import './styles/App.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.clear();
  }

  render() {
    return (
      <>
        <Chart />
      </>
    );
  }
}

export default App;
