var PersonImage = React.createClass({
    
    render: function () { 
    	return (
    			<img alt="{this.props.personName}" height="20" src="{this.props.imageUrl}" width="20">
    		);
    }
});