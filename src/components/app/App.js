import AppHeader from "../appHeader/AppHeader";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
// import {MainPage, ComicsPage, SingleComicPage} from "../pages";
import {lazy, Suspense} from "react";

const Page404 = lazy(() => import("../pages/404.js"));
const MainPage = lazy(() => import("../pages/MainPage.js"));
const ComicsPage = lazy(() => import("../pages/ComicsPage.js"));
const SingleComicPage = lazy(() => import("../pages/singleComicLayout/SingleComicPage.js"));
const SingleCharacterPage = lazy(() => import("../pages/singleCharacterLayout/SingleCharacterPage.js"));
const SinglePage = lazy(() => import('../pages/SinglePage'));

const App = () => {

    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            <Route path="/" element={<MainPage/>}/>
                            <Route path='/comics' element={<ComicsPage/>}/>
                            <Route path='/comics/:id' element={<SinglePage Component={SingleComicPage} dataType='comic'/>}/>
                            <Route path='/characters/:id' element={<SinglePage Component={SingleCharacterPage} dataType='character'/>}/>
                            <Route path='*' element={<Page404/>}/>
                        </Routes>
                    </Suspense>
                </main>
            </div>
        </Router>
    )
}

export default App;