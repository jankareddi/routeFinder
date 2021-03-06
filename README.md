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
    * add way point support (so users can specify "via" a certain location)
    * add Docker configuration

## What is next (prioritized more or less as sequenced)
Now that the the POC is complete, the intent is to develop the following:

1. Code clean up and add unit tests 
2. Host on heroku
3. UI cleanup - all though bootstrap is being used, the UI is barely passable at the moment
4. Look for people in network to offer/ ask ride share (facebook friends to start with, maybe specific facebook groups the current user belongs to?)

## Setting up the development environment
Follow these steps:

1. git clone https://github.com/jankareddi/routeFinder
2. cd routeFinder
3. create a copy of the file local.env.sample.js, rename it local.env.js and set values for FACEBOOK_ID  and FACEBOOK_SECRET
4. run 'npm install' from the cmd prompt
5. run 'bower install' from the cmd prompt
6. run 'grunt serve' and browse to http://localhost:9000

## Docker setup
Run all the commands below from the Docker shell

1. create a folder "app", cd "app"
2. git clone https://github.com/jankareddi/routeFinder
3. cd routeFinder
4. docker build -t jankareddi/routefinder
5. docker pull mongo (This will pull the mongo image)
6. docker run --name mongodev -d mongo (run mongo)
7. docker run -d -P --name rfweb --link mongodev:rfdb -e FACEBOOK_ID='id' -e FACEBOOK_SECRET='secret' jankareddi/routefinder

The last step will link the web app container with the mongo container.

Note: If you are running this from Windows, then you will need to get the IP of the docker VM first. Run the following command: boot2docker ip. Get the port by running the command docker ps. You can then navigate to the web application by browsing to http://ip:port where ip and port values are what you got from the previous 2 steps. This will only work on the local machine. If you need to make the application accessible on the network, you could add a port forward rule in the VM settings and it should now work. Leave the host and guest IPs empty, set guest port to the value obtained in the previous step and host IP to some unallocated port. I set it to 9000, so now the URL is the same whether I host it locally or via the docker container.
