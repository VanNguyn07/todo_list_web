import React from "react";
import Lottie from "lottie-react";
import FireStreak from "./FireStreak";
import IconFireLottie from "../../animations/Fire.json";
import "./StreakWidget.css";

const StreakWidget = ({title, streakCount}) => {
    const styleIconFire ={
        height: 40,
        width: 40,
    };

    return(
        <div className="streak-container">
            <div className="streak-top">
                <Lottie
                    animationData={IconFireLottie}
                    loop={true}
                    autoplay={true}
                    style={styleIconFire}
                />
                <h3>{title}</h3>
            </div>
            
            <div className="streak-content">
                <FireStreak/>
            </div>

            <div className="streak-bottom">
                <h2>{streakCount}</h2>
                <h3>day streak!</h3>
            </div>
        </div>
    );
}

export default StreakWidget