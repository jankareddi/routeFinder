# Pull base image.
FROM dockerfile/nodejs-bower-grunt

# Set instructions.
# Ruby install
RUN \
  curl --progress http://cache.ruby-lang.org/pub/ruby/2.1/ruby-2.1.2.tar.gz | tar xz && \
  cd ruby-2.1.2 && \
  ./configure --disable-install-doc && \
  make && make install && \
  cd .. && rm -rf ruby-2.1.2* && \
  echo 'gem: --no-document' > /usr/local/etc/gemrc && \
  gem install bundler sass compass

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