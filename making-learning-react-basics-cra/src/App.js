import './App.css';
import React from "react";
import html2canvas from "html2canvas";


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

function CatItem({id, img, title, msg, onDownClick}) {

    return (
        <li>
            <div id={`cat_${id}`} className="favorite-card">
                <img
                    src={img}
                    alt={title}
                    style={{width: '150px' /*, border: '1px solid red'*/}} //스타일 자체를 props로 넘기기 {} 새로운 객체로 묶어 보냄
                />
                <div>
                    <span className="card-msg">{msg}</span>
                </div>
                <button data-idx={id} onClick={onDownClick} data-html2canvas-ignore="true">💾</button>
            </div>
        </li>

    )
}

const Title = (props) => {
    return <h1>{props.children}</h1>
}

function Favorites({favorites}) {

    if (favorites.length === 0) {
        return <div>사진 위 하트를 눌러 고양이 사진을 저장해 봐요!</div>
    }

    function downImg(id) {
        html2canvas(document.querySelector("#" + id), {
            logging: true,
            letterRendering: 1,
            allowTaint: true,
            useCORS: true
        }).then(canvas => {
            var myImage = canvas.toDataURL();
            downloadURI(myImage, id + ".png")
        })
    }

    function downloadURI(uri, name) {
        var link = document.createElement("a")
        link.download = name;
        link.href = uri;
        //console.log(uri)

        document.body.appendChild(link);
        link.click();
    }

    function handleDownClick(e) {
        e.preventDefault();
        let idx = e.target.getAttribute('data-idx');
        downImg('cat_' + idx);
    }

    return (
        <ul className="favorites">
            {favorites.map(cat => <CatItem id={cat.idx} img={cat.img} msg={cat.msg} title={cat.msg} key={cat.idx}
                                           onDownClick={handleDownClick}/>)}
        </ul>
    )
}


const MainCard = ({img, value, onHeartClick, alreadyFavorite}) => {
    const heartIcon = alreadyFavorite ? "💖" : "🤍";
    return (
        <div id="main-card" className="main-card">
            <img
                src={img}
                alt="고양이"
                width="400"
            />
            <div>
                <span className="card-msg">{value}</span>
            </div>
            <button onClick={onHeartClick} data-html2canvas-ignore="true">{heartIcon}</button>
        </div>
    )
}

const Form = ({value, onFormSubmit, onInputChange, errorMessage}) => {

    return (
        <form>
            <input type="text"
                   name="name"
                   placeholder="대사를 입력해주세요"
                   value={value}
                   onChange={onInputChange}
            />
            <a className="w-btn w-btn-gray" onClick={onFormSubmit}>새로운 고양이</a>
            <p style={{color: 'red'}}>{errorMessage}</p>
        </form>
    )
}

const App = () => {
    /*const [counter, setCounter] = React.useState(
        jsonLocalStorage.getItem("counter") || 1
    );*/
    const [counter, setCounter] = React.useState(() => {
        return jsonLocalStorage.getItem("counter") || 1;
    });

    const [mainCat, setMainCat] = React.useState("https://offetuoso.github.io/images/etc/loading/snail-loading.gif");

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
