import { v4 } from 'uuid'
import { isBefore, isAfter } from 'date-fns'
// Model
import Ride from '../model/Ride'
import Subscription from '../model/Subscription'
// validation shapes
import rideValidation from '../../validation/rideValidation'

class RideController {
  async store(req, res) {
    // Information passed
    const ride = req.body

    // Convert strings to date format
    ride.start_date = await new Date(`${ride.start_date} ${ride.start_hour}`)
    ride.registration_start_date = await new Date(ride.registration_start_date)
    ride.registration_end_date = await new Date(ride.registration_end_date)

    // Validade the recived data, and return all found errors
    try {
      await rideValidation.validateSync(ride, { abortEarly: false })
    } catch (err) {
      return res.status(400).json({ error: err.errors })
    }

    // Check if the deadline is correctly seted
    if (
      isBefore(ride.start_date, ride.registration_end_date) ||
      isAfter(ride.registration_start_date, ride.registration_end_date)
    ) {
      return res.status(400).json({ error: 'Check your date' })
    }

    // Create ride with authenticated user as author,
    // and if occur an error, return error
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
      return res.status(500).json({ error: 'Ride creation failed', err })
    }
    // Success
    return res.status(201).json({ success: 'Ride created successfully!' })
  }

  async index(req, res) {
    // Return all rides found in database
    // If don't find rides or don't be able to connect with database, return an error
    try {
      const rides = await Ride.findAll()
      if (rides) res.status(200).json(rides)
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async show(req, res) {
    // ride ID passed in URL
    const { id } = req.params

    // Search for the ride by ID,
    // If don't find the ride or don't be able to connect with database, return an error
    try {
      const ride = await Ride.findByPk(id)
      if (!ride) res.status(400).json({ error: 'Ride not found' })
      else res.status(200).json(ride)
    } catch (err) {
      return res.status(500).json({ error: 'Ride not found' })
    }
  }

  async delete(req, res) {
    // Ride ID passed in URL
    const { id } = req.params

    // At first check if ride exists, if true, delete it and update subscriptions where it are
    // and case don't find the ride or don't be able to connect with database, return a error.
    try {
      const ride = await Ride.findByPk(id)
      if (!ride) res.status(400).json({ error: 'Ride not found' })
      await Subscription.update({ ride_id: 0 }, { where: { ride_id: id } })
      await Ride.destroy({ where: { id } })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' })
    }
    // Success
    return res.status(204).json()
  }
}

export default new RideController()
