import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const GROUND_LEVEL = 50;

const SPEED = 15;
const JUMP_HEIGHT = 220 + SPEED;
const GRAVITY = 1.5;

const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 100;
const PLAYER_POS_X = 50;

const OBSTACLE_WIDTH = 140;
const OBSTACLE_HEIGHT = 65;

const DodgeGame = ({ SCREEN_WIDTH }) => {
    const [stopGame, setStopGame] = useState(false);
    const [rotateFactor, setRotateFactor] = useState(0);
    const [playerHit, setPlayerHit] = useState(false);

    const [obstaclePos, setObstaclePos] = useState(SCREEN_WIDTH + OBSTACLE_WIDTH);
    const [playerPos, setPlayerPos] = useState(GROUND_LEVEL);
    const playerRef = useRef(null);

    // handles obstacle movement and logic
    const handleObstacleMovement = () => {
        let id;
        if (obstaclePos > -OBSTACLE_WIDTH && !stopGame) {
            const hasCollidedWithPlayer = obstaclePos > PLAYER_POS_X - OBSTACLE_WIDTH && obstaclePos < PLAYER_POS_X + PLAYER_WIDTH;
            const playerIsNotHighEnough = playerPos >= 50 && playerPos < 50 + OBSTACLE_HEIGHT;

            if (playerIsNotHighEnough && hasCollidedWithPlayer) {
                setStopGame(true);
                setPlayerHit(true);
            }

            id = setInterval(() => { setObstaclePos((obstaclePos) => obstaclePos - SPEED) }, 24);
        }

        return () => {
            if (obstaclePos === -OBSTACLE_WIDTH && !stopGame) {
                setStopGame(true);
            }

            clearInterval(id);
        };
    }

    const [spacePressed, setSpacePressed] = useState(false);
    const [fall, setFall] = useState(false);
    
    const handleSpaceKeyPress = (e) => {
        const isInAir = playerPos > 50;

        if (isInAir || e.key !== " " || stopGame) return;

        if (!isInAir) {
            setSpacePressed(true);
        }
    }

    const handlePlayerJump = () => {
        if (spacePressed && !stopGame) {
            let id;
            if (playerPos < JUMP_HEIGHT) {
                id = setInterval(() => { setPlayerPos((playerPos) => playerPos + SPEED) }, 24);
            }

            return () => {
                if (playerPos >= JUMP_HEIGHT - SPEED) {
                    // start falling
                    setFall(true);  
                    setSpacePressed(false);
                }

                clearInterval(id);
            };
        }
    }

    const handlePlayerFall = () => {
        if (fall || stopGame) {
            let id;
            if (playerPos !== GROUND_LEVEL) {
                id = setInterval(() => { setPlayerPos((playerPos) => playerPos - SPEED * GRAVITY) }, 24);
            }

            return () => {
                if (playerPos <= GROUND_LEVEL) {
                    // stop falling
                    setFall(false); 
                    setPlayerPos(GROUND_LEVEL);
                }

                clearInterval(id);
            };
        }
    }

    const handlePlayerHit = () => {
        if (stopGame && playerHit) {
            setPlayerHit(false);

            const rand = Math.floor(Math.random() * 2);
            const factor = 90 * (rand === 1 ? 1 : -1);
            setRotateFactor(factor);
        }
    }

    // focuses player
    useEffect(() => {
        playerRef.current.focus();
    }, []);

    useEffect(handleObstacleMovement, [obstaclePos, playerPos, stopGame]);
    useEffect(handlePlayerJump, [fall, spacePressed, playerPos, stopGame]);
    useEffect(handlePlayerFall, [fall, playerPos, stopGame]);
    useEffect(handlePlayerHit, [rotateFactor, playerHit, stopGame]);

    return (
        <>
            <Player ref={playerRef} onKeyDown={handleSpaceKeyPress} tabIndex={-1} 
                posX={PLAYER_POS_X} posY={playerPos} width={PLAYER_WIDTH} height={PLAYER_HEIGHT} rotate={rotateFactor} />
            <Obstacle obstaclePos={obstaclePos} width={OBSTACLE_WIDTH} height={OBSTACLE_HEIGHT} />
        </>
    );
}

export default DodgeGame;

const Obstacle = styled.div.attrs(props => ({
    style: {
        left: props.obstaclePos + 'px'
    }
}))`
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
    background-color: red;

    position: absolute;
    bottom: 50px;
`;

const Player = styled.div.attrs(props => ({
    style: {
        bottom: props.posY + "px"
    }
}))`
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
    background-color: green;

    position: absolute;
    left: ${(props) => props.posX}px;

    outline: none;
    transform: rotate(${(props) => props.rotate}deg);
    transition: transform 200ms ease;
`;