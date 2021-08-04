import { v4 } from 'uuid'
import { isAfter, isBefore } from 'date-fns'
// Models
import User from '../model/User'
import Ride from '../model/Ride'
import Subscription from '../model/Subscription'

class SubscriptionController {
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
    if (!ride) {
      return res.status(400).json({ error: 'Ride not found' })
    }

    // Check if user already registered in this ride

    // // Check if the registrations haven't exhausted the quota
    const subs = await Subscription.findAll({
      where: { ride_id: pedal_id },
    })
    if (ride.participants_limit === subs.length) {
      return res.status(403).json({ error: 'Participants limit reached!' })
    }

    const exist = subs.find((rider) => rider.participant_id === req.userId)
    if (exist) {
      return res
        .status(403)
        .json({ error: 'You already registered in this ride' })
    }

    // Set subscription date
    const today = new Date()

    // eslint-disable-next-line prettier/prettier
      if(isAfter(today, ride.registration_end_date) || isBefore(today, ride.registration_start_date)){
      return res.status(403).json({
        error: 'Registration not avaible, check the registration deadline',
      })
    }

    // Create ride subscription and add more one participation to user
    try {
      await Subscription.create({
        id: v4(),
        ride_id: pedal_id,
        participant_id: req.userId,
        subscription_date: today,
      })

      participant.ride_participations += 1
      await User.update(
        { ride_participations: participant.ride_participations },
        { where: { id: req.userId } }
      )
    } catch (err) {
      res.status(500).json({ error: 'Subscription failed' })
    }
    // Success
    res.status(201).json({ success: 'Subscription created successfully!' })
  }

  async index(req, res) {
    // Ride ID spended in URL
    const { pedal_id } = req.params

    // Verify if ride exists
    try {
      await Ride.findByPk(pedal_id)
    } catch (err) {
      return res.status(400).json({ error: 'Ride not exists' })
    }

    // Search for subscriptions of the ride spended, and return then
    // if not find subscriptions, or occur an error to connect with database,
    // return an error message
    try {
      const subs = await Subscription.findAll({ where: { ride_id: pedal_id } })
      if (subs) res.status(200).json(subs)
      else res.status(400).json({ error: 'No subscriptions found' })
    } catch (err) {
      return res.status(400).json({ error: 'No subscriptions found' })
    }
  }

  async show(req, res) {
    // Ids passed in URL
    const { id, pedal_id } = req.params

    // Verify if ride exists
    try {
      await Ride.findByPk(pedal_id)
    } catch (err) {
      return res.status(400).json({ error: 'Ride not exists' })
    }

    // Check if subscription exists
    const sub = await Subscription.findByPk(id)
    if (!sub) res.status(400).json({ error: 'Subscription not found' })

    // Check if subscription belongs to the ride
    if (sub.ride_id !== pedal_id) {
      return res
        .status(400)
        .json({ erro: 'This subscription does not refer to this ride' })
    }

    return res.status(200).json(sub)
  }

  async delete(req, res) {
    // Ids passed in URL
    const { id, pedal_id } = req.params

    // Check if ride exists
    const ride = await Ride.findByPk(pedal_id)
    if (!ride) res.status(400).json({ error: 'Ride not found' })

    // Check if subscription exists
    const sub = await Subscription.findByPk(id)
    if (!sub) res.status(400).json({ error: 'Subscription not found' })

    // Verify if this subscription refer to this ride
    if (sub.ride_id !== pedal_id) {
      return res
        .status(400)
        .json({ error: 'This subscription does not refer to this ride ' })
    }
    // Delete subscription, and in case of ocour any error, return then
    try {
      await Subscription.destroy({ where: { id } })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' })
    }
    return res.status(204).json()
  }
}

export default new SubscriptionController()
