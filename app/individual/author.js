var Author = React.createClass({
    
    render: function () { 
    	return (
    			<div>
	    			<PersonName personName = {this.props.author.name}/>
	    			<PersonImage imageUrl = {this.props.author.image} personName = {this.props.author.name}/>
    			</div>
    		);
    }
});