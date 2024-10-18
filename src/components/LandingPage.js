import React from 'react';
import Hero from './Home/Hero';
import Stats from './Home/Stats';
import Why from './Home/Why';
import Calculate from './Home/Calculate';
import Trade from './Home/Trade';
import Features from './Home/Features';


const LandingPage = () => {
    return (
        <div>
            <Hero />
            <Stats />
            <Why />
            <Calculate />
            <Trade />
            <Features />
        </div>
    );
};

export default LandingPage;
