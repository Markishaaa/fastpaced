import { useEffect, useRef, useState } from 'react';
import styled from "styled-components";

const WHEEL_SIZE = 300;
const TARGET_SIZE = WHEEL_SIZE / 2;

const ARROW_SIZE = 30;

const SPEED = 13;

const StopTheWheelGame = ({ SCREEN_HEIGHT }) => {
    const [angle, setAngle] = useState(0);
    const [stopGame, setStopGame] = useState(false);
    const [score, setScore] = useState(0);

    const handleTargetRotation = () => {
        let id;
        if (angle <= 360 && !stopGame) {
            id = setInterval(() => { setAngle((angle) => angle + SPEED) }, 24);
        } else if (angle >= 360) {
            setAngle(0);
        }

        return () => {
            clearInterval(id);
        };
    }
    
    const handleSpaceKeyPress = (e) => {
        if (e.key !== " " || stopGame) return;

        if (angle > 90 && angle < 180) {
            if (score === 2)
                setStopGame(true);

            setScore(score + 1);
        } else {
            setStopGame(true);
        }
    }

    useEffect(handleTargetRotation, [angle, stopGame]);

     // focuses player
     const playerRef = useRef(null);
     useEffect(() => {
        playerRef.current.focus();
    }, []);

    return ( 
        <>
            <Wheel top={SCREEN_HEIGHT/2 - WHEEL_SIZE/2} size={WHEEL_SIZE}>
                <Target size={TARGET_SIZE} angle={angle} />
            </Wheel>
            <Arrow ref={playerRef} onKeyDown={handleSpaceKeyPress} tabIndex={-1} 
                top={SCREEN_HEIGHT/2 - ARROW_SIZE/2} size={ARROW_SIZE} />
        </>
    );
}
 
export default StopTheWheelGame;

const Wheel = styled.div`
    aspect-ratio: 1;
    width: ${(props) => props.size}px;
    background-color: green;
    border-radius: 50%;
    margin-top: ${(props) => props.top}px;
    margin-left: 80px;
`;

const Target = styled.div.attrs(props => ({
    style: {
        transform: "rotate(" + props.angle + "deg)"
    }
}))`
    aspect-ratio: 1;
    width: ${(props) => props.size}px;
    background-color: red;
    border-radius: 100% 0 0 0;
    transform-origin: bottom right;
`;

const Arrow = styled.div`
    width: 300px;
    height: ${(props) => props.size}px;
    background-color: red;
    position: absolute;
    right: -15px;
    top: ${(props) => props.top}px;
    outline: none;
`;