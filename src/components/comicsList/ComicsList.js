import './comicsList.scss';
import uw from '../../resources/img/UW.png';
import xMen from '../../resources/img/x-men.png';
import useMarvelService from "../../services/MarvelService";
import {useEffect, useState} from "react";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

const ComicsList = () => {
    const {loading, error, getAllComics, clearError} = useMarvelService();

    const [comics, setComics] = useState([]);
    const [offset, setOffset] = useState(0);
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [comicsEnded, setComicsEnded] = useState(false)


    useEffect(() => {
        getComicsList(offset, true);
    }, []);

    const getComicsList = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicsLoad)
    }

    const onComicsLoad = (newComics) => {
        let ended = false;
        if (newComics.length < 8) {
            ended = true;
        }

        setComics([...comics, ...newComics]);
        setNewItemLoading(false);
        setOffset(offset => offset + 8);
        setComicsEnded(ended);
    }

    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            <ul className="comics__grid">
                {comics.map(item => {
                    let style = {};
                    if (item.thumbnail && item.thumbnail.includes('image_not_available')) {
                        style = {objectFit: 'contain'}
                    }
                    return (
                        <li className="comics__item" key={item.id}>
                            <a href="#">
                                <img src={item.thumbnail} alt={item.title} style={style} className="comics__item-img"/>
                                <div className="comics__item-name">{item.title}</div>
                                <div className="comics__item-price">{item.price}</div>
                            </a>
                        </li>
                    )
                })}
            </ul>
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{display: comicsEnded ? 'none' : 'block'}}
                onClick={() => getComicsList(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;