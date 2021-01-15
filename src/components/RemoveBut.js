import React from 'react';
import './Button.css';

class RemoveBut extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            action: this.props.action,
            imdbID: this.props.imdbID,
            title: this.props.title,
            yor: this.props.yor,
        };
        this.state.action = this.state.action.bind(this);
    }

    onClick = ( event ) => {
        const imdbID = this.props.imdbID;
        this.state.action( imdbID );
    }

    render() {
        return (
            <button className="button" onClick={ this.onClick }> Remove </button>
        )
    }
}

export default RemoveBut;