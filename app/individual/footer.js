var Footer = React.createClass({
    
    render: function () { 
    	return (
    			<div>
	    			
	    			<HeartCounter heartCount={this.props.footer.heartCount}/>
	    			<Author author={this.props.footer.author}/>
    			</div>
    		);
    }
});