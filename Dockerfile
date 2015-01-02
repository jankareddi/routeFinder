# Pull base image.
FROM dockerfile/nodejs-bower-grunt

# Set instructions.
ADD package.json /app/
WORKDIR /app
RUN npm install
ADD bower.json /app/
RUN bower install --allow-root
ADD . /app

# Define command to run
CMD ["grunt", "serve:docker"]

# Expose ports.
EXPOSE 9000