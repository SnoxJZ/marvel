import {Component} from "react";
import PropTypes from "prop-types";
import './charList.scss';
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

class CharList extends Component {
    state = {
        char: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    onCharLoaded = (newChar) => {
        let ended = false;
        if (newChar.length < 9) {
            ended = true;
        }

        this.setState(({char, offset}) => ({
            char: [...char, ...newChar],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    getCharList = (offset) => {
        this.onCharListLoading()
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    componentDidMount() {
        this.getCharList();
    }

    myRefs = [];

    setRef = (ref) => {
        this.myRefs.push(ref);
    }

    focusOnItem = (id) => {
        this.myRefs.forEach(ref => ref.classList.remove('char__item_selected'))
        this.myRefs[id].classList.add('char__item_selected');
        this.myRefs[id].focus();
    }

    renderItems = (arr) => {
        return arr.map((item, index) => {
            let style = {};
            if (item.thumbnail.includes('image_not_available')) {
                style = {objectFit: 'contain'}
            }

            return (
                <li className="char__item" key={item.id}
                    ref={this.setRef}
                    tabIndex={0}
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(index);
                    }}
                >
                    <img src={item.thumbnail} alt={item.name} style={style}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })
    }

    render() {
        const {char, loading, error, offset, newItemLoading, charEnded} = this.state;
        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(errorMessage || spinner) ? this.renderItems(char) : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                <ul className="char__grid">
                    {content}
                </ul>
                <button className="button button__main button__long"
                        disabled={newItemLoading}
                        style={{display: charEnded ? 'none' : 'block'}}
                        onClick={() => this.getCharList(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
}

export default CharList;