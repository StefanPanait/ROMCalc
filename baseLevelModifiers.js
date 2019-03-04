/*
 - (21+)   = 50%
 - (11-20) = 80%
 - (0-10)  = 100%

  (0-10)   = 100%
  (11-15)  = 80%
  (16-20)  = 60%
  (21-25)  = 40%
  (26-30)  = 20%
  (31+)    = 10%
*/
function getBaseLevelModifiers(baseLevel, monsterLevel) {
    let modifier;
    levelDiff = baseLevel - monsterLevel;
    switch (true) {
        case (levelDiff <= -21):
            modifier = .5;
            break;
        case (levelDiff < -11):
            modifier = .8;
            break;
        case (levelDiff <= 10):
            modifier = 1;
            break;
        case (levelDiff <= 15):
            modifier = .8;
            break;
        case (levelDiff <= 20):
            modifier = .6;
            break;
        case (levelDiff <= 25):
            modifier = .4;
            break;
        case (levelDiff <= 30):
            modifier = .2;
            break;
        case (levelDiff > 30):
            modifier = .1;
            break;
    }
    return modifier;
}

// getBaseLevelModifiers(65, 90);
// getBaseLevelModifiers(69, 90);
// getBaseLevelModifiers(70, 90);
// getBaseLevelModifiers(80, 90);
// getBaseLevelModifiers(90, 90);
// getBaseLevelModifiers(100, 90);
// getBaseLevelModifiers(101, 90);
// getBaseLevelModifiers(104, 90);
// getBaseLevelModifiers(105, 90);
// getBaseLevelModifiers(106, 90);
// getBaseLevelModifiers(109, 90);
// getBaseLevelModifiers(110, 90);
// getBaseLevelModifiers(111, 90);
// getBaseLevelModifiers(120, 90);
// getBaseLevelModifiers(121, 90);
// getBaseLevelModifiers(130, 90);