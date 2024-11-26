import {Component} from "react";
import './charList.scss';
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

class CharList extends Component {
    state = {
        char: [],
        loading: true,
        error: false,
    }

    marvelService = new MarvelService();

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    getCharList = () => {
        this.marvelService
            .getAllCharacters()
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    componentDidMount() {
        this.getCharList();
    }

    render() {
        const {char, loading, error} = this.state;
        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                <ul className="char__grid">
                    {!(errorMessage || spinner) ?
                        char.map(item => {
                            let style = {};
                            if (item.thumbnail.includes('image_not_available')) {
                                style = {objectFit: 'contain'}
                            }
                            return (<li className="char__item" key={item.id}>
                                <img src={item.thumbnail} alt={item.name} style={style}/>
                                <div className="char__name">{item.name}</div>
                            </li>)
                        })
                        :
                        null
                    }
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;