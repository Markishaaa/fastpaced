import { useState } from 'react';
import styled from 'styled-components';
import DodgeGame from './games/DodgeGame';
import './styles/displayGame.scss';

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 480;

const DisplayGame = () => {
    const [showButton, setButton] = useState(true);

    const startGame = () => {
        setButton(false);
    }

    const getGame = () => {
        return (
            <DodgeGame SCREEN_WIDTH={ SCREEN_WIDTH } SCREEN_HEIGHT={ SCREEN_HEIGHT } />
        );
    }

    const genBoxStyle = () => {
        return showButton ? "center-items" : "";
    }

    return ( 
        <>
            <Box className={ genBoxStyle() } width={ SCREEN_WIDTH } height={ SCREEN_HEIGHT }>
                { showButton && <button onClick={ startGame }>Start</button> }
                { !showButton && getGame() }
            </Box>
        </>
     );
}
 
export default DisplayGame;

const Box = styled.div.attrs(props => ({
    style: {
        width: props.width + "px",
        height: props.height + "px"
    }
}))`
    border: 0.5rem solid #ffff;

    overflow: hidden;
    position: relative;
`;