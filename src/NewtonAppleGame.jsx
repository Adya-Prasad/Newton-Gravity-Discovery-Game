import React, { useRef, useState, useMemo } from 'react';
import bgImg           from './newton-media/background-scene.png';
import appleTreeImg    from './newton-media/apple-tree.png';
import newtonImg       from './newton-media/newton-with-book.png';
import appleImg        from './newton-media/apple2.png';
import rockImg         from './newton-media/rock.png';
import discovery1 from './newton-media/newton-discoveries/first-law-of-motion.png';
import discovery2 from './newton-media/newton-discoveries/second-law-of-motion.png';
import discovery3 from './newton-media/newton-discoveries/third-law-of-motion.png';
import discovery4 from './newton-media/newton-discoveries/gravitational-constant.png';

// Container sizing (responsive + fixed aspect ratio)
const CONTAINER_WIDTH  = '80%';
const GAME_RATIO       = 3 / 2;     // width : height = 3 : 2

// Newton’s fixed spot & falling target (head position)
const NEWTON_POS       = { left: 40, top: 75 };  // Newton image anchor
const NEWTON_HEAD_TOP  = NEWTON_POS.top - 3;     // target for falling items

// Rock configuration
const ROCK_POSITION    = { left: 43, top: 52 };
const ROCK_ROTATION    = 17;       // degrees
const ROCK_SIZE        = '5%';     // decreased from 8%

// Apples count, size & speed\ nconst APPLE_COUNT      = 6;
const APPLE_SIZE       = '3%';
const APPLE_COUNT      = 8;
const FALL_DURATION    = 0.7;      // seconds

// Audio file paths (ensure these exist in public or src/newton-media)
const ROCK_HIT_AUDIO   = process.env.PUBLIC_URL + '/rock-hit.mp3';
const APPLE_HIT_AUDIO  = process.env.PUBLIC_URL + '/apple-hit.mp3';

