
import React from 'react';

// COMPONENTS
import GridArea from './components/GridArea';

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
        <GridArea />
      </>
    );
  }
}

export default App;

