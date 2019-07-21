import React, { Component } from 'react';
import './style.css';

class RangeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: parseFloat(this.props.value)
        };
    }

    handleChange(event) {
        this.props.handleChange(event);
        this.setState({ value: parseFloat(event.target.value) });
    }

    render() {
        return (
            <div className="slidecontainer">
                <p>{this.props.description} value: {this.state.value}</p>
                <input ref={this.input} type="range" min={this.props.min} max={this.props.max} step={this.props.step} className="slider" id="myRange" value={this.state.value} onChange={(event) => this.handleChange(event)} />
            </div>
        );
    }
}

export default RangeComponent;
