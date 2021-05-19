import { Router } from 'express';
import { Game } from '../db.js';

const gameController = Router();

gameController.get('/all', async (req, res) => {
  try {
    const games = await Game.findAll({
      where: {
        owner_id: req.user.id
      }
    })
  
    return res.status(200).json({
      games,
      message: "Data fetched."
    })
  } catch (error) {
    return res.status(500).json({
      message: "Data not found"
    });
  }
})

gameController.get('/:id', (req, res) => {
  Game.findOne({
      where: {
        id: req.params.id,
        owner_id: req.user.id
      }
    })
    .then(
      function findSuccess(game) {
        res.status(200).json({
          game: game
        })
      },

      function findFail(err) {
        res.status(500).json({
          message: "Data not found."
        })
      }
    )
})

gameController.post('/create', (req, res) => {
  Game.create({
      title: req.body.game.title,
      owner_id: req.user.id,
      studio: req.body.game.studio,
      esrb_rating: req.body.game.esrb_rating,
      user_rating: req.body.game.user_rating,
      have_played: req.body.game.have_played
    })
    .then(
      function createSuccess(game) {
        res.status(200).json({
          game: game,
          message: "Game created."
        })
      },

      function createFail(err) {
        res.status(500).send(err.message)
      }
    )
})

gameController.put('/update/:id', (req, res) => {
  // Сделать норм возвращение
  Game.update({
      title: req.body.game.title,
      studio: req.body.game.studio,
      esrb_rating: req.body.game.esrb_rating,
      user_rating: req.body.game.user_rating,
      have_played: req.body.game.have_played
    }, {
      where: {
        id: req.params.id,
        owner_id: req.user.id
      }
    })
    .then(
      function updateSuccess(game) {
        console.log(game);
        res.status(200).json({
          game: game,
          message: "Successfully updated."
        })
      },

      function updateFail(err) {
        res.status(500).json({
          message: err.message
        })
      }

    )
})

gameController.delete('/remove/:id', (req, res) => {
  Game.destroy({
      where: {
        id: req.params.id,
        owner_id: req.user.id
      }
    })
    .then(
      function deleteSuccess(game) {
        res.status(200).json({
          game: game,
          message: "Successfully deleted"
        })
      },

      function deleteFail(err) {
        res.status(500).json({
          error: err.message
        })
      }
    )
})

export default gameController;