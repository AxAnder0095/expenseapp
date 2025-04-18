import './App.css'
import Auth from "./components/Auth.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "./store/currentUserSlice.js";
import {Home} from "./Home.jsx";
import {Home2} from "./Home2.jsx";

function App() {
    const user = useSelector(selectCurrentUser);


    return (
        <>
            {user.currentUser ?
                <BrowserRouter>
                    <Routes>
                        <Route index element={<Home2/>}/>
                    </Routes>
                </BrowserRouter>
                :
                <Auth/>
            }
        </>
    )
}

export default App
