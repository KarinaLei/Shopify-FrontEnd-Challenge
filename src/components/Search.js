import React from 'react';
import './Search.css';
import axios from 'axios';
import NominateBut from './NominateBut';
import RemoveBut from './RemoveBut';
import Banner from 'react-js-banner';

class Search extends React.Component {

    constructor( props ) {
        super( props );

        this.state = {
            query: '',
            lastQuery: '',
            page: 1,
            results: {},
            totalResults: 0,
            message: '',
            nominees: new Map()
        }

        this.bannerCss = {
            // color: '#42474c', 
            color: 'black',
            backgroundColor: 'white', 
            position: 'fixed', 
            top: '0',
            width: '100%',
            height: '32px',
            opacity: 0.8
        }
    }

    renderBanner = () => {
        const nominees = this.state.nominees;
        if (nominees.size >= 5) {
            return (
                <Banner
                    title="Congratulations! You've selected your top 5 movies! 🎥"
                    css={ this.bannerCss }
                    visibleTime={ 3000 }
                />
            )
        }
    }

    renderNominees = () => {
        const nominees = this.state.nominees;
        const keys = Array.from( nominees.keys() );
        const values = Array.from( nominees.values() );
        if ( nominees.size ) {
            return (
                <div className="nominee-container">
                    <div className="header-container nominee-header">
                        <h1> { nominees.size } Nominees</h1>
                    </div>
                    <div key="row-header" className="row-header">
                        <span className="result-header left">Title</span>
                        <span className="result-header middleRight">Year of Released</span>
                        <span className="result-header right">Action</span>
                    </div>
                    <hr/>
                    <div className="nominee">
                        { (keys, values).map( (key, value) => {
                            return (
                                <div key={ keys[value] } className="result-row">
                                    <span className="result-title left">{ key.title }</span>
                                    <span className="result-year middle">{ key.yor }</span>
                                    <RemoveBut 
                                                action = { this.remove }
                                                imdbID = { keys[value] }
                                                title = { key.title }
                                                yor = { key.yor }/>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="nominee-container">
                    <div className="header-container nominee-header">
                        <h1>Nominees</h1>
                    </div>
                    <div key="row-header" className="row-header">
                                <span className="result-header left">Title</span>
                                <span className="result-header middleRight">Year of Released</span>
                                <span className="result-header right">Action</span>
                    </div>
                </div>
            )
        }
    }

    renderSearchResults = () => {
        const { results } = this.state;
        const { lastQuery } = this.state;
        if ( !this.state.message.length && Object.keys( results ) && results.length ) {
            return (
                <div className="result-container">
                    <div className="header-container result-header">
                        <h1 className="msg">{ this.state.totalResults } results for "{ lastQuery }"</h1>
                    </div>
                    <div className="top pagination">
                        <button className={ this.state.page === 1 ? "inactive page-button" : "active page-button" } disabled={ this.state.page === 1 } onClick={ this.previousPage }> Previous </button>
                        <button className={ this.state.page * 10 >= this.state.totalResults ? "inactive page-button" : "active page-button"} disabled={ this.state.page * 10 >= this.state.totalResults } onClick={ this.nextPage }> Next </button>
                    </div>
                    <div className="result">
                        <div key="row-header" className="row-header">
                            <span className="result-header left">Title</span>
                            <span className="result-header middle">Year of Released</span>
                            <span className="result-header right">Action</span>
                        </div>
                        <hr/>
                        { results.map( result => {
                            return (
                                <div key={ result.imdbID } className="result-row">
                                    <span className="result-title left">{ result.Title }</span>
                                    <span className="result-year middle">{ result.Year }</span>
                                    <span className="result-button right"><NominateBut
                                                action = { this.toggleSearch } 
                                                nominees = { this.state.nominees }
                                                imdbID = { result.imdbID } 
                                                title = { result.Title }
                                                yor = { result.Year }
                                                active={ this.state.nominees.has(result.imdbID) ? false : true }/>
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="bottom pagination">
                        <button className={ this.state.page === 1 ? "inactive page-button" : "active page-button" } disabled={ this.state.page === 1 } onClick={ this.previousPage }> Previous </button>
                        <button className={ this.state.page * 10 >= this.state.totalResults ? "inactive page-button" : "active page-button"} disabled={ this.state.page * 10 >= this.state.totalResults } onClick={ this.nextPage }> Next </button>
                    </div>
                </div>
            )
        }
        else {
            if ( ! this.state.message.length ) {
                return (
                    <div className="result-container">
                        <div className="header-container">
                            <h1 className="msg">Search Result</h1>
                        </div>
                        <div key="row-header" className="row-header">
                            <span className="result-header left">Title</span>
                            <span className="result-header middle">Year of Released</span>
                            <span className="result-header right">Action</span>
                        </div>
                    </div>
                )
            }
            else {
                return (
                    <div className="result-container">
                        <div className="header-container">
                            <h1 className="msg">Search Result</h1>
                        </div>
                        <div key="row-header" className="row-header">
                            <span className="result-header left">Title</span>
                            <span className="result-header middle">Year of Released</span>
                            <span className="result-header right">Action</span>
                        </div>
                        <h1 className="msg red">{ this.state.message }</h1>
                    </div>
                )
            }
        }
    }

    nextPage = ( event ) => {
        const { page } = this.state; 
        this.setState({ page: page + 1 }, () => {
            this.fetchSearchResult()
        })
    } 

    previousPage = ( event ) => {
        console.warn(this.state.totalResults)
        const { page } = this.state; 
        this.setState({ page: page - 1 }, () => {
            this.fetchSearchResult()
        })
    }

    toggleSearch = ( imdbID, title, yor ) => {
        if ( this.state.nominees.has(imdbID) ) {
            this.state.nominees.delete(imdbID);
            this.setState( {
                nominees: this.state.nominees
            })
        }
        else {
            if ( this.state.nominees.size < 5 ) {
                const data = { title: title, yor: yor };
                this.state.nominees.set(imdbID, data);
                this.setState( {
                    nominees: this.state.nominees
                })
            }
        }
    }

    remove = ( imdbID ) => {
        if ( this.state.nominees.has(imdbID) ) {
            this.state.nominees.delete(imdbID);
            this.setState( {
                nominees: this.state.nominees
            })
        }
    }

    fetchSearchResult = (  ) => {
        const API_KEY = process.env.REACT_APP_OMDB_API_KEY;
        const query = this.state.query;
        let page = this.state.page;
        this.setState( {
            lastQuery: query
        });
        if ( query.length ) {
            const searchURL = `https://www.omdbapi.com/?apikey=${ API_KEY }&s=${ query }&page=${ page }`;
            axios.get( searchURL )
                .then( res => {
                    if ( res.data.Search ) {
                        this.setState( {
                            results: res.data.Search,
                            totalResults: res.data.totalResults,
                            message: ''
                        });
                    }
                    else {
                        this.setState( {
                            results: {},
                            totalResults: 0,
                            message: 'Movie not found.'
                        });
                    }
                })
                .catch( error => {
                    if ( error ) {
                        this.setState( {
                            results: {},
                            totalResults: 0,
                            message: 'Failed to fetch data. Check your network connection.'
                        });
                    } 
                })
        }
        else {
            this.setState( {
                results: {},
                totalResults: 0,
                message: 'Movie name cannot be empty.'
            });
        }
    }

    inputOnChangeHandler = ( event ) => {
        const query = event.target.value;
        this.setState({
            query: query,
            message: '',
            page: 1
        });
    }

    render() {
        const { query } = this.state;
        return (
            <div className="page-container">
                <div className="header-container">
                    <h1 className="header"><span id="shoppies1">The Shoppies:</span><br/><br/><span id="shoppies2">Movie Awards for Entrepreneurs</span></h1>
                    <h2 className="note">Nominate Your Top 5 Favorite Movies!</h2>
                </div>
                <div className="search-container">
                    <div className="label-container">
                        <p className="title">Search Movie by Title</p>
                        <label className="search-label" htmlFor="search-input">
                            <i className="fas fa-search icon"></i>
                            <span>
                                <input
                                type="text"
                                name="query"
                                value={query}
                                id="search-input"
                                placeholder="Movie Title (e.g. Titanic)"
                                onChange={ this.inputOnChangeHandler }
                                />
                            </span>
                            <span>
                                <button onClick={ this.fetchSearchResult } className="button" id="search">Search</button>
                            </span>
                        </label>
                    </div>
                </div>
                {/* Result */}
                <div className="search-nominee-results">
                    <span className="search-result">
                    {this.renderSearchResults()}
                    </span>
                    {/* Nominees */}
                    <span className="nominee-result">
                    {this.renderNominees()}
                    </span>
                </div>
                {/* Banner */}
                {this.renderBanner()}
            </div>
        )
    }
}

export default Search;