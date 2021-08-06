import React from 'react';
 
import axios from 'axios';
import ReactWordcloud from 'react-wordcloud';
 
export default class NamedEntities extends React.Component {

    state = {
        words: []
    }
 
    componentDidMount() {
        axios.get('')
            .then(res => {
                const words = res.data;
                console.log(words);
                this.setState({words:words});
            })
    }
 
    render() {
        return (
            <div className="word-cloud">
                <h1>Word Cloud</h1>
                <ReactWordcloud
                words={this.state.words}
                options={{
                    colors: [
                      "#1f77b4",
                      "#ff7f0e",
                      "#2ca02c",
                      "#d62728",
                      "#9467bd",
                      "#8c564b",
                    ],
                    enableTooltip: true,
                    deterministic: false,
                    fontFamily: "impact",
                    fontSizes: [20, 35],
                    // fontSizes: [20, 60],
                    fontStyle: "normal",
                    fontWeight: "bold",
                    // padding: 1,
                    rotations: 2,
                    rotationAngles: [46, 0],
                    scale: "linear",
                    spiral: "rectangular",
                    transitionDuration: 10,
                  }}
                />
                </div>
        )
    }
}