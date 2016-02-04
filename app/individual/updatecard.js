var UpdateCard = React.createClass({
    
    render: function () { 
        var header = {};
        header.text = this.props.update.heading;
        header.publishTime = this.props.update.publishTime;
        header.publishDate = this.props.update.publishDate;
        header.url=this.props.update.url;

        var footer = {};
        footer.author = {};
        footer.author.name = this.props.update.authorName;        
        footer.author.image = this.props.update.authorImage;
        footer.heartCount = this.props.update.heartCount;

    	return (
    			<div className="card">
                    <Header read={this.props.update.read} header={header}/>
                    <HtmlContent content={this.props.update.content}/>
                    <Footer footer={footer}/>
                </div>
    		);
    }
});