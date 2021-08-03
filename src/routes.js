/* eslint-disable prettier/prettier */
import { Router } from 'express'
// Token
import tokenVerify from './app/middlewares/auth'
// Controllers
import SessionController from './app/controller/sessionController'
import UserController from './app/controller/UserController'
import RideController from './app/controller/RideController'
import SubscriptionScontroller from './app/controller/SubscriptionController'

const routes = Router()


// Session
routes.post('/login', SessionController.store)
// New User
routes.post('/users', UserController.store)

// Middleware
routes.use(tokenVerify)

// Pedaling
routes.get('/pedaling', RideController.index)
routes.get('/pedaling/:id', RideController.show)
routes.post('/pedaling', RideController.store)
routes.delete('/pedaling/:id', RideController.delete)

// User
routes.get('/users', UserController.index)
routes.get('/users/:id', UserController.show)
routes.delete('/users/:id', UserController.delete)

// Subscription
routes.get('/pedaling/:pedal_id/subscriptions', SubscriptionScontroller.index)
routes.get('/pedaling/:pedal_id/subscriptions/:id', SubscriptionScontroller.show)
routes.post('/pedaling/:pedal_id/subscribe', SubscriptionScontroller.store)
routes.delete('/pedaling/:pedal_id/subscriptions/:id', SubscriptionScontroller.delete)

export default routes
