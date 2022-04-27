import {CanvasJSChart} from 'canvasjs-react-charts'
import React from 'react';

class Chart extends React.Component
{
    constructor(props) {
	    super(props);

		this.dataPoints = [];
		this.scores = props.state.scores;
		this.legends = props.state.format;
		this.title = props.state.title;
		this.numberOfLines = undefined;
		this.options = undefined;
		this.statisticsContainer = undefined;
						
		this.statisticsContainer = [];

		if (props.state.moreThanOneTweet)
		{
			var numberOfTweets = 0;
			for (var i = 0; i < this.legends.length; i++)
			{
				var format = this.legends[i],
					count = 0;

				for (var j = 0; j < this.scores.length; j++)
				{
					count += this.scores[j].scores.counts[i]
				}
				
				numberOfTweets += count;
				this.statisticsContainer.push(<p className='text paragraph'>{format + ": " + count}</p>)
			}			

			this.statisticsContainer.push(<p className='text paragraph'>{"Tweets evaluated: " + numberOfTweets}</p>)
		}
		else
		{
			this.statisticsContainer.push(<p className='text paragraph' font-size='200%'>{"Text evaluated: " + props.state.textEvaluated}</p>)
		}

		this.prepareData(props.state);		
    }

	getColor(labelName)
	{
		switch(labelName)
		{
			case 'neutral':
				return 'orange'
			case 'positive':
				return 'green'
			case 'negative':
				return 'red'
			default:
				return 'white'
		}
	}

	prepareColumnChart(props)
	{
		for(var i = 0; i < this.scores.length; i++)
		{
			this.dataPoints.push(
				{
					label: this.legends[i],
					y: parseFloat(this.scores[i].score)
				});
		}

		this.options = 
		{
			title: 
			{
				text: this.title
			},
			data: 
			[
				{
					type: "column",
					dataPoints: this.dataPoints
				}
			]
		}
	}

	
	prepareXYChart(props)
	{
		this.numberOfLines = props.format.length;
		this.options = 
		{
			theme: "light2",
			title: {
				text: this.title
			},
			axisY: {
				title: "number of tweets"
			},
			axisX: {
				title: "date"
			},
			data:[]
		}
		
		var me = this,
		newDatas = [];
		
		for (var j = 0; j < this.numberOfLines; j++)
		{			
			newDatas.push([]);

			for (var i = 0; i < me.scores.length; i++)
			{
				newDatas[j].push(
					{
						x: new Date(me.scores[i].date),
						y: parseFloat(me.scores[i].scores.counts[j])
					});
			}
		}

		for (j = 0; j < this.numberOfLines; j++)
		{
			me.options.data.push({
				showInLegend: true, 
				legendText: this.legends[j],
				type: "line",
				dataPoints: newDatas[j],
				color: this.getColor(this.legends[j])
			})
		}
	}

	prepareData(props)
	{
		var me = this;

		switch(props.type)
		{
			case 'column':
				me.prepareColumnChart(props);
				break;
			case 'line':
				me.prepareXYChart(props);
				break;
			default:
				break;
		}
	}	

    render() 
	{		
        return (
		<>
			{<div id='graphicClass' className='graphicClass'>
				<div className='chartClass'>
					<CanvasJSChart
						options = {this.options} 
						onRef = {ref => this.chart = ref}
					></CanvasJSChart>
				</div>
				<div className='dataResults'>
					{this.statisticsContainer}
				</div>
			</div>}
		</>
		);
    }
}

export default Chart;