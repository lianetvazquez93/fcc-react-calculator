import React from 'react';

class Output extends React.Component {
    render() {
        return <div id="display" className="output"> {this.props.output} </div>
    }
}

export default Output;