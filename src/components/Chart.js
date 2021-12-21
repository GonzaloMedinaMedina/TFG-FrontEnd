import {CanvasJSChart} from 'canvasjs-react-charts'
import React from 'react';
import { FaLaptopHouse } from 'react-icons/fa';


class Chart extends React.Component
{
    constructor(props) {
	    super(props);

		this.visible = props.visible;
		this.text = props.text;
		this.updateChartVisibility = this.updateChartVisibility.bind(this);

		this.dataPoints = [];
    	this.options = 
		{
			width: (window.screen.width * 0.47),
			theme: "light2",
			title: {
				text: this.text
			},
			axisY: {
				title: "Price in USD",
				prefix: "$"
			},
			data: [{
				type: "line",
				xValueFormatString: "MMM YYYY",
				yValueFormatString: "$#,##0.00",
				dataPoints: this.dataPoints
			}]
		}		
    }

	updateChartVisibility(e) 
	{
		this.props.updateChartVisibility(e.target.value);
	}

    render() {
        return <div visible='hidden'>
			<CanvasJSChart
			  visible = {false} 
              options = {this.options} 
              onRef={ref => this.chart = ref}
        		/>
			</div>;
    }

    componentDidMount(){
		var me = this,
        chart = this.chart;

		fetch('https://canvasjs.com/data/gallery/react/nifty-stock-price.json')
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			for (var i = 0; i < data.length; i++) {
				me.dataPoints.push({
					x: new Date(data[i].x),
					y: data[i].y
				});
			}
			chart.render();
		});
	}

	
	componentDidUpdate(props)
	{
		var me = this,
		chart = this.chart;
		me.options.title.text = props.text;

		fetch('https://canvasjs.com/data/gallery/react/nifty-stock-price.json')
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			for (var i = 0; i < 5; i++) {
				me.dataPoints.push({
					x: new Date(data[i].x),
					y: data[i].y
				});
			}
			chart.render();
		});
	}
}

export default Chart;