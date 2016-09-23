import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';

var App = React.createClass({
  getInitialState: function() {
    return {
      color: Math.floor(Math.random()*16777216),
      submittedColor: ''
    };
  },
  render: function() {
    var contentStyle = {
      backgroundColor: '#'+this.state.color.toString(16)
    };
    return (
      <div
        className="content"
        style={contentStyle}>
        <div
          className="hash-container">
          <div
            className="hash">
            <span
              onClick={this.submitColor}>#</span>
            <input
              onChange={this.changeColor}
              onKeyPress={this.handleKeyPress}
              type="text"
              size="6"
              value={this.state.submittedColor}/>
          </div>
        </div>
        <div
          className="chart-container">
          <div
            className="chart-arrow">^</div>
          <div
            id="curve_chart"></div>
        </div>
      </div>
    );
  },
  changeColor: function(e){
    this.setState({submittedColor: e.target.value.toUpperCase()});
  },
  handleKeyPress: function(e){
    if (e.key === 'Enter'){
      this.submitColor();
    }
  },
  submitColor: function(){
    var diff = this.getDiff(
      parseInt(this.state.submittedColor, 16),
      this.state.color
    );
    var scoreHistory = localStorage.scoreHistory;
    if (!scoreHistory){
      scoreHistory = []
    }
    else{
      scoreHistory = JSON.parse(scoreHistory);
    }
    scoreHistory.push(diff);
    localStorage.setItem('scoreHistory', JSON.stringify(scoreHistory));
    this.setState({
      submittedColor: '',
      color: Math.floor(Math.random()*16777216)
    });
    drawChart();
  },
  getDiff: function(hex1, hex2){
    var total = 0;
    var hex = (1<<8)-1;
    for (var i = 0; i < 3; i++){
      total += Math.abs((hex1&hex) - (hex2&hex));
      hex1 = hex1>>8;
      hex2 = hex2>>8;
    }
    return total;
  }
});

render(
  <App/>,
  document.getElementById('app'));

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart(){
  var scoreHistory = localStorage.scoreHistory;
  if (!scoreHistory){
    scoreHistory = []
  }
  else{
    scoreHistory = JSON.parse(scoreHistory);
  }
  console.log(scoreHistory);
  var data = new google.visualization.DataTable();
  data.addColumn('number', 'index');
  data.addColumn('number', 'score');
  data.addRows(scoreHistory.map(function(element, i){
    return [i, element];
  }));

  var options = {
    title: 'Scores',
    curveType: 'function',
    legend: { position: 'bottom' }
  };

  var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

  chart.draw(data, options);
};
