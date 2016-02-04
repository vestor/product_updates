var UpdateList = React.createClass({
    
    render: function() {
        var updateCards = this.props.data.map(function(update) {
        return (
                <UpdateCard update={update} key={update.id}/>
            );
        });

        return (
            <div className="updateCardList">
                {updateCards}
            </div>
        );
    }
});