import Subscription from '../model/Subscription'
import Ride from '../model/Ride'
import User from '../model/User'
import { isAfter, isBefore } from 'date-fns'

class SubscriptionController {
  async index(req, res) {
    const { pedal_id } = req.params

    // Verify if ride exists
    try {
      await Ride.findByPk(pedal_id)
    } catch (err) {
      return res.status(400).json({ error: 'Ride not exists' })
    }

    // Search for subscriptions of the ride id spended,
    // if not find subscriptions, or occur an error to connect with database,
    // return error messages
    try {
      const subs = await Subscription.findAll({ where: { ride_id: pedal_id } })
      if (subs) res.status(200).json(subs)
    } catch (err) {
      return res.status(400).json({ error: 'No subscriptions found' })
    }
  }

  async show(req, res) {
    // Store the id spended in URL in a constant
    const { id, pedal_id } = req.params

    // Verify if ride exists
    try {
      await Ride.findByPk(pedal_id)
    } catch (err) {
      return res.status(400).json({ error: 'Ride not exists' })
    }

    // Search for the user in database by user id, case exists return it,
    // case not find user id in database or database connection errors,
    // return an error message and the error returned by the system in error_details
    try {
      const pedals = await Subscription.findAll({
        where: { ride_id: pedal_id },
      })

      const ride = pedals.find(id)

      if (ride) res.status(200).json(ride)
    } catch (err) {
      return res.status(500).json({ error: 'Subscription not found' })
    }
  }

  async delete(req, res) {
    // Store the spended ids in URL in constants
    const { id, pedal_id } = req.params

    // Search for the ride on database, and looking for the subscription ID on this result,
    // when find the subscription, delete it.
    // If doesn't find the subscription, return a error
    try {
      const sub = await Subscription.findAll({ where: { ride_id: pedal_id } })

      const subscription = sub.find(id)
      if (!subscription) {
        res.status(400).json({ error: 'Subscription not found' })
      }

      // Delete subscription, and in case of ocour any error, return then
      Subscription.destroy({ where: { id } })
    } catch (err) {
      return res
        .status(500)
        .json({ error: 'Internal server error', error_details: err })
    }
    return res.status(204).json()
  }

  async store(req, res) {
    const { pedal_id } = req.params

    // Check if user ID was spended on request by the middleware
    if (!req.userId) res.status(400).json({ error: 'User not provided' })

    // Check if Ride and User exists
    const participant = await User.findByPk(req.userId)
    if (!participant) {
      return res.status(400).json({ error: 'User not found' })
    }

    const ride = await Ride.findByPk(pedal_id)
    if (!ride) res.status(400).json({ error: 'Ride not found' })

    // Check if user already registered in this ride
    if (
      (await Subscription.findOne({ participant_id: req.userId })) &&
      (await Subscription.findOne({ ride_id: pedal_id }))
    ) {
      return res
        .status(400)
        .json({ error: 'You already registered on this ride' })
    }

    // Check if the registrations haven't exhausted the quota
    const subs_length = await Subscription.findAll({
      where: { ride_id: pedal_id },
    })
    if (ride.participants_limit === subs_length.length) {
      return res.status(403).json({ error: 'Participants limit reached!' })
    }

    // Set subscription date
    const today = new Date()

    // eslint-disable-next-line prettier/prettier
      if(isBefore(today, ride.registration_end_date) && isAfter(today, ride.registration_start_date)){
      return res
        .status(403)
        .json({ error: 'Registration not avaible on this date' })
    }

    // Create ride subscription and add more one participation to user
    try {
      await Subscription.create({
        ride_id: pedal_id,
        subscription_date: today,
        participant_id: req.userId,
      })

      participant.ride_participations += 1
      await User.update(
        { ride_participations: participant.ride_participations },
        { where: { id: req.userId } }
      )
    } catch (err) {
      res.status(500).json({ error: 'Subscription failed', err })
    }
    // Success
    res.status(201).json({ success: 'Subscription created successfully!' })
  }
}

export default new SubscriptionController()
