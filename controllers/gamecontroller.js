import { Router } from 'express';
import { Game } from '../db.js';
import { constants } from '../common/constants.js';
import {
  OK,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CREATED,
} from 'http-status-codes';

const {
  DATA_FETCHED,
  DATA_NOT_FOUND,
  GAME_CREATED,
  SUCCESSFULY_UPDATED,
  SUCCESSFULY_DELETED,
} = constants;

const gameController = Router();

gameController.get('/all', async (req, res) => {
  try {
    const { id } = req.user;
    const games = await Game.findAll({
      where: {
        owner_id: id
      }
    });
  
    return res.status(OK).json({
      games,
      message: DATA_FETCHED,
    })
  } catch (error) {
    return res.status(500).json({
      message: DATA_NOT_FOUND,
    });
  }
})

gameController.get('/:id', async (req, res) => {
  try {
    const { params, user } = req;
    const game = await Game.findOne({
      where: {
        id: params.id,
        owner_id: user.id
      }
    });

    return res.status(OK).json({ game });
  } catch (error) {
    return res.status(NOT_FOUND).json({
      message: DATA_NOT_FOUND,
    });
  }
})

gameController.post('/create', async (req, res) => {
  try {
    const {
      title,
      studio,
      esrb_rating,
      user_rating,
      have_played
    } = req.body.game;
    const game = await Game.create({
      title: title,
      owner_id: req.user.id,
      studio: studio,
      esrb_rating: esrb_rating,
      user_rating: user_rating,
      have_played: have_played
    });

    return res.status(CREATED).json({
      game,
      message: GAME_CREATED
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).send(error.message);
  }
})

gameController.put('/update/:id', async (req, res) => {
  try {
    const {
      title,
      studio,
      esrb_rating,
      user_rating,
      have_played
    } = req.body.game;
    const { params, user } = req;

    const where = {
      id: params.id,
      owner_id: user.id
    };

    await Game.update({
      title: title,
      studio: studio,
      esrb_rating: esrb_rating,
      user_rating: user_rating,
      have_played: have_played
    }, { where });

    const game = await Game.findOne({ where }); 

    return res.status(OK).json({
      game,
      message: SUCCESSFULY_UPDATED
    })
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: error.message
    });
  }
})

gameController.delete('/remove/:id', async (req, res) => {
  try {
    const game = await Game.destroy({
      where: {
        id: req.params.id,
        owner_id: req.user.id
      }
    });

    return res.status(OK).json({
      game,
      message: SUCCESSFULY_DELETED,
    })
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      error: error.message
    });
  }
})

export default gameController;