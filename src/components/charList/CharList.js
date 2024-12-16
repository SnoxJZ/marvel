import {useState, useEffect, useRef}  from "react";
import PropTypes from "prop-types";
import './charList.scss';
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import useMarvelService from "../../services/MarvelService";
import { motion } from "motion/react"

const CharList = (props) => {
    const [char, setChar] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        getCharList(offset, true)
    }, []);

    const getCharList = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharLoaded)
    }

    const onCharLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        setChar(char =>[...char, ...newChars]);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
    }

    const myRefs = useRef([]);

    const focusOnItem = (id) => {
        myRefs.current.forEach(ref => ref.classList.remove('char__item_selected'))
        myRefs.current[id].classList.add('char__item_selected');
        myRefs.current[id].focus();
    }

    function renderItems(arr) {
        return arr.map((item, index) => {
            const localIndex = index % 9;
            let style = {};
            if (item.thumbnail.includes('image_not_available')) {
                style = {objectFit: 'contain'}
            }

            return (
                <motion.li className="char__item" key={item.id}
                    initial={{opacity: 0}} 
                    animate={{opacity: 1}}
                    transition={{duration: "0.3", delay: 0.1 * localIndex}}
                    ref={el => myRefs.current[index] = el}
                    tabIndex={0}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(index);
                    }}
                    onKeyUp={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            props.onCharSelected(item.id);
                            focusOnItem(index);
                        }
                    }}
                >
                    <img src={item.thumbnail} alt={item.name} style={style}/>
                    <div className="char__name">{item.name}</div>
                </motion.li>
            )
        })
    }

    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    const content = !(errorMessage || spinner) ? renderItems(char) : null;

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
                    onClick={() => getCharList(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
}

export default CharList;