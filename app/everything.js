var HtmlContent = React.createClass({

    render: function () {
      return (
          <div className="col-md-10 col-md-offset-1 raw-content" dangerouslySetInnerHTML={{__html:this.props.content}}></div>
        );
    }
});

var HeartCounter = React.createClass({
    getInitialState: function(){
      return ({hearted : false, heartCount : 0});
    },
    componentDidMount: function(){
      this.setState({hearted : this.props.hearted, heartCount : this.props.heartCount});
    },
    handleHearted : function(){
      console.log("Hearted :" + this.props.hearted);
      var heartCount = this.state.hearted ? this.state.heartCount - 1 : this.state.heartCount + 1;
      this.setState({hearted : !this.state.hearted, heartCount: heartCount});
      this.props.handleRecommend(!this.state.hearted);

    },
    render: function () {
      var svgTag = '<use className="svgIcon-use svgIcon-use--part0" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-heart-29px-p0"></use>';
      return (

        <ul className="nav nav-pills">
          <li className="active">
             <a onClick={this.handleHearted}><span className="badge pull-right">{this.state.heartCount}</span>Love It!</a>
          </li>
        </ul>
        );
    }
});

var PersonName = React.createClass({

    render: function () {
      return (
          <div className="post-meta">{this.props.personName}</div>
        );
    }
});

var Footer = React.createClass({

    render: function () {
      return (
          <ul className="col-md-12 list-inline">
            <li><HeartCounter heartCount={this.props.footer.heartCount} hearted={this.props.footer.hearted} handleRecommend={this.props.footer.handleRecommend}/> </li>
            <li className="pull-right" ><Author author={this.props.footer.author}/></li>
          </ul>
        );
    }
});

var Author = React.createClass({

    render: function () {
      return (
          <ul className="list-inline">
            <li><PersonImage imageUrl = {this.props.author.image} personName = {this.props.author.name}/></li>
            <li><PersonName personName = {this.props.author.name}/></li>

          </ul>
        );
    }
});

var PersonImage = React.createClass({

    render: function () {
      return (
          <img alt="{this.props.personName}" height="20" src="{this.props.imageUrl}" width="20"/>
        );
    }
});



var Header = React.createClass({

    render: function () {

      return (
          <ul className = "col-md-12 list-inline post-preview">
            { this.props.read ? null :<div id="whats_new"></div> }
            <li><a href="{this.props.header.url}"><h2>{this.props.header.text}</h2></a></li>
            <li className="pull-right"><time datetime="{this.props.header.publishTime}" is="relative-time">{this.props.header.publishDate}</time></li>
          </ul>
        );
    }
});

var UpdateCard = React.createClass({
    handleRecommend: function(e) {
      console.log("Came to handle recommend");
      var sock = this.props.socket;
      var recommendObj = {id:this.props.update.id, userId: this.props.userId};
      console.log(this.props.update.hearts);
      if(e){
        console.log("Adding recommendation");
        recommendObj.toRecommend = true;
        if(this.props.update.hearts === undefined)
          this.props.update.hearts = [this.props.userId];
        else
          this.props.update.hearts.push(this.props.userId);

      }else{
        recommendObj.toRecommend = false;
        console.log("Removing recommendation");
        this.props.update.hearts.splice(this.props.update.hearts.indexOf(this.props.userId), this.props.userId);
      }
      console.log(this.props.update);
      sock.emit('recommend',recommendObj);
    },
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

        if(this.props.update.hearts === undefined) {
          footer.hearted = false;
          footer.heartCount = 0;
        }else {
          footer.hearted = this.props.update.hearts.indexOf(this.props.userId) > -1;
          footer.heartCount = this.props.update.hearts.length;
        }

        footer.handleRecommend = this.handleRecommend;

      return (
          <div className="card col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                    <Header  read={this.props.update.read && this.props.update.read.indexOf(this.props.userId) > -1} header={header}/>
                    <HtmlContent content={this.props.update.content}/>
                    <div className="divider"></div>
                    <Footer footer={footer}/>
          </div>

        );
    }
});

var UpdateList = React.createClass({

    render: function() {
        var uId = this.props.userId;
        var sock = this.props.socket;
        var updateCards = this.props.data.map(function(update) {
          return (
                  <UpdateCard update={update} key={update.id} userId={uId} socket={sock}/>
              );
        });

        return (
            <div className="updateCardList">
                {updateCards}
            </div>
        );
    }
});


var UpdateBox = React.createClass({
  getInitialState: function() {
      return {data: [], userId : null, page : 1, hasMore : true};
  },
  markAsRead: function(socket,data) {

    var toMarkAsRead = [];
    console.log(data);
    for (var i = 0; i < data.length; i++) {

        if(!data[i].read || data[i].read.indexOf(this.state.userId) == -1)
          toMarkAsRead.push(data[i].id);
    }
    var updateParams = {idList: toMarkAsRead,userId : this.state.userId};
    socket.emit('markread',updateParams);
  },
  componentDidMount: function() {
    var socket = io.connect("localhost:8100");
    var t = this;
    socket.on("dataset", function(datau) {
      t.setState({data: datau, userId : "2", socket : socket});
      t.markAsRead(socket,datau);
    });
  },

  loadMore: function(){
    console.log("Load more called");
    console.log("Current page " + this.state.page);

    var prevState = this.state;
    var socket = this.state.socket;
    socket.emit('loadmore',10*this.state.page);
    var t = this;
    this.state.socket.on("moredata",function(datau){
      var newState = prevState;
      if(datau && datau.length > 1){
       newState.data = prevState.data.concat(datau);
       newState.page = prevState.page;
       newState.hasMore = true
       if(datau.length < 10)
        newState.hasMore = false;
      else
        newState.hasMore = true;
      } else {
       newState.hasMore = false;
     }
     t.setState(newState);

    });
  },
  render: function() {
    return (

      <div className="updateBox">
        <div className="site-heading">
          <h1>Product Updates</h1>
        </div>
        <UpdateList data={this.state.data} userId={this.state.userId} socket={this.state.socket}/>
        {this.state.hasMore ? <div className="col-md-offset-5 col-md-6"><button className="button" onClick={this.loadMore}>Load More</button></div> : null}
      </div>
    );
  }
});

ReactDOM.render(
  <UpdateBox className="row"/>,
  document.getElementById('content')
);
