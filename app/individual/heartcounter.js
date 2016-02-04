var HeartCounter = React.createClass({
    
    render: function () { 
    	return (
    			<div>
    				<img src="heart.png"/>
    				<div>{this.props.heartCount}</div>
    			</div>
    		);
    }
});