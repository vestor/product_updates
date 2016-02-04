var UpdateBox = React.createClass({
  getInitialState: function() {
      return {data: [{
                      authorName : "Manish",
                      authorPic : "",
                      content : "Well, This is a dummy html content",
                      tagList : ["awesome","wow","much"],
                      heading : "Awesome Update 1",
                      read : false,
                      datePublished : "24-10-2015",
                      heartCount : 1
                    },
                    {
                      authorName : "Sharma",
                      authorPic : "",
                      content : "This is another dummy content with <a href=\"#\">Link</a>",
                      tagList : ["awesome","much"],
                      heading : "Awesome Update 2",
                      read : true,
                      datePublished : "23-10-2015",
                      heartCount : 20
                    }
                    ]};
  },

  render: function() {
    return (
      <div className="updateBox">
        
        <UpdateList data={this.state.data} />
        
      </div>
    );
  }
});

ReactDOM.render(
  <UpdateBox/>,
  document.getElementById('content')
);