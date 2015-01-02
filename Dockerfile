# Pull base image.
FROM dockerfile/nodejs-bower-grunt

# Set instructions.
RUN apt-get install ruby-full
RUN gem install sass
RUN gem install compass

ADD package.json /app/
ADD bower.json /app/
ADD . /app
WORKDIR /app
RUN npm install
RUN bower install --allow-root

# Define command to run
CMD ["grunt", "serve:docker"]

# Expose ports.
EXPOSE 9000