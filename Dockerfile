# Pull base image.
FROM dockerfile/nodejs-bower-grunt

# Set instructions.

# dependencies
RUN \
  apt-get update && \
  apt-get -y install \
  build-essential \
  curl \
  git-core \
  python-software-properties \
  libcurl4-openssl-dev \
  libc6-dev \
  libreadline-dev \
  libssl-dev \
  libxml2-dev \
  libxslt1-dev \
  libyaml-dev \
  zlib1g-dev \
  vim \
  g++ \
  flex \
  bison \
  gperf \
  perl \
  libfontconfig1-dev \
  libicu-dev \
  libfreetype6 \
  libssl-dev \
  libpng-dev \
  libjpeg-dev

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