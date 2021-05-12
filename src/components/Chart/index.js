import React, { useState, useEffect, useRef } from 'react';

import './Chart.scss';

function Chart() {
  let intervalId = 0;
  const chart = 180;
  const [battleData, setBattleData] = useState({
    blueScore: 0,
    redScore: 1800,
  });
  const [final, setFinal] = useState(-45);

  function calcFinal(battleData) {
    const totalScore = battleData.blueScore + battleData.redScore;

    if (battleData.blueScore > battleData.redScore) {
      const decVal = battleData.blueScore - battleData.redScore;
      const divideVal = totalScore / decVal;
      return (chart / divideVal) * -1 - 45;
    } else if (battleData.redScore > battleData.blueScore) {
      const decVal = battleData.redScore - battleData.blueScore;
      const divideVal = totalScore / decVal;
      return chart / divideVal - 45;
    } else {
      return -45;
    }
  }

  function lubricateVal(value, inc) {
    let ctr = -45;
    intervalId = setInterval(() => {
      if (value < 0) {
        ctr = ctr + inc * -1;
        if (ctr < value) {
          return clearInterval(intervalId);
        }
        setFinal(ctr);
      } else {
        ctr = ctr + inc;
        if (ctr > value) {
          return clearInterval(intervalId);
        }
        setFinal(ctr);
      }
    }, 30);
  }

  useEffect(() => {
    const finalVal = calcFinal(battleData);
    console.log(finalVal);
    lubricateVal(finalVal, 5);
    return () => {};
  }, []);

  return (
    <>
      <div className="chart-area">
        <div
          className="battle-arrow"
          style={{ transform: `rotate(${final}deg)` }}
        >
          <img src="/assets/img/battle-arrow.svg" />
        </div>
      </div>

      <button onClick={() => {}}>Blue Team</button>
      <button onClick={() => {}}>Red Team</button>
    </>
  );
}

export default Chart;
