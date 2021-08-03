import Ride from '../model/Ride'
import rideValidation from '../../validation/rideValidation'
// import User from '../model/User'
import { v4 } from 'uuid'
import { format, isBefore, isAfter } from 'date-fns'

class RideController {
  async index(req, res) {
    // Return all rides found in database
    try {
      const rides = await Ride.findAll()
      if (rides) res.status(200).json(rides)
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async show(req, res) {
    // ride ID spended in URL
    const { id } = req.params

    // Search for the ride ID in database,
    // case ride not be found or not be able to connect with database, return a error
    try {
      const ride = await Ride.findByPk(id)
      if (ride) res.status(200).json(ride)
    } catch (err) {
      return res.status(500).json({ error: 'Ride not found' })
    }
  }

  async store(req, res) {
    const ride = req.body

    // Convert strings to date format
    ride.start_date = await format(ride.start_date)
    ride.registration_start_date = await format(ride.registration_start_date)
    ride.registration_end_date = await format(ride.registration_end_date)

    // Validade the recived data, and return all found errors
    try {
      await rideValidation.validateSync(ride, { abortEarly: false })
    } catch (err) {
      return res.status(400).json({ error: err.errors })
    }

    // Check if registration dates are correctly seted
    if (
      isBefore(ride.start_date, ride.registration_end_date) ||
      isAfter(ride.registration_start_date, ride.registration_end_date)
    ) {
      return res.status(400).json({ error: 'Check your date' })
    }

    // Create ride with user authenticated as author
    try {
      await Ride.create({
        id: v4(),
        name: ride.name,
        author: req.userId,
        start_date: ride.start_date,
        registration_start_date: ride.registration_start_date,
        registration_end_date: ride.registration_end_date,
        additional_information: ride.additional_information,
        start_place: ride.start_place,
        participants_limit: ride.participants_limit,
      })
    } catch (err) {
      return res.status(500).json({ error: 'Ride creation failed' })
    }
    // Success
    return res.status(201).json({ success: 'Ride created successfully!' })
  }

  async delete(req, res) {
    // Ride ID
    const { id } = req.params

    // At first check if ride exists, when find a ride delete them,
    // and case doesn't find ride or don't be able to connect with database, return a error.
    try {
      const ride = await Ride.findByPk(id)
      if (!ride) res.status(400).json({ error: 'Ride not found' })
      Ride.destroy({ where: { id } })
    } catch (err) {
      return res
        .status(500)
        .json({ error: 'Internal server error', error_details: err })
    }
    // Success
    return res.status(204).json()
  }
}

export default new RideController()
