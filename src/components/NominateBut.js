import React from 'react';
import './Button.css';

class NominateBut extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            action: this.props.action,
            nominees: this.props.nominees,
            imdbID: this.props.imdbID,
            title: this.props.title,
            yor: this.props.yor,
        };
        this.state.action = this.state.action.bind(this);
    }

    onClick = ( event ) => {
        const { imdbID } = this.state;
        const { title } = this.state;
        const { yor } = this.state;
        this.state.action( imdbID, title, yor );
    }


    render() {
        return (
            <button disabled={ this.state.nominees.has(this.props.imdbID) } className={this.state.nominees.has(this.props.imdbID) ? 'inactive button' : 'active button'} onClick={ this.onClick }> Nominate </button>
        )
    }
}

export default NominateBut;