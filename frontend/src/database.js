import Sequelize from "sequelize"
require("dotenv").config();

// Connect to CockroachDB through Sequelize.
    const connectionString = process.env.DATABASE_URL;
    const sequelize = new Sequelize(connectionString, {
      host: "localhost",
      dialect: "mysql",
    });
export const main = async () => {
  const Player = sequelize.define("Players", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    address: {
      type: Sequelize.STRING,
    },
    gamesPlayed: {
      type: Sequelize.INTEGER,
    },
    unclaimedTokens: {
      type: Sequelize.INTEGER,
    },
    gamesLost: {
      type: Sequelize.INTEGER,
    },
    currentWinStreak: {
      type: Sequelize.INTEGER,
    },
    maxWinStreak: {
      type: Sequelize.INTEGER,
    },
    gamesWon: {
      type: Sequelize.INTEGER,
    },
  });
     


  Player.sync({
    force: false,
  })
    .then(async () => {
      const user = await Player.findOne({
        where: { address: "0x30f9A9C1aA282508901b606DEA2D887D4dD07267" },
      });
      if (user === null) {
        return Player.create({
          id: (new Date().getTime() / 1000).toFixed(),
          address: "0x30f9A9C1aA282508901b606DEA2D887D4dD07267",
          gamesPlayed: 0,
          unclaimedTokens: 0,
          gamesLost: 0,
          currentWinStreak: 0,
          maxWinStreak: 0,
          gamesWon: 0,
        });

      }
    })
    .then(async () => {
      const players = await Player.findAll();
      console.log(players)
    })
    .catch(function (err) {
      console.error("error: " + err.message);
      process.exit(1);
    });

}

 export const checkTrials = async (trial) => {
   let win;
   if (trial === 1) {
     win = 20;
   } else if (trial === 2) {
     win = 20;
   } else if (trial === 3) {
     win = 20;
   } else if (trial === 4) {
     win = 12;
   } else if (trial === 5) {
     win = 12;
   } else if (trial === 6) {
     win = 7;
   } else if (trial === 7) {
     win = 7;
   } else if (trial === 8) {
     win = 7;
   }

   const Player = sequelize.define("Players", {
     id: {
       type: Sequelize.INTEGER,
       primaryKey: true,
     },
     address: {
       type: Sequelize.STRING,
     },
     gamesPlayed: {
       type: Sequelize.INTEGER,
     },
     unclaimedTokens: {
       type: Sequelize.INTEGER,
     },
     gamesLost: {
       type: Sequelize.INTEGER,
     },
     currentWinStreak: {
       type: Sequelize.INTEGER,
     },
     maxWinStreak: {
       type: Sequelize.INTEGER,
     },
     gamesWon: {
       type: Sequelize.INTEGER,
     },
   });

   Player.sync({
     force: false,
   })
     .then(async () => {
       const user = await Player.findOne({
         where: { address: "0x30f9A9C1aA282508901b606DEA2D887D4dD072e8" },
       });
       return user.update({
         gamesPlayed: user.gamesPlayed + 1,
         unclaimedTokens: user.unclaimedTokens + win,
         gamesLost: trial === 8 ? user.gamesLost + 1 : user.gamesLost,
         currentWinStreak: trial < 8 ? user.currentWinStreak + 1 : 0,
         maxWinStreak:
           user.currentWinStreak >= user.maxWinStreak
             ? user.currentWinStreak
             : user.maxWinStreak,
         gamesWon: trial < 8 ? user.gamesWon + 1 : user.gamesWon,
       });
     })
     .then(async () => {
       const user = await Player.findOne({
         where: { address: "0x30f9A9C1aA282508901b606DEA2D887D4dD072e8" },
       });
       return user
     })
     .catch(function (err) {
       console.error("error: " + err.message);
       process.exit(1);
     });
 };
 //Alerts user to switch to a supported network when account is switched from a supported network
