Route Finder
==========

## Overview
A simple WIP application that identifies routes that can be shared between users of the system. Initial commit. Tons more to do...

## What works
1. POC
    * abilty to register a route to offer a ride
    * ability to request for a ride share
    * view all matching routes to send a request
    * accept/ reject an incoming request
    * view status of requests sent
    * turned on facebook authentication and all queries are now in the context of the current user
    * allow time to specify for both routes and hikes
    * handle user specific distance and time tolerance while matching ride shares

## What is next (prioritized more or less as sequenced)
Now that the the POC is complete, the intent is to develop the following:

1. Code clean up and add unit tests
2. Host on heroku
3. UI cleanup - all though bootstrap is being used, the UI is barely passable at the moment
4. Look for people in network to offer/ ask ride share (facebook friends to start with, maybe specific facebook groups the current user belongs to?)
