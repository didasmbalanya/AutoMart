/* eslint-disable radix */
/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import Joi from '@hapi/joi';
import {
  carSchema, addNewCar, getBy, getCarId, markSold, getCarsMinMax, updatePriceId, getAllCars, DeleteCarId,
} from '../models/car';

export const postCar = (req, res) => {
  Joi.validate(req.body, carSchema).then(async () => {
    req.body.manufacturer = req.body.manufacturer.trim();
    req.body.model = req.body.model.trim();
    req.body.body_type = req.body.body_type.trim();
    req.body.status = req.body.status.trim();
    req.body.state = req.body.state.trim();
    const car = req.body;
    car.owner = req.user.id;
    const newCar = await addNewCar([car.owner, car.state, car.status, car.price, car.manufacturer, car.model, car.body_type]);
    await res.status(201).send({ status: 201, data: newCar.rows[0] });
  }).catch((e) => {
    if (e) {
      res.status(400).send({ status: 400, error: e });
    } else {
      res.status(400).send({ status: 400, error: 'Bad request' });
    }
  });
};

export const changeProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, price } = req.query;
    if ((parseInt(id) === 'NaN')) return res.status(400).send({ status: 400, error: 'Bad request id' });
    const foundCar = await getCarId(id);
    if (!foundCar) {
      return res.status(404).send({ status: 404, error: 'Car not found' });
    }
    if (foundCar.owner.toString() !== req.user.id) return res.status(403).send({ status: 403, error: 'not allowed' });
    if (foundCar.status === 'available' && !price && status === 'sold') {
      const data = await markSold(id);
      res.status(200).send({ status: 200, data: data.rows[0] });
    } else if (price && parseInt(price) !== 'NaN' && !status) {
      const dataNewPrice = await updatePriceId(id, price);
      res.status(200).send({ data: dataNewPrice.rows[0] });
    } else {
      return res.status(400).send({ status: 400, error: 'Bad request' });
    }
  } catch (e) {
    res.status(400).send({ error: 'Bad request' });
  }
};

export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const foundCar = await getCarId(id);
    if (!foundCar || foundCar.status === 'sold') return res.status(404).send({ status: 404, error: 'Not Found' });
    return res.status(200).send({ status: 200, data: foundCar });
  } catch (e) {
    res.status(400).send({ status: 400, error: 'Bad Request' });
  }
};

export const deleteCar = async (req, res) => {
  const { id } = req.params;
  try {
    const foundCar = await getCarId(id);
    if (!foundCar) return res.status(404).send({ status: 404, error: 'Car add not found' });
    if (foundCar.owner.toString() === req.user.id.toString() || req.user.is_admin === true) {
      const result = await DeleteCarId(id);
      res.status(200).send({ status: 200, message: 'Car Ad successfully deleted', data: result.rows[0] });
    } else res.status(403).send({ status: 403, error: 'not authorized to delete car' });
  } catch (e) { res.status(400).send({ status: 400, error: 'Bad Request' }); }
};

export const getCars = async (req, res) => {
  const { status, max_price, min_price } = req.query;
  try {
    if (status !== 'available' || (parseInt(max_price) === 'NaN') || (parseInt(min_price) === 'NaN')) throw Error();
    if (status === 'available' && max_price && min_price) {
      const maxMinCars = await getCarsMinMax(min_price, max_price);
      return res.status(200).send({ data: maxMinCars });
    } if (status && status.toLowerCase() === 'available') {
      let avaCars = await getBy('cars', 'status', 'available');
      if (!avaCars) avaCars = [];
      res.status(200).send({ status: 200, data: avaCars });
    }
  } catch (e) {
    res.send({ status: 400, error: 'Bad request' });
  }
};

export const getAdmincars = async (req, res) => {
  try {
    const allCars = await getAllCars();
    if (req.user.is_admin === true) return res.status(200).send({ status: 200, data: allCars.rows });
    return res.status(404).send({ status: 401, error: 'Method not allowed' });
  } catch (e) {
    res.status(400).send({ status: 400, error: 'Invalid request' });
  }
};
