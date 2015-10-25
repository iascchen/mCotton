FROM meteorhacks/meteord:onbuild
RUN apt-get update && apt-get install -y graphicsmagick && apt-get clean
