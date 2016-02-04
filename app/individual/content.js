var HtmlContent = React.createClass({
    

    rawMarkup: function() {
        var rawMarkup = marked(this.props.htmlContent, {sanitize: true});
        return { __html: rawMarkup };
    },    
    render: function () { 
    	return (
    			<div>{this.rawMarkup()}</div>
    		);
    }
});