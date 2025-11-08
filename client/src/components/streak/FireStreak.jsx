import React from "react";
import Lottie from "lottie-react";

import fireAnimation from "../../animations/Fire.json";

    function FireStreak({children, className}){
        const lottieStyle ={
            height:150,
            width:150,
        };

        return(
            <div className={className}>
                <Lottie 
                    animationData={fireAnimation}
                    loop={true}
                    autoplay={true}
                    style={lottieStyle}
                />
                {children}
            </div>
        );
    }

export default FireStreak