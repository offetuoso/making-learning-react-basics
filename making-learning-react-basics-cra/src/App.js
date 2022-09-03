import './App.css';
import React from "react";
import Title from "./components/Title";
import MainCard from "./components/MainCard";
import Favorites from "./components/Favorites";
import Form from "./components/Form";


const jsonLocalStorage = {
    setItem: (key, value) => {
        console.log(JSON.stringify(value))
        localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: (key) => {
        return JSON.parse(localStorage.getItem(key));
    },
};

const fetchCat = async () => {
    const OPEN_API_DOMAIN = "https://cataas.com";
    const response = await fetch(`${OPEN_API_DOMAIN}/cat?json=true`);
    const responseJson = await response.json();
    return `${OPEN_API_DOMAIN}${responseJson.url}`;
};

const App = () => {
    /*const [counter, setCounter] = React.useState(
        jsonLocalStorage.getItem("counter") || 1
    );*/
    const [counter, setCounter] = React.useState(() => {
        return jsonLocalStorage.getItem("counter") || 1;
    });

    const [mainCat, setMainCat] = React.useState(() => {
        return "https://offetuoso.github.io/images/etc/loading/snail-loading.gif";
    });

    const [favorites, setFavorites] = React.useState(() => {
        return jsonLocalStorage.getItem("favorites") || [];
    });
    const [value, setValue] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const alreadyFavorite = favorites.find(o => o.img === mainCat) != undefined ? true : false;

    React.useEffect(() => {
        updateMainCat();
    }, []);  // 빈배열

    function handleFormSubmit(e) {
        e.preventDefault();
        setErrorMessage("");
        updateMainCat();
    }

    function handleInputChange(e) {
        const userValue = e.target.value;
        setErrorMessage("");
        setValue(userValue.toUpperCase());
        //handleTextSubmit();
    }


    async function updateMainCat() {
        setMainCat("https://offetuoso.github.io/images/etc/loading/snail-loading.gif");
        const newCat = await fetchCat();
        setMainCat(newCat);
    }

    function handleHeartClick() {
        const nextFavorites = [...favorites, {"idx": counter, "img": mainCat, "msg": value}]
        let nextCounter;
        setCounter((prev) => {
            nextCounter = prev + 1;
            jsonLocalStorage.setItem("counter", nextCounter);
            return nextCounter;
        });

        setFavorites(nextFavorites);
        setValue("");
        jsonLocalStorage.setItem("favorites", nextFavorites);
        updateMainCat();
        //downImg();
    }


    return (
        <div>
            <Title>{counter > 1 ? `${counter} 번째 ` : ''}고양이 가라사대</Title>
            <Form value={value}
                  onFormSubmit={handleFormSubmit}
                  onInputChange={handleInputChange} errorMessage={errorMessage}/>
            <MainCard img={mainCat} value={value} title="CAT1" alreadyFavorite={alreadyFavorite}
                      onHeartClick={handleHeartClick}/>
            <Favorites favorites={favorites}/>
        </div>
    )
}

export default App;
