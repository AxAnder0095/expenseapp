import './HomeStyles.sass'
import {signOut} from "firebase/auth";
import {auth} from "./config/firebase-config.js";
import {setCurrentUser} from "./store/currentUserSlice.js";
import {useDispatch} from "react-redux";

export const Home = () => {
    const dispatch = useDispatch();

    const logOut = async () => {
        try {
            await signOut(auth)
            dispatch(setCurrentUser(null))
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div className={'home-container'}>
            <div>
                home page
                <button onClick={logOut}>log out</button>
            </div>
        </div>
    )
}