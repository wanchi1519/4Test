// Importing the FBPlayer model
import FBPlayer from '../models/FBPlayer.js';

// Example of using the model in a controller function
export const home = async (req, res) => {
  try {
    const players = await FBPlayer.find();
    res.render('index', { players });
  } catch (error) {
    // Error handling
  }
};

export const offense = async (req, res) => {
  try {
    const players = await FBPlayer.find({
      $or: [
        { receptions: { $gt: 0 } },
        { recYds: { $gt: 0 } },
        { rushes: { $gt: 0 } },
        { rushYds: { $gt: 0 } },
        { passAttempts: { $gt: 0 } },
        { passCompletions: { $gt: 0 } },
        { passYds: { $gt: 0 } },
        { rushTDs: { $gt: 0 } },
        { recTDs: { $gt: 0 } },
        { passTDs: { $gt: 0 } },
        { intsThrown: { $gt: 0 } }
      ]
    });

    res.render('offense', { players });
  } catch (error) {
    // Error handling
  }
};

export const defense = async (req, res) => {
  try {
    const players = await FBPlayer.find({
      $or: [
        { intsMade: { $gt: 0 } },
        { sacks: { $gt: 0 } },
        { tackles: { $gt: 0 } },
        { passDefenses: { $gt: 0 } },
        { defTDs: { $gt: 0 } }
      ]
    });

    res.render('defense', { players });
  } catch (error) {
    // Error handling
  }
};

export const loadGameLog = async (req, res) => {
  const players = await FBPlayer.find();
  res.render('gameLog', { players });
}

export const submitPlay = async (req, res) => {
  console.log(req.body);
  let player, summary = "", playerName, rushes = 0, rushYds = 0, rushTDs = 0;
  
  if (req.body.playType === 'offense') {
    if (req.body.offensePlay === 'run') {
      playerName = req.body.runner; // Assuming 'runner' is the field for the runner's name
      rushYds = parseInt(req.body.runYards, 10);
      rushes = 1;
      rushTDs = req.body.touchdown === 'on' ? 1 : 0;
      
      summary += `Run by ${playerName} for ${rushYds} yards`;
      req.body.touchdown === 'on' ? summary += ' resulting in a touchdown.' : summary += '.';
    }
  }

  try {
    // Find the player by name
    player = await FBPlayer.findOne({ playerName });

    if (player) {
      // Update player stats
      player.rushes = (player.rushes || 0) + rushes;
      player.rushYds = (player.rushYds || 0) + rushYds;
      player.rushTDs = (player.rushTDs || 0) + rushTDs;

      // Save the updated player
      await player.save();
    }
  } catch (error) {
    console.error('Error updating player stats:', error);
    // Handle error (e.g., send a response indicating failure)
  }

  // Add flash message
  req.flash('info', summary);
  
  // Redirect to game log or appropriate route
  res.redirect('/game-log');
};
