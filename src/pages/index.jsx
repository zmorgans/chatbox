import Layout from "./Layout.jsx";

import Home from "./Home";

import Debate from "./Debate";

import Feedback from "./Feedback";

import Export from "./Export";

import History from "./History";

import DebateView from "./DebateView";

import Settings from "./Settings";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Debate: Debate,
    
    Feedback: Feedback,
    
    Export: Export,
    
    History: History,
    
    DebateView: DebateView,
    
    Settings: Settings,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Debate" element={<Debate />} />
                
                <Route path="/Feedback" element={<Feedback />} />
                
                <Route path="/Export" element={<Export />} />
                
                <Route path="/History" element={<History />} />
                
                <Route path="/DebateView" element={<DebateView />} />
                
                <Route path="/Settings" element={<Settings />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}