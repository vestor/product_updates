var Header = React.createClass({
    
    render: function () { 
    	return (
    			<div>
    				if(!this.props.read){
    					<img src="unread.png"/>
    				}
    				<a href="{this.props.header.url}"><h1>{this.props.header.text}</h1></a>
    				<time datetime="{this.props.header.publishTime}" is="relative-time">{this.props.header.publishDate}</time>
    			</div>
    		);
    }
});