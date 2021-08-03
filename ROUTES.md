# How to use

Following here, is all information you need to use this API, including routes, required datas, wich one require an access token and how to get it.

## First Setps

To use all api resources, you need to create a user and do login with this credentials.

### Creating a user: 

To create a new user, you need to spend the following informations:
```
name: "String"
age: Integer
email: "String"
password: "String" 
```
Send a JSON object with this informations, and POST method to `` "/users" ``

<br>

## Token not required:

The following routes don't need an access token, when used with POST method:

1. Create users: `` /users ``
2. Login: `` /login ``

<br>

## How to get an access token

After you create your first user, use the email and password registered on ``/login `` with POST method,
it will return the user informations and an access token, copy it and use as Bearer JWT token to access all others routes.

<br>

## Users

Exist some functionalities to manage users, besides to create new users, when authenticated you can display all users or a specific one, as well delete it. 

GET Routes:<br>
- Find all users: `` /users ``
- Search for one specific user: ``/users/:user_id``

DELETE Routes:<br>
- Delete specific user: `` /user/:user_id``

<br>

## Rides

About rides, you can create, find and delete then using the following:

GET Routes:
- Find all rides: ``/pedaling``
- Find a specific one: ``/pedaling/:ride_id``

POST Routes: 
- Create a new ride: `` /pedaling`` 

To create rides you will need of some informations, change only the value of items:
````
    "name": "string",
    "registration_start_date": "MM-DD-YYYY"
    "registration_end_date": "MM-DD-YYYY"
    "additional_information":"string" (optional)
    "start_place": "string"
    "participants_limit": integer
````

DELETE Routes:
- Delete ride: ``/pedaling/:ride_id``

<br>

## Subscriptions

Also created users and rides, it's possbibe to subscribe an user to one or more rides, just need the ride id and be loged in with user.

Subscription can be managed too, using the following rules:

GET: 
- All subscriptions of certain ride: `` /pedaling/:ride_id/subscriptions ``
- A specific subscription of a ride: `` /pedaling/:ride_id/subscriptions/:subscription_id ``
<br>

POST:
- Subscribe in a ride: `` /pedaling/:ride_id/subscribe ``
<br>

DELETE: 
- Delete a ride subscription: `` /pedaling/:ride_id/subscriptions/:subscription_id ``
<br>

### How to subscribe in a ride

Sign in with a created user, take the token returned and the ride id that you want to subscribe.<br>
Send the ride id in URL following the POST route shown in the lines above, and the token.