export default function NewtonAppleGame() {
  const [falling, setFalling] = useState({});
  const [fallen,  setFallen]  = useState({});
  const [gameState, setGameState] = useState('playing'); // 'playing', 'fail', 'pass'
  const [showDiscoveries, setShowDiscoveries] = useState(false);

  // Generate random positions, but fix first apple as specified
  const APPLE_POSITIONS = useMemo(() => {
    const positions = Array.from({ length: APPLE_COUNT }).map(() => ({
      left: 30 + Math.random() * 40,
      top:  18 + Math.random() * 30,
    }));
    // override first apple per request
    positions[0] = { left: 43, top: 40 };
    return positions;
  }, []);

  function handleFall(key) {
    if (gameState !== 'playing') return; // Prevent further clicks after game ends
    setFalling(f => ({ ...f, [key]: true }));
    setTimeout(() => {
      setFallen(f => ({ ...f, [key]: true }));
      // Rock logic
      if (key === 'rock') {
        new window.Audio(ROCK_HIT_AUDIO).play();
        setGameState('fail');
      }
      // First apple logic
      if (key === 'apple-0') {
        new window.Audio(APPLE_HIT_AUDIO).play();
        setGameState('pass');
        setShowDiscoveries(true);
      }
    }, (FALL_DURATION + 0.1) * 1000);
  }

  return (
    <div style={{ textAlign: 'center', margin: '2rem 0' }}>
      {/* Comic‑style heading */}
      <h1 style={{
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        fontSize: '1.5rem',
        color: '#d35400',
        textShadow: '1px 2px #f39c12',
        marginBottom: '1rem',
      }}>
        Recreating Newton's Apple Incident 🍎
      </h1>
      <em>Once upon a time, You have the control!</em>
      <p><b> Touch what you want to fall on Newton, and ready for consequences</b></p>

      {/* Game container */}
      <div
        ref={useRef()}
        style={{
          width:           CONTAINER_WIDTH,
          aspectRatio:     GAME_RATIO,
          position:        'relative',
          margin:          '0 auto',
          backgroundImage: `url(${bgImg})`,
          backgroundSize:  'cover',
          backgroundPosition: 'center',
          borderRadius:    '1rem',
          boxShadow:       '0 8px 32px rgba(0,0,0,0.2)',
          overflow:        'hidden',
          backgroundClip:  'padding-box',
        }}
      >
        {/* Ground overlay */}
        <div style={{
          position: 'absolute',
          bottom:   0,
          left:     0,
          right:    0,
          height:   '35%',
          background: 'rgba(0,0,0,0.05)'
        }} />

        {/* Tree */}
        <img
          src={appleTreeImg}
          alt="apple tree"
          style={{
            position:     'absolute',
            left:         '10%',
            top:          '5%',
            width:        '80%',
            height:       '90%',
            objectFit:    'contain',
            pointerEvents:'none'
          }}
          draggable={false}
        />

        {/* Apples */}
        {APPLE_POSITIONS.map((pos, idx) =>
          !fallen[`apple-${idx}`] && (
            <img
              key={`apple-${idx}`}
              src={appleImg}
              alt="apple"
              onClick={() => handleFall(`apple-${idx}`)}
              style={{
                position:   'absolute',
                left:       `${pos.left}%`,
                top:        falling[`apple-${idx}`]
                              ? `${NEWTON_HEAD_TOP}%`
                              : `${pos.top}%`,
                width:      APPLE_SIZE,
                transition: `top ${FALL_DURATION}s ease-in`,
                cursor:     'pointer',
                zIndex:     100,                    // lower than Newton
              }}
              draggable={false}
            />
          )
        )}

        {/* Rock */}
        {!fallen.rock && (
          <img
            src={rockImg}
            alt="rock"
            onClick={() => handleFall('rock')}
            style={{
              position:   'absolute',
              left:       `${ROCK_POSITION.left}%`,
              top:        falling.rock
                            ? `${NEWTON_HEAD_TOP}%`
                            : `${ROCK_POSITION.top}%`,
              width:      ROCK_SIZE,
              transition: `top ${FALL_DURATION}s ease-in`,
              cursor:     'pointer',
              transform:  `translate(-50%, -50%) rotate(${ROCK_ROTATION}deg)`,
              zIndex:     100,                    // lower than Newton
            }}
            draggable={false}
          />
        )}

        {/* Newton */}
        <img
          src={newtonImg}
          alt="Newton reading"
          style={{
            position:       'absolute',
            left:           `${NEWTON_POS.left}%`,
            top:            `${NEWTON_POS.top}%`,
            width:          '22%',
            transform:      'translate(-50%, 0)',
            pointerEvents:  'none',
            zIndex:         4,                    // top layer
          }}
          draggable={false}
        />
        {/* Discoveries Animation */}
        {showDiscoveries && (
          <div style={{
            position: 'absolute',
            left: '40%', // manually set left
            top: '69%',  // manually set top
            width: 0,
            height: 0,
            zIndex: 300,
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)', // Center at Newton's head
          }}>
            {Array.from({ length: 3 }).map((_, repeatIdx) =>
              [discovery1, discovery2, discovery3, discovery4].map((img, i) => (
                <img
                  key={repeatIdx + '-' + i}
                  src={img}
                  alt={`discovery-${i}`}
                  style={{
                    position: 'absolute',
                    left: '0%',
                    top: '0%',
                    width: '120px',
                    height: '120px',
                    opacity: 0,
                    animation: `discovery-float-${i} 0.7s cubic-bezier(.4,1.6,.6,1) forwards`,
                    animationDelay: `${0.18 * (repeatIdx * 4 + i)}s`,
                  }}
                />
              ))
            )}
            <style>{`
              @keyframes discovery-float-0 {
                0% { opacity: 0; transform: scale(0.01) translate(0,0); }
                10% { opacity: 1; }
                100% { opacity: 1; transform: scale(2.1) translate(-420px, -320px) rotate(-18deg); }
              }
              @keyframes discovery-float-1 {
                0% { opacity: 0; transform: scale(0.01) translate(0,0); }
                10% { opacity: 1; }
                100% { opacity: 1; transform: scale(2.1) translate(420px, -320px) rotate(18deg); }
              }
              @keyframes discovery-float-2 {
                0% { opacity: 0; transform: scale(0.01) translate(0,0); }
                10% { opacity: 1; }
                100% { opacity: 1; transform: scale(2.1) translate(-260px, -520px) rotate(-12deg); }
              }
              @keyframes discovery-float-3 {
                0% { opacity: 0; transform: scale(0.01) translate(0,0); }
                10% { opacity: 1; }
                100% { opacity: 1; transform: scale(2.1) translate(260px, -520px) rotate(12deg); }
              }
            `}</style>
          </div>
        )}
      </div>
      {/* Game ending message */}
      {gameState === 'fail' && (
        <div style={{ color: 'red', fontWeight: 'bold', fontSize: '2rem', marginTop: '1rem' }}>Oh No!</div>
      )}
      {gameState === 'pass' && (
        <div style={{ color: 'green', fontWeight: 'bold', fontSize: '2rem', marginTop: '1rem' }}>Gravity Discovered!</div>
      )}
      {(gameState === 'fail' || gameState === 'pass') && (
        <button
          style={{
            marginTop: '1.5rem',
            padding: '0.7rem 2.2rem',
            fontSize: '1.1rem',
            borderRadius: '0.5rem',
            borderRight: '4px solid #351100',
            borderBottom: '4px solid #351100',
            background: '#f39c12',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.13), 0 2px 0 #b0b0b0',
            transition: 'transform 0.1s',
            outline: 'none',
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'translateY(2px)'}
          onMouseUp={e => e.currentTarget.style.transform = 'translateY(0)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          onClick={() => window.location.reload()}
        >
          Play Again
        </button>
      )}
    </div>
  );
}
